// utils/auth.js

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getAuthToken = () => {
  return localStorage.getItem('auth_cbt_token');
};

const setAuthToken = (token) => {
  localStorage.setItem('auth_cbt_token', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('auth_cbt_token');
};

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        removeAuthToken();
        const navigate = useNavigate();
        navigate('/signin');
      }
      return Promise.reject(error);
    }
  );
};

export { getAuthToken, setAuthToken, removeAuthToken, setupAxiosInterceptors };
