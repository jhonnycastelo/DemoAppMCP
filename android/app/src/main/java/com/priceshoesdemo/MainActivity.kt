package com.priceshoesdemo

import android.util.Log
import android.app.Activity
import com.facebook.react.ReactActivity
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.evergage.android.Campaign
import com.evergage.android.CampaignHandler
import com.evergage.android.Evergage
import com.evergage.android.Screen

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "PriceShoesDemo"

    // Queue events if ReactContext is not yet ready
    private val pendingEvents = mutableListOf<Pair<String, WritableMap>>()

    override fun onStart() {
        super.onStart()
        val screen = Evergage.getInstance().getScreenForActivity(this)
        if (screen == null) {
            Log.e("MCP", "Screen is null in onStart() — SDK might not be initialized yet")
            return
        }

        Log.d("MCP", "Screen ready in MainActivity — registering campaign handler")
        registerCampaignHandler(screen)
        // Track the Products screen action
        screen.trackAction("view:Products")
        Log.d("MCP", "Tracked action: view:Products")
    }

    // Register the campaign handler safely
    private fun registerCampaignHandler(screen: Screen) {
        screen.setCampaignHandler(object : CampaignHandler {
            override fun handleCampaign(campaign: Campaign) {
                Log.d("MCP", "Campaign received: ${campaign.campaignName}")

                val payload = Arguments.createMap()
                val data = campaign.data
                payload.putString("name", data.optString("name"))
                payload.putString("productId", data.optString("id"))
                payload.putString("imageURL", data.optString("imageURL"))
                payload.putString("price", data.optString("price"))
                payload.putString("description", data.optString("description"))
                payload.putString("category", data.optString("category"))

                Log.d("MCP", "Campaign data: ${campaign.data}")
                sendEventToJS("FeaturedProductCampaign", payload)
            }
        } as CampaignHandler?, "Featured Product")
    }

    // Safe sending to JS — queues events if ReactContext is not ready
    private fun sendEventToJS(eventName: String, params: WritableMap) {
        val reactContext: ReactContext? = (application as ReactApplication)
            .reactNativeHost
            .reactInstanceManager
            .currentReactContext

        if (reactContext == null) {
            Log.d("MCP", "Queueing event — ReactContext not ready: $eventName")
            pendingEvents.add(eventName to params)
            return
        }

        val emitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        emitter.emit(eventName, params)
        Log.d("MCP", "Event sent to JS: $eventName")

        // Flush queued events
        pendingEvents.forEach { (name, map) ->
            emitter.emit(name, map)
            Log.d("MCP", "Flushed queued event: $name")
        }
        pendingEvents.clear()
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

