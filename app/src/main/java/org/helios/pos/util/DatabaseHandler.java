package org.helios.pos.util;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import org.helios.pos.model.Item;
import org.helios.pos.model.ItemOrder;
import org.helios.pos.model.OrderItem;
import org.helios.pos.model.PaymentType;
import org.helios.pos.model.User;

import java.util.ArrayList;
import java.util.List;

public class DatabaseHandler extends SQLiteOpenHelper {

    private static final int DATABASE_VERSION = 7;

    private static final String DATABASE_NAME = "pos";

    public DatabaseHandler(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {

        String CREATE_ITEM_ORDER_TABLE = "CREATE TABLE `item_order` (\n" +
                "  `order_id` INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  `user_id` int(11) DEFAULT NULL,\n" +
                "  `store_id` varchar(45) DEFAULT NULL,\n" +
                "  `order_date` timestamp NULL DEFAULT NULL,\n" +
                "  `total_amount` float DEFAULT NULL,\n" +
                "  `status_id` int(11) NOT NULL DEFAULT '4',\n" +
                "  `direct` smallint(11) DEFAULT '1',\n" +
                "  `active` smallint(11) DEFAULT '1',\n" +
                "  `sync_status` smallint(11) DEFAULT '0'\n" +
                ")";

        db.execSQL(CREATE_ITEM_ORDER_TABLE);

        String CREATE_ORDER_ITEM_TABLE = "CREATE TABLE `order_item` (\n" +
                "  `order_item_id`  INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  `order_id` int(11) DEFAULT NULL,\n" +
                "  `item_id` int(11) DEFAULT NULL,\n" +
                "  `item_quantity` int(11) DEFAULT NULL,\n" +
                "  `parcel_count` int(11) DEFAULT NULL,\n" +
                "  `status_id` int(11) DEFAULT '1',\n" +
                "  `active` smallint(11) DEFAULT '1'\n" +
                ")";

        db.execSQL(CREATE_ORDER_ITEM_TABLE);

        String CREATE_ITEM_PAYMENT_TABLE = "CREATE TABLE `item_payment` (\n" +
                "  `item_payment_id`  INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  `order_id` int(11) DEFAULT NULL,\n" +
                "  `payment_type_id` int(11) DEFAULT NULL,\n" +
                "  `amount` float DEFAULT NULL,\n" +
                "  `active` smallint(11) DEFAULT '1'\n" +
                ")";

        db.execSQL(CREATE_ITEM_PAYMENT_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS item_order");

        db.execSQL("DROP TABLE IF EXISTS order_item");

        db.execSQL("DROP TABLE IF EXISTS item_payment");

        onCreate(db);
    }

    public void addItemOrder(ItemOrder order) {
        SQLiteDatabase db = this.getWritableDatabase();
 
        ContentValues values = new ContentValues();
        values.put("user_id", order.getUser().getUserId());
        values.put("store_id", order.getStoreId());
        values.put("order_date", order.getOrderDate());
        values.put("total_amount", order.getTotalAmount());
        values.put("sync_status", 0);
        if (order.getUser().getRole().getRoleId() == 8) {
            values.put("status_id", 1);
        } else {
            values.put("status_id", 2);
        }

        values.put("direct", order.getDirect());

        long id = db.insert("item_order", null, values);

        OrderItem orderItem;
        for(int i=0;i<order.getOrderedItems().size();i++){
            orderItem = order.getOrderedItems().get(i);
            values = new ContentValues();
            values.put("order_id", id);
            values.put("item_id", orderItem.getItem().getItemId());
            values.put("item_quantity", orderItem.getQuantity());
            values.put("parcel_count", orderItem.getParcelCount());

            db.insert("order_item", null, values);
        }

        PaymentType paymentType;
        for(int i=0;i<order.getPaymentTypes().size();i++){
            paymentType = order.getPaymentTypes().get(i);
            values = new ContentValues();
            values.put("order_id", id);
            values.put("payment_type_id", paymentType.getPaymentTypeId());
            values.put("amount", paymentType.getAmount());

            db.insert("item_payment", null, values);
        }
        db.close();
    }

    public List<ItemOrder> getItemOrders() {
        List<ItemOrder> orderList = new ArrayList<ItemOrder>();
        String selectQuery = "SELECT  * FROM item_order where sync_status=0";
 
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);

        if (cursor.moveToFirst()) {
            do {
                ItemOrder order = new ItemOrder();
                order.setOrderId(Integer.parseInt(cursor.getString(0)));
                order.setOrderDate(cursor.getString(3));
                order.setUser(new User(Integer.parseInt(cursor.getString(1))));
                order.setStoreId(cursor.getString(2));
                order.setTotalAmount(Float.parseFloat(cursor.getString(4)));
                order.setDirect(Integer.parseInt(cursor.getString(6)));
                order.setOrderedItems(getOrderedItems(order.getOrderId()));
                order.setPaymentTypes(getItemPayments(order.getOrderId()));
                order.setSyncStatus(Integer.parseInt(cursor.getString(8)));

                orderList.add(order);
            } while (cursor.moveToNext());
        }
        return orderList;
    }

    public List<OrderItem> getOrderedItems(int orderId) {
        List<OrderItem> orderItemList = new ArrayList<OrderItem>();
        String selectQuery = "SELECT  * FROM order_item where order_id = "+orderId;

        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);

        OrderItem orderItem;
        if (cursor.moveToFirst()) {
            do {
                orderItem = new OrderItem();
                orderItem.setOrderItemId(Integer.parseInt(cursor.getString(0)));
                orderItem.setItem(new Item(Integer.parseInt(cursor.getString(2))));
                orderItem.setQuantity(Integer.parseInt(cursor.getString(3)));
                orderItem.setParcelCount(Integer.parseInt(cursor.getString(4)));
                orderItemList.add(orderItem);
            } while (cursor.moveToNext());
        }
        return orderItemList;
    }

    public List<PaymentType> getItemPayments(int orderId) {
        List<PaymentType> paymentTypeList = new ArrayList<PaymentType>();
        String selectQuery = "SELECT  * FROM item_payment where order_id = "+orderId;

        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);

        PaymentType paymentType;
        int paymentTypeId;
        float amount;
        if (cursor.moveToFirst()) {
            do {
                paymentTypeId = Integer.parseInt(cursor.getString(2));
                amount = Float.parseFloat(cursor.getString(3));
                paymentTypeList.add(new PaymentType(paymentTypeId,amount));
            } while (cursor.moveToNext());
        }
        return paymentTypeList;
    }

    public int dbSyncCount(){
        int count = 0;
        String selectQuery = "SELECT * from item_order where sync_status = 0";
        SQLiteDatabase database = this.getWritableDatabase();
        Cursor cursor = database.rawQuery(selectQuery,null);
        count = cursor.getCount();
        database.close();
        return count;
    }

    public void updateSyncStatus(int id, int status){
        String updateQuery = "update item_order set sync_status = "+status+" where order_id = "+id;
        SQLiteDatabase database = this.getWritableDatabase();
        database.execSQL(updateQuery);
        database.close();
    }
}