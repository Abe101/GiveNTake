import React, {useState, useCallback, createRef} from 'react';
import {
  Platform,
  TextInput,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import {Menu, Chip} from 'react-native-paper';

import {Block, Text, Input, Button, Image} from '../../components';
import {useTheme, useTranslation} from '../../hooks';

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

const PublishForm = () => {
  const {sizes, colors, gradients} = useTheme();
  const {t} = useTranslation();
  const [formFields, setFormFields] = useState<IFormFields>({
    prodName: '',
    prodBrand: '',
    prodQty: '',
    description: '',
    category: '',
    tags: [],
    prodImg: null,
  });
  const [tagInputValue, setTagInputValue] = useState<string>('');
  const [catMenuOpen, setCatMenuOpen] = useState<boolean>(false);
  const tagInputRef = createRef<TextInput>();

  const handleChange = useCallback(
    (value: Partial<IFormFields>) => {
      setFormFields((state) => ({...state, ...value}));
    },
    [setFormFields],
  );

  const openCatMenu = () => setCatMenuOpen(true);
  const closeCatMenu = () => setCatMenuOpen(false);

  return (
    <Block>
      <Block justify="center" row>
        <Text black h5>
          {t('publish.formTitle')}
        </Text>
      </Block>
      <Block>
        <Input
          autoCapitalize="none"
          marginTop={sizes.sm}
          placeholder={t('publish.productName')}
          onChangeText={(value) => handleChange({prodName: value})}
        />
        <Input
          autoCapitalize="none"
          marginTop={sizes.sm}
          placeholder={t('publish.productBrand')}
          onChangeText={(value) => handleChange({prodBrand: value})}
        />
        <Input
          autoCapitalize="none"
          marginTop={sizes.sm}
          keyboardType="number-pad"
          placeholder={t('publish.productQuantity')}
          onChangeText={(value) => handleChange({prodQty: value})}
        />
        <Input
          autoCapitalize="none"
          marginTop={sizes.sm}
          placeholder={t('publish.description')}
          onChangeText={(value) => handleChange({description: value})}
        />
        <Block marginTop={sizes.sm}>
          <Menu
            visible={catMenuOpen}
            onDismiss={closeCatMenu}
            anchor={
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={openCatMenu}>
                <Text
                  {...(formFields.category !== ''
                    ? {black: true}
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
        <Button gradient={gradients.primary} marginVertical={sizes.m}>
          <Text white bold transform="uppercase">
            {t('publish.submitForm')}
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

export default PublishForm;
