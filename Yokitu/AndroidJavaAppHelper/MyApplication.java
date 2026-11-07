package com.tiry.hi;

import android.app.Application;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        CrashHandler.getInstance().init(this);
        // 自动备份所有数据
        try { AccountManager.backupAllData(this); } catch (Exception e) { e.printStackTrace(); }
    }
}