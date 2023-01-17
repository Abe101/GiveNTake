import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const getPostsByUserUrl = (email: string) => `${API_URL}/posts/author/${email}`;

const getPostsByUser = async (email: string) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.get(getPostsByUserUrl(email), config);

  return request.data;
};

export default getPostsByUser;
