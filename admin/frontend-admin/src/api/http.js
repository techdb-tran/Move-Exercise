import axios, { HttpStatusCode } from 'axios';
import { getAccessTokenFromLS, getUserNameFromLS, clearLS } from '../utils/ls';
const BASE_URL_PHP = import.meta.env.VITE_URL_API_PHP;
const BASE_URL_NODE = import.meta.env.VITE_URL_API_NODE;
const BASE_URL_USER_PHP = import.meta.env.VITE_URL_API_PHP_USER;
const BASE_URL_USER_NODE = import.meta.env.VITE_URL_API_NODE_USER;
class Http {
  constructor() {
    this.phpUserInstance = axios.create({
      baseURL: BASE_URL_USER_PHP,
      timeout: 100000
    });

    this.nodeUserInstance = axios.create({
      baseURL: BASE_URL_USER_NODE,
      timeout: 100000
    });

    this.phpInstance = axios.create({
      baseURL: BASE_URL_PHP,
      timeout: 100000
    });

    this.nodeInstance = axios.create({
      baseURL: BASE_URL_NODE,
      timeout: 100000
    });

    this.nodeInstance.interceptors.request.use(
      (config) => {
        config.headers.authorization = `Bearer ${getAccessTokenFromLS()}`;
        config.headers['admin-username'] = `${getUserNameFromLS()}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.phpUserInstance.interceptors.request.use(
      (config) => {
        if (getAccessTokenFromLS()) {
          config.headers.authorization = `Bearer ${getAccessTokenFromLS()}`;
          config.headers['admin-username'] = `${getUserNameFromLS()}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.nodeUserInstance.interceptors.request.use(
      (config) => {
        if (getAccessTokenFromLS()) {
          config.headers.authorization = `Bearer ${getAccessTokenFromLS()}`;
          config.headers['admin-username'] = `${getUserNameFromLS()}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.phpInstance.interceptors.request.use(
      (config) => {
        if (getAccessTokenFromLS()) {
          config.headers.authorization = `Bearer ${getAccessTokenFromLS()}`;
          config.headers['admin-username'] = `${getUserNameFromLS()}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.nodeInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error.response.status);
        if (error.response.status === 401) {
          clearLS();
          window.location.reload();
        }
        if (error.response?.status !== HttpStatusCode.Unauthorized) {
          const data = error.response?.data;
          console.log(data);
          const message = data.message || error.message;
          console.log(message);
        }
        return Promise.reject(error);
      }
    );

    this.phpInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.code === 401) {
          clearLS();
          window.location.reload();
        }
        if (error.response?.status !== HttpStatusCode.Unauthorized) {
          const data = error.response?.data;
          const message = data.message || error.message;
          console.log(message);
        }
        return Promise.reject(error);
      }
    );

    this.phpUserInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.code === 401) {
          clearLS();
          window.location.reload();
        }
        if (error.response?.status !== HttpStatusCode.Unauthorized) {
          const data = error.response?.data;
          const message = data.message || error.message;
          console.log(message);
        }
        return Promise.reject(error);
      }
    );
  }
}
const http = new Http();

export default http;
