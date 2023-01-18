import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';

import {Block, Text, Button, Image, Input} from '../components';
import {useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';

interface IUpdateProfile {
  phoneNumber: string;
  oldPassword: string;
  newPassword: string;
  email: string;
}

interface IUpdateProfileValidation {
  phoneNumber: boolean;
  newPassword: boolean;
  email: boolean;
}

const ProfileSettings = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes, gradients} = useTheme();
  const [updateForm, setUpdateForm] = useState<IUpdateProfile>({
    phoneNumber: '',
    oldPassword: '',
    newPassword: '',
    email: '',
  });
  const [isValid, setIsValid] = useState<IUpdateProfileValidation>({
    phoneNumber: false,
    newPassword: false,
    email: false,
  });

  const handleChange = useCallback(
    (value) => {
      setUpdateForm((state) => ({...state, ...value}));
    },
    [setUpdateForm],
  );

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      phoneNumber: regex.phoneNumber.test(updateForm.phoneNumber),
      email: regex.email.test(updateForm.email),
      newPassword: regex.password.test(updateForm.newPassword),
    }));
  }, [updateForm, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <Image
        background
        resizeMode="cover"
        source={assets.whiteBg}
        /* @ts-ignore */
        height={sizes.height}>
        <Block
          scroll
          paddingHorizontal={sizes.s}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          <Block flex={0}>
            <Button
              row
              flex={0}
              justify="flex-start"
              margin={sizes.m}
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                /* @ts-ignore */
                width={10}
                height={18}
                color={colors.text}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text h5 marginLeft={sizes.s} bold>
                {t('profileSettings.title')}
              </Text>
            </Button>

            <Block paddingHorizontal={sizes.m}>
              <Input
                autoCapitalize="none"
                marginBottom={sizes.m}
                label={t('profileSettings.updateEmail')}
                keyboardType="email-address"
                placeholder={t('profileSettings.updateEmail')}
                success={Boolean(updateForm.email && isValid.email)}
                danger={Boolean(updateForm.email && !isValid.email)}
                onChangeText={(value) => handleChange({email: value})}
              />
              <Text danger transform="capitalize">
                {updateForm.email && !isValid.email
                  ? t('common.invalidEmailAddress')
                  : ''}
              </Text>

              <Text h5 black transform="capitalize">
                {t('profileSettings.changePassword')}
              </Text>
              <Input
                secureTextEntry
                autoCapitalize="none"
                marginTop={sizes.sm}
                marginBottom={sizes.m}
                label={t('profileSettings.oldPassword')}
                placeholder={t('profileSettings.oldPassword')}
                danger={Boolean(
                  updateForm.newPassword && !updateForm.oldPassword,
                )}
                onChangeText={(value) => handleChange({oldPassword: value})}
              />
              <Text danger transform="capitalize">
                {updateForm.newPassword && !updateForm.oldPassword
                  ? t('profileSettings.oldPasswordRequired')
                  : ''}
              </Text>
              <Input
                autoCapitalize="none"
                marginBottom={sizes.m}
                label={t('profileSettings.newPassword')}
                placeholder={t('profileSettings.newPassword')}
                success={Boolean(updateForm.newPassword && isValid.newPassword)}
                danger={Boolean(updateForm.newPassword && !isValid.newPassword)}
                onChangeText={(value) => handleChange({newPassword: value})}
              />
              <Text danger transform="capitalize">
                {updateForm.newPassword && !isValid.newPassword
                  ? t('common.invalidPassword')
                  : ''}
              </Text>
            </Block>
            <Button
              onPress={() => navigation.navigate('Profile')} // handle profile update
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
              gradient={gradients.primary}
              disabled={Object.values(isValid).includes(false)}>
              <Text bold white transform="uppercase">
                {t('common.save')}
              </Text>
            </Button>
          </Block>
        </Block>
      </Image>
    </Block>
  );
};

export default ProfileSettings;
