import React, {useEffect, useState} from 'react';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {Platform, KeyboardAvoidingView} from 'react-native';
import {useQueries} from '@tanstack/react-query';

import {Block, Text} from '../components';
import {useChatStore} from '../store';
import {
  createNewChatMessage,
  getChatMessagesByRoomId,
  getRoomIdByUserIdsAndProduct,
  newChatMessage,
  roomId,
} from '../constants/chatEvents';
import {io} from 'socket.io-client';
import {BASE} from '../constants/api';
import {getUserById, getUserProfile} from '../services';
import {useTheme} from '../hooks';

const Chat = () => {
  const socket = io(BASE);
  const {sizes} = useTheme();

  const {
    productTitle,
    recipientId,
    senderId,
    roomId: stateRoomId,
    setRoomId,
  } = useChatStore();

  const [userQuery, senderQuery] = useQueries({
    queries: [
      {
        queryKey: ['user'],
        queryFn: getUserProfile,
      },
      {
        queryKey: ['sender', senderId],
        queryFn: () => getUserById(senderId),
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(socket.connected);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastPong, setLastPong] = useState<string | null>(null);

  const [olderMessages, setOlderMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const getChatMessages = () => {
    socket.emit(
      getChatMessagesByRoomId,
      {roomId: stateRoomId},
      (payloadOldMessages: any) => {
        // console.log('ACKNOWLEDGe', payloadOldMessages);
        console.log(
          'messagesMapped',
          payloadOldMessages.map((msg: any) => {
            const giftedMsg: IMessage = {
              _id: msg._id,
              text: msg.message,
              createdAt: msg.createdAt,
              user: {
                _id: msg.sender,
                // name: senderQuery.data.data.name,
                // avatar: senderQuery.data.data.avatar,
              },
            };

            return giftedMsg;
          }),
        );
        setOlderMessages(
          GiftedChat.append(
            [],
            payloadOldMessages.map((msg: any) => {
              const giftedMsg: IMessage = {
                _id: msg._id,
                text: msg.message,
                createdAt: msg.createdAt,
                user: {
                  _id: msg.sender,
                  // name: senderQuery.data.data.name,
                  // avatar: senderQuery.data.data.avatar,
                },
              };

              return giftedMsg;
            }),
          ),
        );
      },
    );
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket Connected');

      socket.emit(
        getRoomIdByUserIdsAndProduct,
        {
          recipient: recipientId,
          sender: senderId,
          productTitle,
        },
        (response: any) => {
          console.log(getRoomIdByUserIdsAndProduct, ' RESPONSE', response);
        },
      );
    });

    socket.on(roomId, (payload) => {
      setRoomId(payload);

      console.log('ROOM ID', payload);

      getChatMessages();
    });

    socket.on(newChatMessage, (payload) => {
      console.log('New Chat message', payload);

      getChatMessages();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('SOCKET DISCONNECTED!');
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      socket.off(newChatMessage);
      socket.off(getChatMessagesByRoomId);
      socket.off(getRoomIdByUserIdsAndProduct);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return;
    }

    // console.log('sent', newMessage);

    socket.emit(
      createNewChatMessage,
      {
        sender: userQuery.data?.data._id,
        recipient:
          recipientId === userQuery.data?.data._id ? senderId : recipientId,
        roomId: stateRoomId,
        message: newMessage,
        productTitle,
      },
      () => {
        getChatMessages();
      },
    );
  };

  return (
    <Block>
      <Text h5 bold center marginBottom={sizes.s}>
        {senderQuery.data?.data.name}
      </Text>
      <Text h5 center>
        {productTitle}
      </Text>
      <GiftedChat
        messages={olderMessages}
        user={{
          _id: userQuery.data?.data._id,
          name: userQuery.data?.data.name,
          avatar: userQuery.data?.data.avatar,
        }}
        text={newMessage}
        onInputTextChanged={setNewMessage}
        onSend={sendMessage}
        scrollToBottom
        inverted={false}
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </Block>
  );
};

export default Chat;
