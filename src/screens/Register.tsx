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
import {register} from '../services';

const isAndroid = Platform.OS === 'android';

export interface IRegistration {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

const Register = () => {
  const {t} = useTranslation();
  const {assets, colors, gradients, sizes} = useTheme();
  const toaster = useToast();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const {mutate, data, error} = useMutation({
    mutationKey: ['user'],
    mutationFn: register,
  });

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      setIsProcessing(true);
      const registerBody = {
        ...registration,
        avatar: `https://api.dicebear.com/5.x/lorelei-neutral/svg?seed=${registration.name
          .split(' ')
          .join('')}`,
      };

      try {
        mutate(registerBody);

        await AsyncStorage.setItem(
          '@access-token',
          JSON.stringify(data.data.access_token),
        );
        toaster.show('Registration Successful!', {
          type: 'success',
          placement: 'bottom',
          duration: 2000,
          animationType: 'slide-in',
        });
        setIsProcessing(false);
        setTimeout(() => {
          navigation.replace('Home');
        }, 1000);
      } catch {
        setIsProcessing(false);
        /* @ts-ignore */
        toaster.show(error.response.data.message, {
          type: 'danger',
          placement: 'bottom',
          duration: 3000,
          animationType: 'slide-in',
        });
      }
    }
  }, [data, error, isValid, mutate, navigation, registration, toaster]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      confirmPassword: registration.password === registration.confirmPassword,
    }));
  }, [registration, setIsValid]);

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
              {t('register.title')}
            </Text>
          </Image>
        </Block>
        {/* register form */}
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
                {t('register.subtitle')}
              </Text>
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  marginTop={sizes.l}
                  label={t('common.name')}
                  keyboardType="default"
                  placeholder={t('common.namePlaceholder')}
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({name: value.trim()})}
                />
                <Text danger transform="capitalize">
                  {registration.name && !isValid.name
                    ? t('common.invalidName')
                    : ''}
                </Text>

                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  marginTop={sizes.s}
                  marginBottom={sizes.s}
                  label={t('common.email')}
                  keyboardType="default"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value.trim()})}
                />
                <Text danger transform="capitalize">
                  {registration.email && !isValid.email
                    ? t('common.invalidEmailAddress')
                    : ''}
                </Text>

                <Input
                  secureTextEntry
                  autoCorrect={false}
                  autoCapitalize="none"
                  marginTop={sizes.s}
                  marginBottom={sizes.s}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
                <Text danger transform="capitalize">
                  {registration.password && !isValid.password
                    ? t('common.invalidPassword')
                    : ''}
                </Text>

                <Input
                  secureTextEntry
                  autoCorrect={false}
                  autoCapitalize="none"
                  marginTop={sizes.s}
                  marginBottom={sizes.s}
                  label={t('common.confirmPassword')}
                  placeholder={t('common.confirmPasswordPlaceholder')}
                  onChangeText={(value) =>
                    handleChange({confirmPassword: value})
                  }
                  success={Boolean(
                    registration.confirmPassword && isValid.confirmPassword,
                  )}
                  danger={Boolean(
                    registration.confirmPassword && !isValid.confirmPassword,
                  )}
                />
                <Text danger transform="capitalize">
                  {registration.confirmPassword && !isValid.confirmPassword
                    ? t('common.invalidConfirmPassword')
                    : ''}
                </Text>
              </Block>

              <Button
                onPress={handleSignUp}
                marginVertical={sizes.s}
                marginHorizontal={sizes.s}
                gradient={gradients.primary}
                isLoading={isProcessing}
                disabled={
                  isProcessing || Object.values(isValid).includes(false)
                }>
                <Text bold white transform="uppercase">
                  {t('common.signup')}
                </Text>
              </Button>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                disabled={isProcessing}
                onPress={() => navigation.replace('SignIn')}>
                <Text bold primary transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Register;
