import Foundation
import Evergage // or EngagementSDK depending on your version

@objc(PersonalizationModule)
class PersonalizationModule: NSObject {

  @objc
  func initialize(_ account: String, dataset: String) {
    DispatchQueue.main.async {
      Evergage.sharedInstance().configure(account: account, dataset: dataset)
    }
  }

  @objc
  func setUserId(_ userId: String) {
    DispatchQueue.main.async {
      Evergage.sharedInstance().setUserId(userId)
    }
  }

  @objc
  func trackPageView(_ pageName: String) {
      // Get the global context — same as Android Evergage.getInstance().getGlobalContext()
      if let context = Evergage.sharedInstance().globalContext {
          let actionName = "view:\(pageName)"
          context.trackAction(actionName)
      } else {
          print("Evergage globalContext is nil — cannot track page")
      }
  }
  @objc
  func trackItemView(_ itemId: String, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      Evergage.sharedInstance().screenView(name: itemId)
      resolver(true)
    }
  }
@objc(addToCart:)
func addToCart(_ productDict: NSDictionary) {
    let product = EVGProduct()
    
    product.productId = productDict["productId"] as? String
    product.name = productDict["name"] as? String
    product.category = productDict["category"] as? String
    product.price = productDict["price"] as? Double ?? 0.0
    product.quantity = productDict["quantity"] as? Int ?? 1
    product.currency = productDict["currency"] as? String

    EVGContext.shared().addToCart(product)
}
}
