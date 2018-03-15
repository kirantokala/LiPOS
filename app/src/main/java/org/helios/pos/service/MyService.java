package org.helios.pos.service;

import android.annotation.TargetApi;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.TaskStackBuilder;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.widget.Toast;

import org.helios.pos.action.R;
import org.helios.pos.util.HttpGetRequest;
import org.helios.pos.util.NotificationView;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutionException;

/**
 * Created by SAI KIRAN on 02-03-2018.
 */

public class MyService extends Service {

    String baseUrl = "http://18.221.170.127:8080/POS/pos?";

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Let it continue running until it is stopped.
        //addNotification();
        final Handler ha=new Handler();
        ha.postDelayed(new Runnable() {

            @Override
            public void run() {
                testing();
                ha.postDelayed(this, 10000);
            }
        }, 10000);
        return START_STICKY;
    }

    public void testing(){
        System.out.println("Hello");
        Toast.makeText(this, "Testing", Toast.LENGTH_LONG).show();
    }

    public String getDetails(){
        String result = "";
        String myUrl = baseUrl+"action=getTransactionHomeData&date_from=2017-10-01&date_to=2018-03-02&store_id=ts&user_id=6&role_id=8";

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

            return jsonObject.getString("result");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return "Sai";
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    private void addNotification() {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this).setSmallIcon(R.drawable.ic_launcher_background).setContentTitle("Notification Example").setContentText("This is a test notification");

        Intent intent = new Intent(this, NotificationView.class);
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
        stackBuilder.addParentStack(NotificationView.class);
        stackBuilder.addNextIntent(intent);


        PendingIntent pendingIntent = stackBuilder.getPendingIntent(0,PendingIntent.FLAG_UPDATE_CURRENT);
        builder.setContentIntent(pendingIntent);

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        manager.notify(0,builder.build());
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Toast.makeText(this, "Service Destroyed", Toast.LENGTH_LONG).show();
    }
}