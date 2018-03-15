package org.helios.pos.util;

import android.app.Activity;
import android.os.Bundle;

import org.helios.pos.action.R;

/**
 * Created by SAI KIRAN on 02-03-2018.
 */

public class NotificationView extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.notification_view);
    }
}
