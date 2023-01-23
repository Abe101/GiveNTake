import React, {useState, useEffect, useCallback, createRef} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Platform, TextInput, TouchableOpacity, FlatList} from 'react-native';
import {Chip} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import {useToast} from 'react-native-toast-notifications';
import {useQueries, useMutation} from '@tanstack/react-query';
import mime from 'mime';

import {Block, Text, Input, Button, Image, Modal} from '../../components';
import {useTheme, useTranslation, useDisclose} from '../../hooks';
import {uploadToCloudinary} from '../../utils';
import {
  getCategories,
  getUserProfile,
  uploadRecieverRequest,
} from '../../services';

const isAndroid = Platform.OS === 'android';

interface IFormFields {
  prodName: string;
  prodBrand: string;
  prodQty: string;
  description: string;
  category: string;
  tags: string[];
  prodImg: ImagePicker.ImageInfo | null;
}

interface IFormFieldsValidation {
  prodName: boolean;
  prodBrand: boolean;
  prodQty: boolean;
  description: boolean;
  category: boolean;
}

export interface IPost {
  productName: string;
  productCompany: string;
  productQuantity: number;
  productDescription: string;
  category: string;
  tags?: string[];
  productImage?: string;
  authorEmail: string;
}

const RequestForm = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const toaster = useToast();
  const {sizes, colors, gradients, assets} = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
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
    prodName: true,
    prodBrand: true,
    prodQty: true,
    description: true,
    category: true,
  });
  const [tagInputValue, setTagInputValue] = useState('');
  const {
    isOpen: isCategoryMenuOpen,
    onOpen: onCategoryMenuOpen,
    onClose: onCategoryMenuClose,
  } = useDisclose();
  const tagInputRef = createRef<TextInput>();
  const [categoryApi, userApi] = useQueries({
    queries: [
      {
        queryKey: ['categories'],
        queryFn: getCategories,
      },
      {
        queryKey: ['user'],
        queryFn: getUserProfile,
      },
    ],
  });
  const uploadRequestApi = useMutation({
    mutationKey: ['posts'],
    mutationFn: uploadRecieverRequest,
  });

  useFocusEffect(
    useCallback(() => {
      if (categoryApi.isSuccess) {
        setCategoryList(categoryApi.data.data);
      }
    }, [categoryApi.data, categoryApi.isSuccess]),
  );

  const handleChange = useCallback(
    (value: Partial<IFormFields>) => {
      setFormFields((state) => ({...state, ...value}));
    },
    [setFormFields],
  );

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
      base64: true,
    });

    if (!result.cancelled) {
      setFormFields((prev) => ({
        ...prev,
        prodImg: result,
      }));
    }
  };

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      prodName: Boolean(formFields.prodName),
      prodBrand: Boolean(formFields.prodBrand),
      prodQty: Boolean(Number(formFields.prodQty)),
      description: Boolean(formFields.description),
      category: Boolean(formFields.category),
    }));
  }, [formFields, setIsValid]);

  const getFileName = (uri: string) => {
    const uriSplit = uri.split('/');
    const nameWithExt = uriSplit[uriSplit.length - 1];
    const nameAndExtSplit = nameWithExt.split('.');

    return nameAndExtSplit[0];
  };

  const handleSubmit = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      setIsProcessing(true);
      console.log('formFields', JSON.stringify(formFields, null, 2));

      const userEmail = userApi.data.data.email;

      const body: IPost = {
        productName: formFields.prodName,
        productCompany: formFields.prodBrand,
        productQuantity: Number(formFields.prodQty),
        category: formFields.category,
        productDescription: formFields.description,
        ...(formFields.tags.length && {tags: formFields.tags}),
        authorEmail: userEmail,
      };

      if (formFields.prodImg) {
        const uploadedImgData = await uploadToCloudinary({
          uri: formFields.prodImg.uri,
          type: mime.getType(formFields.prodImg.uri),
          name: getFileName(formFields.prodImg.uri),
          base64: formFields.prodImg.base64,
        });

        const uploadedImgUrl = uploadedImgData?.secure_url;
        body.productImage = uploadedImgUrl;
      }

      try {
        uploadRequestApi.mutateAsync(body);

        setIsProcessing(false);
        toaster.show('Uploaded!', {
          type: 'success',
          placement: 'bottom',
          duration: 2000,
          animationType: 'slide-in',
        });
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
      } catch (error) {
        setIsProcessing(false);
        console.log('posting request error', JSON.stringify(error, null, 2));
        toaster.show('There was an issue while posting. Please try later', {
          type: 'danger',
          placement: 'bottom',
          duration: 3000,
          animationType: 'slide-in',
        });
      }
    }
  }, [formFields, isValid, navigation, toaster, uploadRequestApi, userApi]);

  return (
    <Block marginBottom={sizes.xxl}>
      <Block justify="center" row>
        <Text color={colors.text} h5>
          {t('request.formTitle')}
        </Text>
      </Block>
      <Block>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          marginTop={sizes.sm}
          color={colors.dark}
          placeholder={t('request.productName')}
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
          color={colors.dark}
          placeholder={t('request.productBrand')}
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
          color={colors.dark}
          placeholder={t('request.productQuantity')}
          success={Boolean(formFields.prodQty && isValid.prodQty)}
          danger={Boolean(formFields.prodQty && !isValid.prodQty)}
          onChangeText={(value) => handleChange({prodQty: value})}
        />
        <Text danger>
          {formFields.prodQty && !isValid.prodQty
            ? isNaN(Number(formFields.prodQty))
              ? t('request.productQuantityErrorNaN')
              : Number(formFields.prodQty) < 1
              ? t('request.productQuantityErrorLessThanOne')
              : t('common.required')
            : null}
        </Text>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          marginTop={sizes.sm}
          color={colors.dark}
          multiline
          placeholder={t('request.description')}
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
          <Button
            flex={1}
            row
            gradient={gradients.primary}
            shadow={!isAndroid}
            onPress={onCategoryMenuOpen}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white bold transform="uppercase" marginRight={sizes.sm}>
                {formFields.category !== ''
                  ? formFields.category
                  : t('request.chooseCategory')}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
        </Block>
        <Block width={sizes.width - sizes.xxl}>
          <Block row justify="flex-start" align="center" wrap="wrap">
            {formFields.tags.length > 0 &&
              formFields.tags.map((tag: string, idx: number) => (
                <Chip
                  key={idx}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{margin: sizes.s, height: 40}}
                  elevated
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
            label={`${t('request.addTags')}\n(Press space bar to enter a tag)`}
            color={colors.dark}
            placeholder={t('request.addTags')}
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
            <TouchableOpacity onPress={handleImageChange}>
              <Image
                source={{uri: formFields.prodImg.uri}}
                /* @ts-ignore */
                height={formFields.prodImg.height / 4}
                width={sizes.width - sizes.xxl - 20}
                marginTop={sizes.sm}
                resizeMode="contain"
              />
            </TouchableOpacity>
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
                borderColor: colors.dark,
                borderRadius: sizes.cardRadius,
              }}
              onPress={handleImageChange}>
              <Text color={colors.text}>{t('request.addPhoto')}</Text>
            </TouchableOpacity>
          )}
        </Block>
        <Button
          {...(Object.values(isValid).includes(false)
            ? {color: colors.gray}
            : {gradient: gradients.primary})}
          shadow={!isAndroid}
          marginVertical={sizes.sm}
          isLoading={isProcessing}
          disabled={Object.values(isValid).includes(false) || isProcessing}
          onPress={handleSubmit}>
          <Text white bold transform="uppercase">
            {t('request.submitForm')}
          </Text>
        </Button>
      </Block>
      <Modal visible={isCategoryMenuOpen} onRequestClose={onCategoryMenuClose}>
        <FlatList
          data={categoryList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                setFormFields((prev) => ({
                  ...prev,
                  category: item,
                }));
                onCategoryMenuClose();
              }}>
              <Text p white semibold transform="uppercase">
                {item}
              </Text>
            </Button>
          )}
        />
      </Modal>
    </Block>
  );
};

export default RequestForm;
