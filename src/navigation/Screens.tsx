import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Articles,
  Components,
  Home,
  Profile,
  Register,
  Pro,
  SignIn,
  ProfileSettings,
  Publish,
} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();
  const [initialRoute, setInitalRoute] = React.useState('');

  React.useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('@access-token').then((token) => {
        if (token) {
          console.log(JSON.parse(token));
          setInitalRoute('Home');
        } else {
          console.log('no token found');
          setInitalRoute('SignIn');
        }
      });
    })();
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
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />

      <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

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
    </Stack.Navigator>
  );
};
