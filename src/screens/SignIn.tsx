import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  // useData,
  useTheme,
  useTranslation,
} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components/';

const isAndroid = Platform.OS === 'android';

interface ISignIn {
  phoneNumber: string;
  password: string;
}
interface ISignInValidation {
  phoneNumber: boolean;
  password: boolean;
}

const SignIn = () => {
  // const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isValid, setIsValid] = useState<ISignInValidation>({
    phoneNumber: false,
    password: false,
  });
  const [registration, setRegistration] = useState<ISignIn>({
    phoneNumber: '',
    password: '',
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  //   const handleSignUp = useCallback(() => {
  //     if (!Object.values(isValid).includes(false)) {
  //       /** send/save registratin data */
  //       console.log('handleSignUp', registration);
  //     }
  //   }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      phoneNumber: regex.phoneNumber.test(registration.phoneNumber),
      password: regex.password.test(registration.password),
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
                  marginBottom={sizes.m}
                  label={t('common.phoneNumber')}
                  keyboardType="number-pad"
                  placeholder={t('common.phoneNumberPlaceholder')}
                  success={Boolean(
                    registration.phoneNumber && isValid.phoneNumber,
                  )}
                  danger={Boolean(
                    registration.phoneNumber && !isValid.phoneNumber,
                  )}
                  onChangeText={(value) => handleChange({phoneNumber: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>
              <Button
                onPress={() => navigation.replace('Home')} // handle signin
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
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
