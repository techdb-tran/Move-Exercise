import axios, { HttpStatusCode } from 'axios';
import { clearLS, getAccessTokenFromLS, getBrowseIdLS, getClientIdFromLS } from './auth';
const BASE_URL_PHP = import.meta.env.VITE_URL_API_PHP;
const BASE_URL_NODE = import.meta.env.VITE_URL_API_NODE;

class Http {
  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.clientId = getClientIdFromLS();
    this.browseId = getBrowseIdLS();

    this.phpInstance = axios.create({
      baseURL: BASE_URL_PHP,
      timeout: 100000,
    });

    this.nodeInstance = axios.create({
      baseURL: BASE_URL_NODE,
      timeout: 100000,
    });

    this.nodeInstance.interceptors.request.use(
      (config) => {
        config.headers.authorization = `Bearer ${this.accessToken}`;
        config.headers['client-id'] = this.clientId;
        config.headers['browse-id'] = this.browseId;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.phpInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
          config.headers['client-id'] = this.clientId;
          config.headers['browse-id'] = this.browseId;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.nodeInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status !== HttpStatusCode.Unauthorized) {
          if (error.response?.status === HttpStatusCode.NotFound) {
            if (error.response?.data.message == 'User not logged in') {
              clearLS();
              window.location.reload();
            }
          } else {
            const data = error.response?.data;
            const message = data.message || error.message;
            console.log(message);
          }
        }
        return Promise.reject(error);
      },
    );

    this.phpInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status !== HttpStatusCode.Unauthorized) {
          const data = error.response?.data;
          const message = data.message || error.message;
          console.log(message);
        }
        return Promise.reject(error);
      },
    );
  }
}
const http = new Http();

export default http;
