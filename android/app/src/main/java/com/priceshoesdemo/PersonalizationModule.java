package com.priceshoesdemo;

import androidx.annotation.NonNull;
import android.app.Activity;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactContext;
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

    private void sendEvent(ReactContext reactContext,
            String eventName,
            WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public PersonalizationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "PersonalizationModule";
    }

    /**
     * Generic page view tracking
     */
    @ReactMethod
    public void trackPageView(String pageName) {
        Context ctx = Evergage.getInstance().getGlobalContext();
        if (ctx != null) {
            ctx.trackAction("view:" + pageName);
        }
    }

    @ReactMethod
    public void registerCampaignHandler() {
        Activity activity = getCurrentActivity();

        if (activity != null) {
            Log.e("MCP", "[MCP] Activity is" + activity);
        }

        Context screen = Evergage.getInstance().getGlobalContext();

        screen.setCampaignHandler(new CampaignHandler() {
            @Override
            public void handleCampaign(Campaign campaign) {
                try {
                    currentCampaign = campaign;
                    JSONObject data = campaign.getData();
                    WritableMap payload = Arguments.createMap();
                    // Example keys — match what you defined in the campaign payload
                    if (data.has("id")) {
                        payload.putString("productId", data.optString("id"));
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
                    if (data.has("description")) {
                        payload.putString("description", data.optString("description"));
                    }
                    Log.d("MCP", "Campaign data: " + payload);
                    sendEvent(reactContext, "FeaturedProductCampaign", payload);

                } catch (Exception e) {
                    Log.e("MCP", "Error parsing mobile data campaign", e);
                }
            }
        }, "Featured Product");
    }

    /**
     * Category view tracking
     */
    @ReactMethod
    public void trackCategoryView(String section, String categoryName) {
        Context ctx = Evergage.getInstance().getGlobalContext();
        if (ctx == null)
            return;

        String categoryId = section + "/" + categoryName;
        Category category = new Category(categoryId);
        category.name = categoryName;

        ctx.viewCategory(category);
    }

    /**
     * Add to cart tracking
     */
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

            Product product = Product.fromJSONObject(json, productId);
            LineItem lineItem = new LineItem(product, quantity);

            Context ctx = Evergage.getInstance().getGlobalContext();
            if (ctx != null) {
                ctx.addToCart(lineItem);
            }
        } catch (Exception ignored) {
        }
    }

    @ReactMethod
    public void trackFeaturedProductClick(String productId) {
        if (currentCampaign != null) {
            Context screen = Evergage.getInstance().getGlobalContext();
            screen.trackClickthrough(currentCampaign);
        }
    }

    @ReactMethod
    public void trackFeaturedProductDismiss(String productId) {
        if (currentCampaign != null) {
            Log.e("Featured Product Dismiss", currentCampaign.getCampaignName());
            Context screen = Evergage.getInstance().getGlobalContext();
            screen.trackDismissal(currentCampaign);
        }
    }
}
