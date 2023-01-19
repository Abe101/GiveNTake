import React from 'react';

import {Block, RequestForm, Image} from '../components';
import {useTheme} from '../hooks';

const Request = () => {
  const {sizes, assets} = useTheme();

  return (
    <Block safe>
      <Image
        background
        resizeMode="cover"
        source={assets.whiteBg}
        /* @ts-ignore */
        height={sizes.height}>
        <Block
          scroll
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          <Block flex={0} padding={sizes.m} keyboard>
            <RequestForm />
          </Block>
        </Block>
      </Image>
    </Block>
  );
};

export default Request;
