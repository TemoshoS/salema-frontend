import axios from 'axios';
import {store} from '../redux/store';

//const baseURL = 'http://10.0.2.2:3000';
const baseURL = 'http://172.20.10.7:3000';

//const baseURL = 'https://salema-backend1.onrender.com'; 

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAccessToken = async () => {
  try {
    const {auth} = store.getState();
    const accessToken = auth.accessToken;
    return accessToken;
  } catch (error) {
    console.log({error});
    return false;
  }
};

axiosInstance.interceptors.request.use(
  async request => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const {headers} = request;
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
