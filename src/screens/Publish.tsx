import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';

import {Block, PublishForm, Text, Image, Button} from '../components';
import {useTheme, useTranslation} from '../hooks';

const Publish = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {sizes, assets, icons, colors} = useTheme();

  return (
    <Block safe>
      <Image
        background
        resizeMode="cover"
        source={assets.screenBg}
        height={sizes.height}>
        <Block row align="center" flex={0}>
          <Button
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image source={icons.menu} radius={0} color={colors.icon} />
          </Button>
          <Text p color={colors.white}>
            {t('navigation.publish')}
          </Text>
        </Block>
        <Block
          scroll
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          {/* <Block flex={0}>
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
        </Block> */}
          <Block flex={0} padding={sizes.m} keyboard>
            <PublishForm />
          </Block>
        </Block>
      </Image>
    </Block>
  );
};

export default Publish;
