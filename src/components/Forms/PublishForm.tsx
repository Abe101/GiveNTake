import React, {useState, useEffect, useCallback, createRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  Platform,
  TextInput,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import {Menu, Chip} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import {useToast} from 'react-native-toast-notifications';

import {Block, Text, Input, Button, Image} from '../../components';
import {useTheme, useTranslation} from '../../hooks';
import {uploadToCloudinary} from '../../utils';

const isAndroid = Platform.OS === 'android';

interface IFormFields {
  prodName: string;
  prodBrand: string;
  prodQty: string;
  description: string;
  category: string;
  tags: string[];
  prodImg: ImageSourcePropType | null;
}

interface IFormFieldsValidation {
  prodName: boolean;
  prodBrand: boolean;
  prodQty: boolean;
  description: boolean;
  category: boolean;
}

const PublishForm = () => {
  const {t} = useTranslation();
  const toaster = useToast();
  const {sizes, colors, gradients} = useTheme();
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(false);
  const [hasPickerAccess, setHasPickerAccess] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<IFormFields>({
    prodName: '',
    prodBrand: '',
    prodQty: '',
    description: '',
    category: '',
    tags: [],
    prodImg: null,
  });
  const [isValid, setIsValid] = useState<IFormFieldsValidation>({
    prodName: false,
    prodBrand: false,
    prodQty: false,
    description: false,
    category: false,
  });
  const [tagInputValue, setTagInputValue] = useState<string>('');
  const [catMenuOpen, setCatMenuOpen] = useState<boolean>(false);
  const tagInputRef = createRef<TextInput>();

  const requestPickerPermission = async () => {
    if (hasPickerAccess) {
      return;
    }

    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPickerAccess(status === 'granted');
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const requestCameraPermission = async () => {
    if (hasCameraAccess) {
      return;
    }

    try {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraAccess(status === 'granted');
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  useFocusEffect(
    useCallback(() => {
      requestPickerPermission();
      requestCameraPermission();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleChange = useCallback(
    (value: Partial<IFormFields>) => {
      setFormFields((state) => ({...state, ...value}));
    },
    [setFormFields],
  );

  const openCatMenu = () => setCatMenuOpen(true);
  const closeCatMenu = () => setCatMenuOpen(false);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      prodName: Boolean(formFields.prodName),
      prodBrand: Boolean(formFields.prodBrand),
      prodQty: Boolean(formFields.prodQty),
      description: Boolean(formFields.description),
      category: Boolean(formFields.category),
    }));
  }, [formFields, setIsValid]);

  const handleSubmit = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      console.log(JSON.stringify(formFields, null, 2));
    } else if (!isValid.category) {
      // toaster.show({
      //   type: 'danger',
      // });
    }
  }, [formFields, isValid]);

  return (
    <Block>
      <Block justify="center" row>
        <Text white h5>
          {t('publish.formTitle')}
        </Text>
      </Block>
      <Block>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          marginTop={sizes.sm}
          placeholder={t('publish.productName')}
          success={Boolean(formFields.prodName && isValid.prodName)}
          danger={Boolean(formFields.prodName && !isValid.prodName)}
          onChangeText={(value) => handleChange({prodName: value})}
        />
        <Text danger>
          {formFields.prodName && !isValid.prodName ? t('common.required') : ''}
        </Text>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          marginTop={sizes.sm}
          placeholder={t('publish.productBrand')}
          success={Boolean(formFields.prodBrand && isValid.prodBrand)}
          danger={Boolean(formFields.prodBrand && !isValid.prodBrand)}
          onChangeText={(value) => handleChange({prodBrand: value})}
        />
        <Text danger>
          {formFields.prodBrand && !isValid.prodBrand
            ? t('common.required')
            : ''}
        </Text>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          marginTop={sizes.sm}
          keyboardType="number-pad"
          placeholder={t('publish.productQuantity')}
          success={Boolean(formFields.prodQty && isValid.prodQty)}
          danger={Boolean(formFields.prodQty && !isValid.prodQty)}
          onChangeText={(value) => handleChange({prodQty: value})}
        />
        <Text danger>
          {formFields.prodQty && !isValid.prodQty ? t('common.required') : ''}
        </Text>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          marginTop={sizes.sm}
          placeholder={t('publish.description')}
          success={Boolean(formFields.description && isValid.description)}
          danger={Boolean(formFields.description && !isValid.description)}
          onChangeText={(value) => handleChange({description: value})}
        />
        <Text danger>
          {formFields.description && !isValid.description
            ? t('common.required')
            : ''}
        </Text>
        <Block marginTop={sizes.sm}>
          <Menu
            visible={catMenuOpen}
            onDismiss={closeCatMenu}
            anchor={
              <Button
                primary
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={openCatMenu}>
                <Text
                  {...(formFields.category !== ''
                    ? {white: true, transform: 'uppercase'}
                    : {gray: true})}>
                  {formFields.category !== ''
                    ? formFields.category
                    : t('publish.chooseCategory')}
                </Text>
              </Button>
            }>
            <Menu.Item
              onPress={() => {
                handleChange({category: 'something'});
                closeCatMenu();
              }}
              title="something"
            />
          </Menu>
        </Block>
        <Block width={sizes.width - sizes.xxl}>
          <Block row justify="flex-start" align="center" wrap="wrap">
            {formFields.tags.length > 0 &&
              formFields.tags.map((tag: string, idx: number) => (
                <Chip
                  key={idx}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{margin: sizes.s, height: 40}}
                  icon="close"
                  onPress={() => {
                    const newTags = [...formFields.tags];
                    newTags.splice(newTags.indexOf(tag), 1);
                    handleChange({tags: newTags});
                  }}>
                  {tag}
                </Chip>
              ))}
          </Block>
          <Input
            ref={tagInputRef}
            autoCapitalize="none"
            autoCorrect={false}
            label={`${t('publish.addTags')}\n(Press space bar to enter a tag)`}
            placeholder={t('publish.addTags')}
            marginTop={sizes.s}
            value={tagInputValue}
            onChangeText={setTagInputValue}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === ' ') {
                if (tagInputValue.trim() === '') {
                  return;
                }
                const newTags = [...formFields.tags];
                newTags.push(tagInputValue.trim());
                handleChange({tags: newTags});
                tagInputRef.current?.clear();
                setTagInputValue('');
              }
            }}
          />
        </Block>
        <Block row justify="center">
          {formFields.prodImg ? (
            <Image source={formFields.prodImg} />
          ) : (
            <TouchableOpacity
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginTop: sizes.sm,
                height: sizes.xxl * 2,
                width: sizes.width - sizes.xxl - 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: sizes.cardRadius,
              }}>
              <Text>{t('publish.addPhoto')}</Text>
            </TouchableOpacity>
          )}
        </Block>
        <Button
          gradient={gradients.primary}
          marginVertical={sizes.m}
          disabled={Object.values(isValid).includes(false)}
          onPress={handleSubmit}>
          <Text white bold transform="uppercase">
            {t('publish.submitForm')}
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

export default PublishForm;
