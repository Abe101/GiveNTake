import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const searchPostsByNameUrl = (query: string) =>
  `${API_URL}/posts/search/name/${query}`;

const searchPostsByName = async (query: string) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.get(searchPostsByNameUrl(query), config);

  return request.data;
};

export default searchPostsByName;
