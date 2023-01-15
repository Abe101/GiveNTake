import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';
import {IPost} from '../components/Forms/PublishForm';

const POST_RECEIVER_REQUEST_API = `${API_URL}/posts/addNew`;

const uploadRecieverRequest = async (body: IPost) => {
  const token = await AsyncStorage.getItem('@access-token').then((data) => {
    if (data) {
      return JSON.parse(data);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const request = await axios.post(POST_RECEIVER_REQUEST_API, body, config);

  return request.data;
};

export default uploadRecieverRequest;
