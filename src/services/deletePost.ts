import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const deletePostUrl = (id: string) => `${API_URL}/posts/delete/${id}`;

const deletePost = async (id: string) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.delete(deletePostUrl(id), config);

  return request.data;
};

export default deletePost;
