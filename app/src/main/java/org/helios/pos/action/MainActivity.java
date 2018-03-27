package org.helios.pos.action;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.helios.pos.model.ItemOrder;
import org.helios.pos.service.SyncService;
import org.helios.pos.util.DatabaseHandler;
import org.helios.pos.util.DeviceList;
import org.helios.pos.util.HttpGetRequest;
import org.helios.pos.util.PrinterCommands;
import org.helios.pos.util.Utils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.concurrent.ExecutionException;

public class MainActivity extends AppCompatActivity {
    private static BluetoothSocket btsocket;
    private static OutputStream outputStream;
    WebView mWebView;
    EditText message;
    Button btnPrint, btnBill;
    String mPrintmsg;
    byte FONT_TYPE;
    String baseUrl = "http://18.221.170.127:8080/POS/pos?";
    private String TAG = "Main Activity";

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

    @SuppressLint("NewApi")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);

        //this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_main);

        stopService();
        //startService();

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


        try {
            PackageInfo pInfo = this.getPackageManager().getPackageInfo(getPackageName(), 0);
            String version = pInfo.versionName;
            int verCode = pInfo.versionCode;
            System.out.println("version Code:"+verCode);

           /* VersionChecker versionChecker = new VersionChecker();
            String latestVersion = versionChecker.execute().get();*/

            int latVerCode = getLatestVersionCode();

            if(verCode == latVerCode){
                mWebView.loadUrl("file:///android_asset/index.html");
            }
            else {
                Toast.makeText(getApplicationContext(), "Update the app from playstore", Toast.LENGTH_SHORT).show();
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        //stopService(new Intent(getBaseContext(), SyncService.class));
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

    public void startService() {
        startService(new Intent(getBaseContext(), SyncService.class));
    }

    // Method to stop the service
    public void stopService() {
        stopService(new Intent(getBaseContext(), SyncService.class));
    }

    public int getLatestVersionCode(){
        String result = "";
        String myUrl = baseUrl+"action=getVersionCode";

        HttpGetRequest getRequest = new HttpGetRequest();
        try {
            result = getRequest.execute(myUrl).get();
            System.out.println("Result:"+result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        Context context = getApplicationContext();

        try {
            JSONObject jsonObject = new JSONObject(result);
            return jsonObject.getInt("result");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return 0;
    }

    private void quickPrinter(String msg) {
        String textToPrint = msg;
        Intent intent = new Intent("pe.diegoveloper.printing");
        //intent.setAction(android.content.Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(android.content.Intent.EXTRA_TEXT, textToPrint);
        startActivity(intent);
    }

    private void placeItemOrder(String itemOrderJsonStr){
        System.out.println("Json Str : " + itemOrderJsonStr);
        DatabaseHandler db = new DatabaseHandler(this);

        ItemOrder itemOrder = new ItemOrder();
        try{
            JSONObject jObj = new JSONObject(itemOrderJsonStr);

            Gson gson = new GsonBuilder().create();
            itemOrder = gson.fromJson(jObj.toString(), ItemOrder.class);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Log.d("Insert: ", "Inserting ..");
        db.addItemOrder(itemOrder);
    }

    private void printBill1(String msg) {
        System.out.println("msg:"+msg);
        mPrintmsg = msg;
        if(btsocket == null){
            Intent BTIntent = new Intent(getApplicationContext(), DeviceList.class);
            this.startActivityForResult(BTIntent, DeviceList.REQUEST_CONNECT_BT);
        }
        else{
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
                    JSONObject data = new JSONObject(mPrintmsg);
                    String dateTime[] = getDateTime();
                    printCustom("Date : "+dateTime[0]+" "+dateTime[1],1,0);
                    printCustom("Order no :" + data.getString("orderId"),1,0);
                    printNewLine();
                    printCustom(data.getJSONObject("store").getString("storeName"),3,1);
                    printCustom("--------------------------------",1,1);

                    JSONArray orderItems = data.getJSONArray("orderedItems");

                    JSONObject orderItem;
                    int parcelCost = 5;
                    for(int i=0;i<orderItems.length();i++){
                        orderItem = orderItems.getJSONObject(i);
                        String pStr ="";
                        String itemName = orderItem.getJSONObject("item").getString("itemName");
                        int orq = orderItem.getInt("quantity");
                        int price = orderItem.getJSONObject("item").getInt("price");
                        int quantity = orderItem.getInt("quantity");
                        int pcount = orderItem.getInt("parcelCount");

                        if(orderItem.getInt("parcelCount")>0){
                            pStr ="(P X " +pcount+" = "+pcount*parcelCost + ") + ";
                        }

                        printCustom(itemName,1,0);
                        printCustom(pStr+"("+ orq+" X "+price+") = "+(quantity*price+pcount*parcelCost),1,2);
                    }
                    printCustom("--------------------------------",1,1);
                    printCustom("Total : "+ data.getString("totalAmount"),3,2);
                    printCustom("--------------------------------",1,1);
                    JSONArray paymentTypes = data.getJSONArray("paymentTypes");
                    JSONObject paymentType;
                    for(int i=0;i<paymentTypes.length();i++){
                        paymentType = paymentTypes.getJSONObject(i);
                        if(paymentType.getDouble("amount")>0){
                            printCustom(paymentType.getString("paymentTypeName") + " : " + paymentType.getInt("amount"),1,0);
                        }
                    }
                    printCustom("--------------------------------",1,1);
                    printCustom("THANK YOU. VISIT AGAIN",1,1);
                    printNewLine();
                    printNewLine();
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
            //print command
            try {
                try {
                    Thread.sleep(500);
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
                printBill1(mPrintmsg);
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
        public void placeItemOrderInLocalDB(String itemOrder) {
            placeItemOrder(itemOrder);
        }

        @JavascriptInterface
        public void setToast(String msg) {
            Toast.makeText(context, msg, Toast.LENGTH_SHORT);
        }
    }


}