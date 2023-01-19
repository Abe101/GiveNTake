import React, {useEffect} from 'react';

import {useSocket} from '../hooks';
import {Block, Text} from '../components';

const Chat = () => {
  const socket = useSocket();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket Conneected');
    });
    socket.on('getChatMessagesByRoomId', (data) => {
      console.log(JSON.stringify(data, null, 2));
    });

    return () => {
      socket.off('connect');
      socket.off('getChatMessagesByRoomId');
    };
  }, [socket]);

  return (
    <Block safe>
      <Text>Chat</Text>
    </Block>
  );
};

export default Chat;
