package com.tiry.hi;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Process;
import android.widget.Toast;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class CrashHandler implements Thread.UncaughtExceptionHandler {

    private static final String CHANNEL_ID = "crash_channel";
    private static final String CHANNEL_NAME = "崩溃报告";
    private static final int NOTIFICATION_ID = 9999;

    private static CrashHandler instance;
    private Context context;

    private CrashHandler() {}

    public static synchronized CrashHandler getInstance() {
        if (instance == null) {
            instance = new CrashHandler();
        }
        return instance;
    }

    public void init(Context context) {
        this.context = context.getApplicationContext();
        Thread.setDefaultUncaughtExceptionHandler(this);
        createNotificationChannel();
    }

    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
        String crashInfo = getCrashInfo(thread, ex);
        showCrashNotification(crashInfo);

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Thread.setDefaultUncaughtExceptionHandler(null);
        Process.killProcess(Process.myPid());
        System.exit(1);
    }

    private String getCrashInfo(Thread thread, Throwable ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());
        pw.println("========== 崩溃报告 ==========");
        pw.println("时间: " + time);
        pw.println("应用: TiryHi");
        pw.println("包名: com.tiry.hi");
        pw.println("线程: " + thread.getName());
        pw.println("========================================");
        pw.println();

        ex.printStackTrace(pw);

        Throwable cause = ex.getCause();
        if (cause != null) {
            pw.println();
            pw.println("原因: " + cause.toString());
        }

        pw.close();
        return sw.toString();
    }

    private void showCrashNotification(final String crashInfo) {
        if (context == null) return;

        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;

        Intent intent = new Intent(context, CrashCopyReceiver.class);
        intent.putExtra("crash_info", crashInfo);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
			context, 0, intent,
			PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new Notification.Builder(context, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(context);
        }

        builder.setSmallIcon(android.R.drawable.ic_dialog_alert)
			.setContentTitle("💥 TiryHi 崩溃了")
			.setContentText("点击复制崩溃报告到剪贴板")
			.setPriority(Notification.PRIORITY_HIGH)
			.setAutoCancel(true)
			.setContentIntent(pendingIntent);

        manager.notify(NOTIFICATION_ID, builder.build());
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
				CHANNEL_ID,
				CHANNEL_NAME,
				NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("应用崩溃报告通知");

            NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}