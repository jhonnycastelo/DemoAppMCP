/**
 * @format
 */

import { AppRegistry, NativeModules } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
const { PersonalizationModule } = NativeModules;

let campaignHandlers = {};

const ReactNativeEvergage = {
  setCampaignHandler: (target, callback) => {
    campaignHandlers[target] = callback;
    new NativeEventEmitter(RNEvergage).addListener(
      'EvergageCampaignHandler',
      ({ target, data }) => {
        campaignHandlers[target](data);
      },
    );
    RNEvergage.setCampaignHandler(target);
  },
};

export default ReactNativeEvergage;
AppRegistry.registerComponent(appName, () => App);
