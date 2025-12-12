package com.priceshoesdemo;

import androidx.annotation.NonNull;
import android.app.Activity;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.evergage.android.Evergage;
import com.evergage.android.Context;
import com.evergage.android.promote.Category;
import com.evergage.android.promote.LineItem;
import com.evergage.android.promote.Product;
import com.evergage.android.CampaignHandler;
import com.evergage.android.Campaign;
import com.evergage.android.Screen;
import org.json.JSONObject;

public class PersonalizationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private Campaign currentCampaign;

    public PersonalizationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        // Este es el nombre con el que lo veremos desde JS
        return "PersonalizationModule";
    }

    @ReactMethod
    public void registerCampaignHandler() {
        Activity activity = getCurrentActivity();

        if (activity != null) {
            Log.e("MCP", "[MCP] Activity is" + activity);
        }

        Screen screen = Evergage.getInstance().getScreenForActivity(activity);

        if (screen == null) {
            Log.e("MCP", "[MCP] Screen is NULL — Evergage screen was not started yet.");
            return;
        }

        Log.d("MCP", "[MCP] Screen is READY. Registering campaign handler…");

        screen.setCampaignHandler(new CampaignHandler() {
            @Override
            public void handleCampaign(Campaign campaign) {
                try {
                    currentCampaign = campaign;
                    JSONObject data = campaign.getData();
                    WritableMap payload = Arguments.createMap();
                    // Example keys — match what you defined in the campaign payload
                    if (data.has("productId")) {
                        payload.putString("productId", data.optString("productId"));
                    }
                    if (data.has("name")) {
                        payload.putString("name", data.optString("name"));
                    }
                    if (data.has("imageUrl")) {
                        payload.putString("imageUrl", data.optString("imageUrl"));
                    }
                    if (data.has("price")) {
                        // price could be number or string — adapt as needed
                        payload.putString("price", data.optString("price"));
                    }
                    if (data.has("category")) {
                        payload.putString("category", data.optString("category"));
                    }

                    sendEvent("FeaturedProductCampaign", payload);

                } catch (Exception e) {
                    Log.e("MCP", "Error parsing mobile data campaign", e);
                }
            }
        }, "Featured Product");
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
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
        if (ctx == null)
            return;

        // Ej: "Dama/Bota" o "Caballero/Correr"
        String categoryId = section + "/" + categoryName;

        // Category con ID obligatorio
        Category category = new Category(categoryId);
        category.name = categoryName; // para que se vea legible en MCP

        // Método oficial del SDK de Android para View Category
        ctx.viewCategory(category);
    }

    @ReactMethod
    public void addToCart(ReadableMap productMap) {
        try {
            String productId = productMap.getString("productId");
            double price = productMap.getDouble("price");
            int quantity = productMap.getInt("quantity");
            String name = productMap.getString("name");

            JSONObject json = new JSONObject();

            json.put("id", productId);
            json.put("name", name);
            json.put("price", price);
            // Create Product (concrete subclass of Item)
            Product product = Product.fromJSONObject(json, productId);

            // Add custom product attributes
            // JSONObject attributes = new JSONObject();
            // attributes.put("price", price);
            // product.setAttributes(attributes);

            // Create LineItem with the Product item
            LineItem lineItem = new LineItem(product, quantity);

            // Track event
            Context ctx = Evergage.getInstance().getGlobalContext();
            ctx.addToCart(lineItem);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void trackFeaturedProductClick(String productId) {

        if (currentCampaign != null) {
            Evergage.getInstance().getScreenForActivity(getCurrentActivity())
                    .trackClickthrough(currentCampaign);
        }
    }

    @ReactMethod
    public void trackFeaturedProductDismiss(String productId) {
        if (currentCampaign != null) {
            Evergage.getInstance().getScreenForActivity(getCurrentActivity())
                    .trackDismissal(currentCampaign);
        }
    }

    /*
     * @ReactMethod
     * public void addToCart(ReadableMap productMap) {
     * try {
     * // Convert ReadableMap → JSONObject
     * JSONObject json = new JSONObject();
     * 
     * json.put("id", productMap.getString("id"));
     * json.put("name", productMap.getString("name"));
     * json.put("price", productMap.getDouble("price"));
     * 
     * // Custom attributes
     * JSONObject attrs = new JSONObject();
     * 
     * if (productMap.hasKey("color")) {
     * attrs.put("color", productMap.getString("color"));
     * }
     * 
     * if (productMap.hasKey("inventory")) {
     * attrs.put("inventory", productMap.getInt("inventory"));
     * }
     * 
     * // Attach custom attributes into the product JSON
     * json.put("attributes", attrs);
     * 
     * // Create Product using fromJSONObject
     * String productId = productMap.getString("id");
     * Product product = Product.fromJSONObject(json, productId);
     * 
     * // Quantity
     * int quantity = productMap.getInt("quantity");
     * 
     * // Build LineItem
     * LineItem lineItem = new LineItem(product, quantity);
     * 
     * // Track the event
     * Evergage.getInstance()
     * .getGlobalContext()
     * .addToCart(lineItem);
     * 
     * } catch (Exception e) {
     * e.printStackTrace();
     * }
     * }
     * 
     */
}