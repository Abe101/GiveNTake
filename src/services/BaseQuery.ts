import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '../constants/api';
import {IRegistration} from '../screens/Register';
import {ISignIn} from '../screens/SignIn';

export default class BaseQuery {
  static async registerUser(body: IRegistration): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };

    const request = await fetch(`${API_URL}/auth/signup`, requestOptions)
      .then((res) => res.json())
      .then(async (data) => {
        console.log('SUCCESS REGISTER', JSON.stringify(data, null, 2));
        await AsyncStorage.setItem(
          '@access-token',
          JSON.stringify(data.data.access_token),
        );
        return [true, data];
      })
      .catch((error) => {
        console.error('ERROR REGISTER', JSON.stringify(error, null, 2));
        return [false, error];
      });

    return request;
  }

  static async loginUser(body: ISignIn): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };

    const request = await fetch(`${API_URL}/auth/login`, requestOptions)
      .then((res) => res.json())
      .then(async (data) => {
        console.log('SUCCESS LOGIN', JSON.stringify(data, null, 2));
        await AsyncStorage.setItem(
          '@access-token',
          JSON.stringify(data.data.access_token),
        );
        return [true, data];
      })
      .catch((error) => {
        console.error('ERROR LOGIN', JSON.stringify(error, null, 2));
        return [false, error];
      });

    return request;
  }

  static async getCategories(): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const token = await AsyncStorage.getItem('@access-token').then((data) => {
      if (data) {
        return JSON.parse(data);
      }
    });

    headers.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers,
    };

    const request = await fetch(`${API_URL}/posts/categories`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        return [true, data];
      })
      .catch((error) => {
        console.log(
          'ERROR FETCHING CATEGORIES',
          JSON.stringify(error, null, 2),
        );
        return [false, error];
      });

    return request;
  }
}
