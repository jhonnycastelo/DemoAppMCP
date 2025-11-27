package com.priceshoesdemo

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

// 👇 Import del paquete nativo que tú creaste
import com.priceshoesdemo.PersonalizationPackage

// 👇 Imports del SDK de Marketing Cloud Personalization (Evergage)
import com.evergage.android.Evergage
import com.evergage.android.ClientConfiguration

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {

          // -------------------------------------------
          // 👉 Aquí SE AGREGA el paquete manualmente 👇
          // -------------------------------------------
          add(PersonalizationPackage())

          // (Este bloque puede tener otros packages también)
        },
    )
  }

  override fun onCreate() {
    super.onCreate()

    // 🔹 Inicializar Marketing Cloud Personalization (Evergage)
    Evergage.initialize(this)
    val evergage = Evergage.getInstance();

    // Recommended to set the authenticated user's ID as soon as known: 

    evergage.setUserId("123456"); 

    val config = ClientConfiguration.Builder()
      .account("partnerfreewaymx")
      .dataset("demoapp")
      .build()

    Evergage.getInstance().start(config)

    // 🔹 Inicializar React Native (como ya estaba)
    loadReactNative(this)
  }
}