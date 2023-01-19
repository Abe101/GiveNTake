import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {useToast} from 'react-native-toast-notifications';
import {useMutation} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components/';
import {login} from '../services';

const isAndroid = Platform.OS === 'android';

export interface ISignIn {
  identifier: string;
  password: string;
}
interface ISignInValidation {
  identifier: boolean;
}

const SignIn = () => {
  const {t} = useTranslation();
  const {assets, colors, gradients, sizes} = useTheme();
  const toaster = useToast();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isValid, setIsValid] = useState<ISignInValidation>({
    identifier: false,
  });
  const [signInFields, setSignInFields] = useState<ISignIn>({
    identifier: '',
    password: '',
  });
  const {mutate, isSuccess, isError, isLoading, data, error} = useMutation({
    mutationKey: ['user'],
    mutationFn: login,
  });

  const handleChange = useCallback(
    (value) => {
      setSignInFields((state) => ({...state, ...value}));
    },
    [setSignInFields],
  );

  const handleSignIn = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      mutate(signInFields);

      if (isSuccess) {
        await AsyncStorage.setItem(
          '@access-token',
          JSON.stringify(data.data.access_token),
        );

        toaster.show('Login Successful!', {
          type: 'success',
          placement: 'bottom',
          duration: 2000,
          animationType: 'slide-in',
        });
        setTimeout(() => {
          navigation.replace('Home');
        }, 2000);
      } else if (isError) {
        /* @ts-ignore */
        toaster.show(error.response.data.message, {
          type: 'danger',
          placement: 'bottom',
          duration: 3000,
          animationType: 'slide-in',
        });
      }
    }
  }, [
    data,
    error,
    isError,
    isSuccess,
    isValid,
    mutate,
    navigation,
    signInFields,
    toaster,
  ]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      identifier: regex.email.test(signInFields.identifier),
    }));
  }, [signInFields, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            /* @ts-ignore */
            height={sizes.height * 0.3}>
            <Text h4 center white marginBottom={sizes.md}>
              {t('signin.title')}
            </Text>
          </Image>
        </Block>
        {/* signin form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {t('signin.subtitle')}
              </Text>
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginTop={sizes.l}
                  marginBottom={sizes.s}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(
                    signInFields.identifier && isValid.identifier,
                  )}
                  danger={Boolean(
                    signInFields.identifier && !isValid.identifier,
                  )}
                  onChangeText={(value) => handleChange({identifier: value})}
                />
                <Text danger transform="capitalize">
                  {signInFields.identifier && !isValid.identifier
                    ? t('common.invalidEmailAddress')
                    : ''}
                </Text>

                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({password: value})}
                />
              </Block>
              <Button
                onPress={handleSignIn}
                marginVertical={sizes.s}
                marginHorizontal={sizes.s}
                gradient={gradients.primary}
                isLoading={isLoading}
                disabled={isLoading || Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                disabled={isLoading}
                onPress={() => navigation.replace('Register')}>
                <Text bold primary transform="uppercase">
                  {t('common.signup')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default SignIn;
