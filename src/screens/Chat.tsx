import React, {useEffect} from 'react';

import {useSocket} from '../hooks';
import {Block, Text} from '../components';

const Chat = () => {
  const socket = useSocket();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket Connected');
    });

    return () => {
      socket.off('connect');
    };
  }, [socket]);

  return (
    <Block safe>
      <Text>Chat</Text>
    </Block>
  );
};

export default Chat;
