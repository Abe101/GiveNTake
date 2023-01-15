import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const getPostsUrl = (limit: number) => `${API_URL}/posts/latest/${limit}`;

const getLatestPosts = async (limit: number) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.get(getPostsUrl(limit), config);

  return request.data;
};

export default getLatestPosts;
