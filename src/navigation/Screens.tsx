import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

import {
  Categories,
  Components,
  Home,
  Profile,
  Register,
  SignIn,
  ProfileSettings,
  Request,
  PostDetails,
  Chat,
  Chats,
} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();
  const [initialRoute, setInitalRoute] = React.useState('');
  const [appIsReady, setAppIsReady] = React.useState(false);

  async function checkForUser() {
    const token = await AsyncStorage.getItem('@access-token').then((value) => {
      if (value) {
        return true;
      } else {
        return false;
      }
    });

    if (token) {
      return true;
    } else {
      return false;
    }
  }

  React.useEffect(() => {
    (async () =>
      await checkForUser()
        .then((userExists) => {
          if (userExists) {
            setInitalRoute('Home');
          } else {
            setInitalRoute('SignIn');
          }
        })
        .finally(() => {
          setAppIsReady(true);
        }))();
  }, []);

  if (!appIsReady) {
    return <AppLoading />;
  }

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

      <Stack.Screen name="Request" component={Request} />

      <Stack.Screen
        name="PostDetails"
        component={PostDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Chat" component={Chat} />

      <Stack.Screen name="Chats" component={Chats} />
    </Stack.Navigator>
  );
};
