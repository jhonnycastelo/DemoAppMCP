package com.priceshoesdemo;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.evergage.android.Evergage;
import com.evergage.android.Context;
import com.evergage.android.promote.Category;

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
            // Evento genérico view:Home, view:Products, etc.
            ctx.trackAction("view:" + pageName);
        }
    }

    // 👇 ESTE es el método que vas a llamar desde JS
    @ReactMethod
    public void trackCategoryView(String section, String categoryName) {
        Context ctx = Evergage.getInstance().getGlobalContext();
        if (ctx == null) return;

        // Ej: "Dama/Bota" o "Caballero/Correr"
        String categoryId = section + "/" + categoryName;

        // Category con ID obligatorio
        Category category = new Category(categoryId);
        category.name = categoryName;  // para que se vea legible en MCP

        // Método oficial del SDK de Android para View Category
        ctx.viewCategory(category);
    }
}