import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const getPostsByCategoryUrl = (category: string) =>
  `${API_URL}/posts/search/category/${category}`;

const getPostsByCategory = async (category: string) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.get(getPostsByCategoryUrl(category), config);

  return request.data;
};

export default getPostsByCategory;
