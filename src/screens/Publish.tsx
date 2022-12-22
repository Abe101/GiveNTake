import React from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Block, Text, PublishForm, Image, Button} from '../components';
import {useTheme, useTranslation} from '../hooks';

const isAndroid = Platform.OS === 'android';

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
            paddingTop={sizes.sm}
            paddingBottom={sizes.sm}
            paddingHorizontal={sizes.m}
            marginHorizontal={sizes.m}
            marginTop={isAndroid ? sizes.l : 0}
            borderRadius={sizes.imageRadius}
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
        <Block flex={0} padding={sizes.m} keyboard>
          <PublishForm />
        </Block>
      </Block>
    </Block>
  );
};

export default Publish;
