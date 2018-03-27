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
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;

import org.helios.pos.action.R;
import org.helios.pos.model.ItemOrder;
import org.helios.pos.model.ItemOrderList;
import org.helios.pos.util.DatabaseHandler;
import org.helios.pos.util.HttpGetRequest;
import org.helios.pos.util.HttpPostRequest;
import org.helios.pos.util.NotificationView;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Created by SAI KIRAN on 02-03-2018.
 */

public class SyncService extends Service {

    String baseUrl = "http://18.221.170.127:8080/POS/pos?";

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Let it continue running until it is stopped.
        final Handler ha=new Handler();
        ha.postDelayed(new Runnable() {

            @Override
            public void run() {
                syncItemOrders();
                //testing();
                ha.postDelayed(this, 10000);
            }
        }, 10000);
        return START_STICKY;
    }

    public void testing(){
        System.out.println("Hello");
        Toast.makeText(this, "Testing", Toast.LENGTH_LONG).show();
    }

    private void syncItemOrders(){
        System.out.println("Started syncing item orders");
        DatabaseHandler db = new DatabaseHandler(getApplicationContext());

        ItemOrderList itemOrderList = new ItemOrderList();
        List<ItemOrder> orders = db.getAllItemOrders();

        itemOrderList.setItemOrders(orders);

        for (ItemOrder cn : orders) {
            String log = "Id: " + cn.getOrderId() + " ,Store: " + cn.getStoreId() + " , totalAmount: " + cn.getTotalAmount();
            // Writing Contacts to log
            Log.d("Name: ", log);
        }

        String myUrl = baseUrl + "action=placeItemOrders";
        HttpPostRequest postRequest = null;
        try {
            postRequest = new HttpPostRequest(itemOrderList);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        postRequest.execute(myUrl);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Toast.makeText(this, "Service Destroyed", Toast.LENGTH_LONG).show();
    }
}