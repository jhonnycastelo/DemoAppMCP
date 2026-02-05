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
import com.evergage.android.promote.Item;
import com.evergage.android.promote.Order;
import com.evergage.android.promote.Product;
import com.evergage.android.CampaignHandler;
import com.evergage.android.Campaign;
import com.evergage.android.Screen;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.facebook.react.bridge.ReadableArray;
import java.util.Iterator;

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
    public void registerCampaignHandler(String campaignName) {
        Activity activity = getCurrentActivity();

        if (activity != null) {
            Log.e("MCP", "[MCP] Activity is" + activity);
        }

        Context screen = Evergage.getInstance().getGlobalContext();
        CampaignHandler handler = new CampaignHandler() {
            @Override
            public void handleCampaign(Campaign campaign) {
                try {
                    WritableMap event = Arguments.createMap();

                    // 1️⃣ Campaign metadata
                    event.putString("campaignName", campaign.getCampaignName());
                    event.putString("campaignId", campaign.getCampaignId());

                    // 2️⃣ Campaign payload (dynamic)
                    JSONObject data = campaign.getData();
                    WritableMap payload = Arguments.createMap();

                    Iterator<String> keys = data.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        payload.putString(key, data.optString(key));
                    }

                    event.putMap("payload", payload);

                    Log.d("MCP", "Campaign received: " + campaign.getCampaignName());
                    Log.d("MCP", "Campaign payload: " + data.toString());

                    sendEvent(
                            reactContext,
                            "MCP_Campaign",
                            event);
                } catch (Exception e) {
                    Log.e("MCP", "Error parsing mobile data campaign", e);
                }
            }
        };
        screen.setCampaignHandler(handler, campaignName);
    }

    @ReactMethod
    public void viewCart(ReadableArray cartItems) {
        double totalPrice = 0.0;
        List<LineItem> lineItems = new ArrayList<>();
        for (int i = 0; i < cartItems.size(); i++) {
            ReadableMap item = cartItems.getMap(i);
            try {
                Log.e("EVERGAGE-Item-Payload", item.toString());
                String productId = item.getString("id");
                double price = item.getDouble("price");
                int quantity = item.getInt("quantity");
                String name = item.getString("name");
                totalPrice += price * quantity;

                JSONObject json = new JSONObject();
                json.put("id", productId);
                json.put("name", name);
                json.put("price", price);

                Product product = Product.fromJSONObject(json, productId);
                LineItem lineItem = new LineItem(product, quantity);
                lineItems.add(lineItem);
            } catch (Exception ignored) {
            }
        }
        if (!lineItems.isEmpty()) {

            Order order = new Order("cart-123", lineItems, totalPrice);
            Context ctx = Evergage.getInstance().getGlobalContext();
            Log.e("Evergage-Item-Payload-JSON", order.toString());
            if (ctx != null) {
                ctx.viewCart(order);
            }
        }
    }

    @ReactMethod
    public void purchaseCart(ReadableArray cartItems) {
        double totalPrice = 0.0;
        List<LineItem> lineItems = new ArrayList<>();
        for (int i = 0; i < cartItems.size(); i++) {
            ReadableMap item = cartItems.getMap(i);
            try {
                String productId = item.getString("id");
                double price = item.getDouble("price");
                int quantity = item.getInt("quantity");
                String name = item.getString("name");
                totalPrice += price * quantity;

                JSONObject json = new JSONObject();
                json.put("id", productId);
                json.put("name", name);
                json.put("price", price);

                Product product = Product.fromJSONObject(json, productId);
                LineItem lineItem = new LineItem(product, quantity);
                lineItems.add(lineItem);
            } catch (Exception ignored) {
            }
        }
        if (!lineItems.isEmpty()) {
            UUID uuid = UUID.randomUUID();
            Order order = new Order(uuid.toString(), lineItems, totalPrice);
            Context ctx = Evergage.getInstance().getGlobalContext();
            if (ctx != null) {
                ctx.purchase(order);
            }
        }
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
                Log.e("Evergage-Cart-Payload", json.toString());
                ctx.addToCart(lineItem);
            }
        } catch (Exception ignored) {
        }
    }

    @ReactMethod
    public void viewItem(ReadableMap itemMap) {
        try {
            // Required fields
            String productId = itemMap.hasKey("id") ? itemMap.getString("id") : null;
            String name = itemMap.hasKey("name") ? itemMap.getString("name") : null;
            double price = itemMap.hasKey("price") ? itemMap.getDouble("price") : 0.0;

            JSONObject properties = new JSONObject();

            if (productId == null || name == null) {
                Log.e("Evergage-Item-Payload", "Required fields (id, name) missing!");
                return;
            }
            if (itemMap.hasKey("description")) {
                properties.put("description", itemMap.getString("description"));
            }
            if (itemMap.hasKey("imageUrl")) {
                properties.put("imageUrl", itemMap.getString("imageUrl"));
            }
            if (itemMap.hasKey("category")) {
                properties.put("category", itemMap.getString("category"));
            }

            // Build final JSON
            JSONObject json = new JSONObject();
            json.put("id", productId);
            json.put("name", name);
            json.put("price", String.valueOf(price)); // price as string
            json.put("properties", properties);

            // Log JSON
            Log.e("Evergage-Item-Payload-JSON", json.toString());

            // Parse item
            Product product = Product.fromJSONObject(json, productId);

            if (product != null) {
                Log.e("Evergage-Item-Payload-ITEM", product.toString());
            } else {
                Log.e("Evergage-Item-Payload-ITEM", "Item is null");
            }

            // Send to Evergage
            Context ctx = Evergage.getInstance().getGlobalContext();
            if (ctx != null && product != null) {
                ctx.viewItem(product);
                Log.e("Evergage-Item-Payload-SENT", product.toString());
            } else {
                Log.e("Evergage-Item-Payload", "Evergage global context is null or item is null");
            }

        } catch (Exception e) {
            Log.e("Evergage-Item-Payload-ERROR", Log.getStackTraceString(e));
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
