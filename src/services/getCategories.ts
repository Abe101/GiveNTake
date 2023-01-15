import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';

const CATEGORIES_API_URL = `${API_URL}/posts/categories`;

const getCategories = async () => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const response = await axios.get(CATEGORIES_API_URL, config);

  return response.data;
};

export default getCategories;
