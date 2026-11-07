package com.tiry.hi;

import android.content.BroadcastReceiver;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

public class CrashCopyReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String crashInfo = intent.getStringExtra("crash_info");
        if (crashInfo == null || crashInfo.isEmpty()) {
            Toast.makeText(context, "没有崩溃报告可复制", Toast.LENGTH_SHORT).show();
            return;
        }

        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("Crash Report", crashInfo);
        clipboard.setPrimaryClip(clip);

        Toast.makeText(context, "✅ 崩溃报告已复制到剪贴板", Toast.LENGTH_LONG).show();
    }
}