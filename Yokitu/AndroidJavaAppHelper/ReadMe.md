# TiryHi Android App 核心代码片段

本目录下的代码均提取自 **TiryHi Android App** 的实际生产环境，供团队内部成员及开源社区学习交流使用。

> ⚠️ **声明**：此处展示的是核心功能片段（如全局异常捕获、数据备份等），并非完整的 App 源码工程。部分业务逻辑和 UI 代码未包含在内。

## 📂 文件说明

### 1. 全局崩溃拦截机制
*   **`CrashHandler.java`**
    *   **功能**：全局 `UncaughtExceptionHandler` 实现。当 App 发生不可预见的崩溃时，拦截错误信息，并发送一条高优先级通知栏提醒。
    *   **设计**：将完整的堆栈日志打包，用户只需点击通知，即可将日志复制到剪贴板，方便反馈给开发者。
*   **`CrashCopyReceiver.java`**
    *   **功能**：配合 `CrashHandler` 使用的广播接收器。接收崩溃信息并写入系统剪贴板。
*   **`MyApplication.java`**
    *   **功能**：自定义 Application 类。在 App 启动时初始化崩溃捕获机制，并触发数据的自动备份。

---

## 🚀 如何使用这些代码？

如果你要将这些代码应用到你自己的 Android 项目中，请注意以下几点：

1.  **修改包名**：请确保文件头部的 `package com.tiry.hi;` 替换为你自己的包名。
2.  **注册 Application 与 Receiver**：
    在你的 `AndroidManifest.xml` 中，需要声明 `MyApplication` 和 `CrashCopyReceiver`。
    ```xml
    <application
        android:name=".MyApplication"
        ...>
        <!-- 其他组件 -->
        
        <receiver android:name=".CrashCopyReceiver" android:exported="false" />
    </application>
    ```
3.  **通知权限**：在 Android 13 (API 33) 及以上版本中，发送通知需要动态申请 `POST_NOTIFICATIONS` 权限，否则用户将看不到崩溃通知。

---

## 📌 后续更新计划

这个文件夹将作为 Tiry 团队 Android 开发的技术沉淀池，后续我们会逐步补充内容。

---

## 🤝 联系我们

如果你对这些代码有任何疑问，或者想加入我们的开发交流：
- 访问官网：[Tiry 主页](https://yokitu.github.io/TiryWebsite/)
- 联系团队：[联系我们](https://yokitu.github.io/TiryWebsite/contact.html)

**Copyright © Tiry 团队. 保留所有权利。**