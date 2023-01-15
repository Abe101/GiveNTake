import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {ToastProvider} from 'react-native-toast-notifications';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';

import Menu from './Menu';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';

const client = new QueryClient();

export default () => {
  const {isDark, theme, setTheme} = useData();

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <QueryClientProvider client={client}>
      <TranslationProvider>
        <ThemeProvider theme={theme} setTheme={setTheme}>
          <PaperProvider>
            <ToastProvider>
              <NavigationContainer theme={navigationTheme}>
                <Menu />
              </NavigationContainer>
            </ToastProvider>
          </PaperProvider>
        </ThemeProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};
