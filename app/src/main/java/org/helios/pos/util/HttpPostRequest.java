package org.helios.pos.util;

import android.os.AsyncTask;

import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by SAI KIRAN on 09-01-2018.
 */

public class HttpPostRequest extends AsyncTask<String, Void, Void> {
    public static final String REQUEST_METHOD = "POST";
    public static final int READ_TIMEOUT = 15000;
    public static final int CONNECTION_TIMEOUT = 15000;

    JSONObject postData;

    public HttpPostRequest(Object postData) throws JSONException {
        if (postData != null) {
            this.postData = new JSONObject("{\"data\":"+new Gson().toJson(postData)+"}");
            System.out.println("postData:"+postData);
        }
    }

    @Override
    protected Void doInBackground(String... strings) {
        String stringUrl = strings[0];
        String result = "";
        String inputLine;

        try {
            URL url = new URL(stringUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoInput(true);
            connection.setDoOutput(true);
            connection.setRequestMethod(REQUEST_METHOD);
            connection.setReadTimeout(READ_TIMEOUT);
            connection.setConnectTimeout(CONNECTION_TIMEOUT);
            connection.setRequestProperty("Content-Type", "application/json");

            if (this.postData != null) {
                OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream());
                writer.write(postData.toString());
                writer.flush();
            }

            int statusCode = connection.getResponseCode();
            if (statusCode == 200) {
                InputStreamReader streamReader = new
                        InputStreamReader(connection.getInputStream());
            }
            //Connect to our url
            connection.connect();

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}