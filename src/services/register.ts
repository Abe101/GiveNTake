import axios from 'axios';

import {API_URL} from '../constants/api';
import {IRegistration} from '../screens/Register';

const REGISTER_API_URL = `${API_URL}/auth/signup`;

const registerUser = async (body: IRegistration) => {
  const request = await axios.post(REGISTER_API_URL, body);

  return request.data;
};

export default registerUser;
