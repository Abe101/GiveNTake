import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const UPDATE_PROFILE_API = `${API_URL}/user/me`;

const updateProfile = async (body: any) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const request = await axios.put(UPDATE_PROFILE_API, body, config);

  return request.data;
};

export default updateProfile;
