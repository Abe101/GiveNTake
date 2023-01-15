import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const USER_PROFILE_API = `${API_URL}/user/me`;

const getUserProfile = async () => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const response = await axios.get(USER_PROFILE_API, config);

  return response.data;
};

export default getUserProfile;
