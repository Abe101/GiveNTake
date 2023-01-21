import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const CHAT_ROOM_URL = `${API_URL}/chatRoom/me`;

const getMyChats = async () => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.get(CHAT_ROOM_URL, config);

  return request.data;
};

export default getMyChats;
