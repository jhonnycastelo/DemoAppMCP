package com.priceshoesdemo;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.evergage.android.Evergage;
import com.evergage.android.Context;

public class PersonalizationModule extends ReactContextBaseJavaModule {

    public PersonalizationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        // Este es el nombre con el que lo veremos desde JS
        return "PersonalizationModule";
    }

    @ReactMethod
    public void trackPageView(String pageName) {
        Context ctx = Evergage.getInstance().getGlobalContext();
        if (ctx != null) {
            // Acción simple para distinguir en Event Stream
            ctx.trackAction("view:" + pageName);
        }
    }
}