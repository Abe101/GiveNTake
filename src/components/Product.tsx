import React from 'react';
import {TouchableOpacity} from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import {IProduct} from '../constants/types';
import {useTheme, useTranslation} from '../hooks/';

const Product = ({
  image,
  title,
  description,
  type,
  linkLabel,
  onLinkPress,
}: IProduct) => {
  const {t} = useTranslation();
  const {assets, colors, sizes} = useTheme();

  const isHorizontal = type !== 'vertical';
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

  return (
    <Block
      card
      flex={0}
      row={isHorizontal}
      marginBottom={sizes.sm}
      width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
      <Image
        resizeMode="cover"
        source={image ? {uri: image} : assets.noImage}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          height: isHorizontal ? 114 : 110,
          width: !isHorizontal ? '100%' : sizes.width / 2.435,
        }}
      />
      <Block
        paddingTop={sizes.s}
        justify="space-between"
        paddingLeft={isHorizontal ? sizes.sm : 0}
        paddingBottom={isHorizontal ? sizes.s : 0}>
        <Text h5 marginBottom={sizes.s} transform="capitalize">
          {title}
        </Text>
        <Text p marginBottom={sizes.s}>
          {description.length > 25
            ? `${description?.substring(0, 25)}...`
            : description}
        </Text>
        <TouchableOpacity onPress={onLinkPress}>
          <Block row flex={0} align="center">
            <Text
              p
              color={colors.link}
              semibold
              size={sizes.linkSize}
              marginRight={sizes.s}>
              {linkLabel || t('common.readArticle')}
            </Text>
            <Image source={assets.arrow} color={colors.link} />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default Product;
