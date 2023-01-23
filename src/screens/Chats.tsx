import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, RefreshControl} from 'react-native';
import {useQuery} from '@tanstack/react-query';

import {Block, ChatBox, Text} from '../components';
import {useTranslation, useTheme} from '../hooks';
import {getMyChats} from '../services';
import {useChatStore} from '../store';

const Chats = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {sizes} = useTheme();
  const chatsQuery = useQuery({
    queryKey: ['chats'],
    queryFn: getMyChats,
  });
  const {setRoomId, setSenderId, setRecipientId, setProductTitle} =
    useChatStore();

  const ListEmptyComp = () => {
    return <Text marginHorizontal={sizes.sm}>{t('chats.noChats')}</Text>;
  };

  return (
    <Block safe>
      <FlatList
        data={chatsQuery.data?.data}
        keyExtractor={(chat) => chat._id}
        renderItem={({item: chat}) => {
          return (
            <ChatBox
              recipientId={chat.sender}
              lastMessage={chat.message}
              onPress={() => {
                setRoomId(chat.roomId);
                setSenderId(chat.sender);
                setRecipientId(chat.recipient);
                setProductTitle(chat.productTitle);

                navigation.navigate('Chat');
              }}
            />
          );
        }}
        ListEmptyComponent={ListEmptyComp}
        refreshControl={
          <RefreshControl
            refreshing={chatsQuery.isRefetching}
            onRefresh={chatsQuery.refetch}
          />
        }
      />
    </Block>
  );
};

export default Chats;
