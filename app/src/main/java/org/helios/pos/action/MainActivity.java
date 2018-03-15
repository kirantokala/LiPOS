package org.helios.pos.action;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.helios.pos.service.MyService;
import org.helios.pos.util.DeviceList;
import org.helios.pos.util.PrinterCommands;
import org.helios.pos.util.Utils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;

public class MainActivity extends AppCompatActivity {
    WebView mWebView;

    private String TAG = "Main Activity";
    EditText message;
    Button btnPrint, btnBill;

    byte FONT_TYPE;
    private static BluetoothSocket btsocket;
    private static OutputStream outputStream;

    @SuppressLint("NewApi")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);

        //this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.web_view);

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        //CookieManager.getInstance().setAcceptCookie(true);

        //CookieManager.getInstance().setAcceptThirdPartyCookies(mWebView, true);

        CookieManager.setAcceptFileSchemeCookies(true);

        mWebView.addJavascriptInterface(new WebViewJavaScriptInterface(this), "ANDROID");
        mWebView.setWebViewClient(new WebViewClient());
        mWebView.loadUrl("file:///android_asset/index.html");

        //stopService(new Intent(getBaseContext(), MyService.class));
    }

    @Override
    public void onBackPressed() {
        if (mWebView.getVisibility() == View.VISIBLE) {
            // dont pass back button action
            if (mWebView.canGoBack()) {
                mWebView.goBack();
            }
            return;
        } else {
            // pass back button action
            super.onBackPressed();
        }
    }

    private void quickPrinter(String msg) {
        String textToPrint = msg;
        Intent intent = new Intent("pe.diegoveloper.printing");
        //intent.setAction(android.content.Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(android.content.Intent.EXTRA_TEXT, textToPrint);
        startActivity(intent);
    }

    private void setSessionUser1(int userId) {
        SharedPreferences myprefs = getApplicationContext().getSharedPreferences("user", MODE_PRIVATE);
        myprefs.edit().putInt("userId", userId).commit();
        startService(new Intent(getBaseContext(), MyService.class));
    }

    private void setSessionStore1(String storeId) {
        SharedPreferences myprefs= getApplicationContext().getSharedPreferences("user", MODE_PRIVATE);
        myprefs.edit().putString("store_id",storeId).commit();
    }

    private void printBill1(String msg) {
        System.out.println("msg:"+msg);
        if(btsocket == null){
            Intent BTIntent = new Intent(getApplicationContext(), DeviceList.class);
            this.startActivityForResult(BTIntent, DeviceList.REQUEST_CONNECT_BT);
        }
        else{
            OutputStream opstream = null;
            try {
                opstream = btsocket.getOutputStream();
            } catch (IOException e) {
                e.printStackTrace();
            }
            outputStream = opstream;

            //print command
            try {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                outputStream = btsocket.getOutputStream();
                byte[] printformat = new byte[]{0x1B,0x21,0x03};
                outputStream.write(printformat);

                try {
                    JSONObject data = new JSONObject(msg);
                    String dateTime[] = getDateTime();
                    printCustom("Date : "+dateTime[0]+" "+dateTime[1],1,0);
                    printNewLine();
                    printCustom("Order no :" + data.getString("orderId"),1,0);
                    printNewLine();
                    printCustom(data.getJSONObject("store").getString("storeName"),3,1);
                    printNewLine();
                    printCustom("--------------------------------",1,1);
                    printNewLine();
                    JSONArray orderItems = data.getJSONArray("orderedItems");

                    JSONObject orderItem;
                    float parcelCost = 5;
                    for(int i=0;i<orderItems.length();i++){
                        orderItem = orderItems.getJSONObject(i);
                        printCustom(orderItem.getJSONObject("item").getString("itemName"),1,0);
                        printNewLine();
                        if(orderItem.getInt("parcelCount")>0){
                            printCustom("(P X " +orderItem.getInt("parcelCount")+" = "+orderItem.getInt("parcelCount")*parcelCost + ") + ",1,2);
                        }
                        printCustom("("+ orderItem.getInt("quantity")+" X "+orderItem.getJSONObject("item").getDouble("price")+") = "+(orderItem.getInt("quantity")*orderItem.getJSONObject("item").getDouble("price")+orderItem.getInt("parcelCount")*parcelCost),1,2);
                        printNewLine();
                    }
                    printNewLine();
                    printCustom("Total amount :"+ data.getString("totalAmount"),2,2);
                    printNewLine();
                    printCustom("--------------------------------",1,1);
                    printNewLine();
                    JSONArray paymentTypes = data.getJSONArray("paymentTypes");
                    JSONObject paymentType;
                    for(int i=0;i<paymentTypes.length();i++){
                        paymentType = paymentTypes.getJSONObject(i);
                        if(paymentType.getDouble("amount")>0){
                            printCustom(paymentType.getString("paymentTypeName") + " : " + paymentType.getDouble("amount"),1,0);
                            printNewLine();
                        }
                    }
                    printCustom("--------------------------------",1,1);
                    printCustom("THANK YOU. VISIT AGAIN",1,1);
                    printNewLine();
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                outputStream.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    protected void printDemo() {

        if(btsocket == null){

            Intent BTIntent = new Intent(getApplicationContext(), DeviceList.class);
            this.startActivityForResult(BTIntent, DeviceList.REQUEST_CONNECT_BT);
        }
        else{
            OutputStream opstream = null;
            try {
                opstream = btsocket.getOutputStream();
            } catch (IOException e) {
                e.printStackTrace();
            }
            outputStream = opstream;

            //print command
            try {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                outputStream = btsocket.getOutputStream();

                byte[] printformat = { 0x1B, 0*21, FONT_TYPE };
                //outputStream.write(printformat);

                //print title
                printUnicode();
                //print normal text
                printCustom(message.getText().toString(),0,0);
                printPhoto(R.drawable.img);
                printNewLine();
                printText("     >>>>   Thank you  <<<<     "); // total 32 char in a single line
                //resetPrint(); //reset printer
                printUnicode();
                printNewLine();
                printNewLine();

                outputStream.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    //print custom
    private void printCustom(String msg, int size, int align) {
        //Print config "mode"
        byte[] cc = new byte[]{0x1B,0x21,0x03};  // 0- normal size text
        //byte[] cc1 = new byte[]{0x1B,0x21,0x00};  // 0- normal size text
        byte[] bb = new byte[]{0x1B,0x21,0x08};  // 1- only bold text
        byte[] bb2 = new byte[]{0x1B,0x21,0x20}; // 2- bold with medium text
        byte[] bb3 = new byte[]{0x1B,0x21,0x10}; // 3- bold with large text
        try {
            switch (size){
                case 0:
                    outputStream.write(cc);
                    break;
                case 1:
                    outputStream.write(bb);
                    break;
                case 2:
                    outputStream.write(bb2);
                    break;
                case 3:
                    outputStream.write(bb3);
                    break;
            }

            switch (align){
                case 0:
                    //left align
                    outputStream.write(PrinterCommands.ESC_ALIGN_LEFT);
                    break;
                case 1:
                    //center align
                    outputStream.write(PrinterCommands.ESC_ALIGN_CENTER);
                    break;
                case 2:
                    //right align
                    outputStream.write(PrinterCommands.ESC_ALIGN_RIGHT);
                    break;
            }
            outputStream.write(msg.getBytes());
            outputStream.write(PrinterCommands.LF);
            //outputStream.write(cc);
            //printNewLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    //print photo
    public void printPhoto(int img) {
        try {
            Bitmap bmp = BitmapFactory.decodeResource(getResources(),
                    img);
            if(bmp!=null){
                byte[] command = Utils.decodeBitmap(bmp);
                outputStream.write(PrinterCommands.ESC_ALIGN_CENTER);
                printText(command);
            }else{
                Log.e("Print Photo error", "the file isn't exists");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("PrintTools", "the file isn't exists");
        }
    }

    //print unicode
    public void printUnicode(){
        try {
            outputStream.write(PrinterCommands.ESC_ALIGN_CENTER);
            printText(Utils.UNICODE_TEXT);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    //print new line
    private void printNewLine() {
        try {
            outputStream.write(PrinterCommands.FEED_LINE);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void resetPrint() {
        try{
            outputStream.write(PrinterCommands.ESC_FONT_COLOR_DEFAULT);
            outputStream.write(PrinterCommands.FS_FONT_ALIGN);
            outputStream.write(PrinterCommands.ESC_ALIGN_LEFT);
            outputStream.write(PrinterCommands.ESC_CANCEL_BOLD);
            outputStream.write(PrinterCommands.LF);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //print text
    private void printText(String msg) {
        try {
            // Print normal text
            outputStream.write(msg.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    //print byte[]
    private void printText(byte[] msg) {
        try {
            // Print normal text
            outputStream.write(msg);
            printNewLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private String leftRightAlign(String str1, String str2) {
        String ans = str1 +str2;
        if(ans.length() <31){
            int n = (31 - str1.length() + str2.length());
            ans = str1 + new String(new char[n]).replace("\0", " ") + str2;
        }
        return ans;
    }


    private String[] getDateTime() {
        final Calendar c = Calendar.getInstance();
        String dateTime [] = new String[2];
        dateTime[0] = c.get(Calendar.DAY_OF_MONTH) +"/"+ c.get(Calendar.MONTH) +"/"+ c.get(Calendar.YEAR);
        dateTime[1] = c.get(Calendar.HOUR_OF_DAY) +":"+ c.get(Calendar.MINUTE);
        return dateTime;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        try {
            if(btsocket!= null){
                outputStream.close();
                btsocket.close();
                btsocket = null;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        try {
            btsocket = DeviceList.getSocket();
            if(btsocket != null){
                printText("SASdsdasadasd");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public class WebViewJavaScriptInterface {

        private Context context;

        /*
         * Need a reference to the context in order to sent a post message
         */
        public WebViewJavaScriptInterface(Context context) {
            this.context = context;
        }

        /*
         * This method can be called from Android. @JavascriptInterface
         * required after SDK version 17.
         */
        @JavascriptInterface
        public void printBill(String msg) {
            //quickPrinter(msg);
            printBill1(msg);
        }

        @JavascriptInterface
        public void setSessionUser(String userId) {
            setSessionUser1(Integer.parseInt(userId));
        }

        @JavascriptInterface
        public void setSessionStore(String storeId) {
            setSessionStore1(storeId);
        }

        @JavascriptInterface
        public void setToast(String msg) {
            Toast.makeText(context, msg, Toast.LENGTH_SHORT);
        }
    }
}