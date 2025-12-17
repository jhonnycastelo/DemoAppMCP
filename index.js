/**
 * @format
 */

import { AppRegistry, NativeModules } from 'react-native';
import AppWrapper from './AppWrapper.tsx';
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';
const { PersonalizationModule } = NativeModules;

enableScreens();
AppRegistry.registerComponent(appName, () => AppWrapper);
