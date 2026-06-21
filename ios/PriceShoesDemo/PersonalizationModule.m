#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PersonalizationModule, NSObject)

RCT_EXTERN_METHOD(initialize:(NSString *)account dataset:(NSString *)dataset)

RCT_EXTERN_METHOD(setUserId:(NSString *)userId)

RCT_EXTERN_METHOD(trackItemView:(NSString *)itemId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
