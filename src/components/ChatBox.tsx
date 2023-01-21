import React from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import {useQuery} from '@tanstack/react-query';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import {IChatBox} from '../constants/types';
import {useTheme} from '../hooks';
import {getUserById} from '../services';

const ChatBox = ({recipientId, lastMessage, onPress}: IChatBox) => {
  const recipientQuery = useQuery({
    queryKey: ['recipient', recipientId],
    queryFn: () => getUserById(recipientId),
  });
  const {gradients, sizes} = useTheme();

  const CARD_WIDTH = sizes.width - sizes.padding * 2;

  if (recipientQuery.isLoading) {
    return (
      <Block
        flex={0}
        justify="center"
        align="center"
        marginVertical={sizes.sm}
        width={CARD_WIDTH}>
        <ActivityIndicator />
      </Block>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Block
        card
        flex={0}
        row
        marginVertical={sizes.sm}
        width={CARD_WIDTH}
        marginHorizontal={sizes.sm}>
        <Image
          source={{uri: recipientQuery.data?.data?.avatar}}
          resizeMode="cover"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 55,
            width: 55,
            borderRadius: sizes.avatarRadius,
          }}
        />
        <Block paddingTop={sizes.s} justify="space-between">
          <Text h5 marginBottom={sizes.s} gradient={gradients.primary}>
            {recipientQuery.data?.data?.name}
          </Text>
          <Text p marginBottom={sizes.s}>
            {lastMessage}
          </Text>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

export default ChatBox;
