import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme, useTranslation} from '../hooks/';
import {IArticle} from '../constants/types';

const Article = ({
  title,
  description,
  image,
  category,
  timestamp,
  onPress,
}: IArticle) => {
  const {t} = useTranslation();
  const {gradients, sizes, colors} = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Block
        card
        color={colors.secondary}
        padding={sizes.sm}
        marginTop={sizes.sm}>
        <Image
          /* @ts-ignore */
          height={170}
          resizeMode="cover"
          source={{uri: image}}
        />
        <Text h4 marginTop={sizes.sm}>
          {title}
        </Text>
        {/* article category */}
        {category && (
          <Text
            h5
            bold
            size={13}
            marginTop={sizes.s}
            transform="uppercase"
            marginLeft={sizes.xs}
            gradient={gradients.primary}>
            {category}
          </Text>
        )}

        {/* article description */}
        {description && (
          <Text
            p
            marginTop={sizes.s}
            marginLeft={sizes.xs}
            marginBottom={sizes.sm}>
            {description.length > 100
              ? `${description.substring(0, 100)}...`
              : description}
          </Text>
        )}

        <Block row marginLeft={sizes.xs} marginBottom={sizes.xs}>
          <Block justify="center">
            <Text p gray>
              {t('common.posted', {
                date: dayjs(timestamp).format('DD MMMM') || '-',
              })}
            </Text>
          </Block>
        </Block>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Article;
