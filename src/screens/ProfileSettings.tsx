import React, {useState, useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useMutation} from '@tanstack/react-query';
import {useToast} from 'react-native-toast-notifications';

import {Block, Text, Button, Image, Input} from '../components';
import {useTheme, useTranslation} from '../hooks/';
import {uploadToCloudinary} from '../utils';
import {updateProfile} from '../services';

interface IUpdateProfile {
  avatar: ImagePicker.ImageInfo | null;
  aboutMe: string;
  address: string;
}

const ProfileSettings = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const toast = useToast();
  const {assets, colors, sizes, gradients} = useTheme();
  const [updateForm, setUpdateForm] = useState<IUpdateProfile>({
    avatar: null,
    aboutMe: '',
    address: '',
  });
  const {mutate, isSuccess, isLoading, isError, error} = useMutation({
    mutationKey: ['user'],
    mutationFn: updateProfile,
  });

  const handleChange = useCallback(
    (value) => {
      setUpdateForm((state) => ({...state, ...value}));
    },
    [setUpdateForm],
  );

  const getFileName = (uri: string) => {
    const uriSplit = uri.split('/');
    const nameWithExt = uriSplit[uriSplit.length - 1];
    const nameAndExtSplit = nameWithExt.split('.');

    return nameAndExtSplit[0];
  };

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.cancelled) {
      setUpdateForm((prev) => ({
        ...prev,
        avatar: result,
      }));
    }
  };

  const handleSubmit = useCallback(async () => {
    if (
      updateForm.avatar === null &&
      updateForm.aboutMe === '' &&
      updateForm.address === ''
    ) {
      toast.show('Nothing to update', {
        type: 'warning',
        placement: 'bottom',
        duration: 2000,
        animationType: 'slide-in',
      });
      return;
    }

    const body: any = {
      ...(updateForm.aboutMe !== '' && {about: updateForm.aboutMe}),
      ...(updateForm.address !== '' && {address: updateForm.address}),
    };

    if (updateForm.avatar !== null) {
      const uploadedImgData = await uploadToCloudinary({
        uri: updateForm.avatar.uri,
        type: updateForm.avatar.type,
        name: getFileName(updateForm.avatar.uri),
      });
      console.log(uploadedImgData);

      const uploadedImgUrl = uploadedImgData?.secure_url;
      body.avatar = uploadedImgUrl;
    }

    mutate(body);

    if (isSuccess) {
      toast.show('Profile updated!', {
        type: 'success',
        placement: 'bottom',
        duration: 2000,
        animationType: 'slide-in',
      });
      setTimeout(() => {
        navigation.navigate('Profile');
      }, 1000);
    } else if (isError) {
      /* @ts-ignore */
      toast.show(error?.response?.message, {
        type: 'error',
        placement: 'bottom',
        duration: 2000,
        animationType: 'slide-in',
      });
    }
  }, [updateForm, mutate, isSuccess, isError, toast, navigation, error]);

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

            <Block keyboard paddingHorizontal={sizes.m}>
              <Block>
                <Text h5 black transform="capitalize">
                  {t('profileSettings.general')}
                </Text>
                <Block row justify="center" marginVertical={sizes.sm}>
                  {updateForm.avatar ? (
                    <TouchableOpacity onPress={handleImageChange}>
                      <Image
                        source={{uri: updateForm.avatar.uri}}
                        /* @ts-ignore */
                        height={sizes.avatarSize * 4}
                        width={sizes.avatarSize * 4}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        height: sizes.avatarSize * 4,
                        width: sizes.avatarSize * 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.dark,
                        borderRadius: sizes.avatarRadius,
                      }}
                      onPress={handleImageChange}>
                      <Text color={colors.text} align="center">
                        {t('profileSettings.updatePhoto')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </Block>
                <Block>
                  <Input
                    autoCapitalize="none"
                    marginTop={sizes.sm}
                    marginBottom={sizes.sm}
                    multiline
                    label={t('profileSettings.updateAboutMe')}
                    placeholder={t('profileSettings.updateAboutMe')}
                    onChangeText={(value) => handleChange({aboutMe: value})}
                  />
                  <Input
                    autoCapitalize="none"
                    marginTop={sizes.sm}
                    marginBottom={sizes.sm}
                    multiline
                    label={t('profileSettings.updateAddress')}
                    placeholder={t('profileSettings.updateAddress')}
                    onChangeText={(value) => handleChange({address: value})}
                  />
                </Block>
              </Block>
            </Block>
            <Button
              onPress={handleSubmit} // handle profile update
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
              isLoading={isLoading}
              gradient={gradients.primary}>
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
