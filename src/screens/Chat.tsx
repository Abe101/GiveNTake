import React, {useEffect, useState} from 'react';

import {Block, Text} from '../components';
import {usePostStore} from '../store';
import {PostState} from '../store/usePostStore';
import {
  createNewChatMessage,
  getChatMessagesByRoomId,
  getRoomIdByUserIdsAndProduct,
  newChatMessage,
  roomId,
} from '../constants/chatEvents';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {io} from 'socket.io-client';
import {BASE} from '../constants/api';

const Chat = () => {
  const socket = io(BASE);

  const [productTitle, recipient, sender, stateRoomId, setRoomId] =
    usePostStore((state: PostState) => [
      state.productTitle,
      state.recipient,
      state.sender,
      state.roomId,
      state.setRoomId,
    ]);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);

  const [olderMessages, setOlderMessages] = useState<any>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket Connected');

      socket.emit(
        getRoomIdByUserIdsAndProduct,
        {
          recipient,
          sender,
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

      socket.emit(
        getChatMessagesByRoomId,
        {roomId: stateRoomId},
        (payloadOldMessages: any) => {
          console.log('ACKNOWLEDGe', payloadOldMessages);
          setOlderMessages(payloadOldMessages);
        },
      );
    });

    socket.on(newChatMessage, (payload) => {
      console.log('New Chat message', payload);
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    socket.emit(
      createNewChatMessage,
      {
        sender,
        recipient,
        roomId: stateRoomId,
        message: 'HElllooo!',
        productTitle,
      },
      (response: any) => {
        console.log('MESSAGE', response);
      },
    );
  };

  return (
    <Block safe>
      <Text>Chat</Text>
      <Text>CONNECTED: {isConnected}</Text>
      <Text>LAST PONG:{lastPong}</Text>

      <TouchableOpacity onPress={sendMessage}>
        <Text>Hellloo!</Text>
      </TouchableOpacity>
    </Block>
  );
};

export default Chat;
