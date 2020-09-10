/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { typography } from './src/utils/typography'
import bgMessaging from "./src/bgMessaging";

 

typography()

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
AppRegistry.registerComponent(appName, () => App);

backgroundNotificationHandler = async () => {
    // console.log('Received Background Notification')
}