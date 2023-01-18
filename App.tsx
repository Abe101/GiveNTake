import 'react-native-gesture-handler';
import React from 'react';
import * as SplashScreen from 'expo-splash-screen';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>
  );
}
