import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import {
  Categories,
  Components,
  Home,
  Profile,
  Register,
  SignIn,
  ProfileSettings,
  Publish,
  PostDetails,
} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();
  const [initialRoute, setInitalRoute] = React.useState('');

  async function checkForUser() {
    const token = await AsyncStorage.getItem('@access-token').then((value) => {
      if (value) {
        return JSON.parse(value);
      } else {
        return null;
      }
    });

    if (token) {
      setInitalRoute('Home');
      return true;
    } else {
      setInitalRoute('SignIn');
      return false;
    }
  }

  React.useEffect(() => {
    (async () => await checkForUser())();
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{title: t('navigation.categories')}}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Publish" component={Publish} />

      <Stack.Screen
        name="PostDetails"
        component={PostDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
