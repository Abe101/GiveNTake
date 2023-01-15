import axios from 'axios';

import {API_URL} from '../constants/api';
import {ISignIn} from './../screens/SignIn';

const LOGIN_API_URL = `${API_URL}/auth/login`;

const loginUser = async (body: ISignIn) => {
  const request = await axios.post(LOGIN_API_URL, body);

  return request.data;
};

export default loginUser;
