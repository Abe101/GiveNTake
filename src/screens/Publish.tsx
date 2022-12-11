import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {Block, Text, PublishForm, Image, Button} from '../components';
import {useTheme, useTranslation} from '../hooks';

const Publish = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {sizes, colors, assets} = useTheme();

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            paddingTop={sizes.l}
            paddingBottom={sizes.m}
            paddingHorizontal={sizes.m}
            source={assets.background}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {t('screens.publish')}
              </Text>
            </Button>
          </Image>
        </Block>
      </Block>
      <PublishForm />
    </Block>
  );
};

export default Publish;
