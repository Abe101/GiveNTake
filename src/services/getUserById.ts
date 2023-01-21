import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const getUserByIdUrl = (id: string) => `${API_URL}/user/byId/${id}`;

const getUserById = async (id: string) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.get(getUserByIdUrl(id), config);

  return request.data;
};

export default getUserById;
