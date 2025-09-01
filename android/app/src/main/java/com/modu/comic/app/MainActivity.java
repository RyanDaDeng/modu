package com.modu.comic.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = this.bridge.getWebView();
        WebSettings webSettings = webView.getSettings();

        // ⚡ 关键配置
        webSettings.setJavaScriptEnabled(true); // 开启 JS
        webSettings.setDomStorageEnabled(true); // 开启 localStorage/sessionStorage
        webSettings.setAllowFileAccess(true);   // 有时加载本地资源需要
        webSettings.setDatabaseEnabled(true);   // IndexedDB / WebSQL
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        // 允许 https 页面加载 http 资源（有时字体/CDN 会触发）

        // （可选）提高兼容性
        webSettings.setAllowContentAccess(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
    }
}
