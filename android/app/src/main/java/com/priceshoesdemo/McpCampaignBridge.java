package com.priceshoesdemo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class McpCampaignBridge {

    private static final List<WritableMap> buffer = new ArrayList<>();
    private static ReactApplicationContext reactContext;

    public static synchronized void init(ReactApplicationContext context) {
        reactContext = context;
    }

    public static synchronized void store(WritableMap payload) {
        buffer.add(payload);
        flushIfReady();
    }

    public static String addListener(String eventName) {
        return eventName;
    }

    public static synchronized void flushIfReady() {
        addListener("FeaturedProductCampaign");
        if (reactContext == null ||
                !reactContext.hasActiveCatalystInstance()) {
            return;
        }

        for (WritableMap map : buffer) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("FeaturedProductCampaign", map);
        }
        buffer.clear();
    }
}
