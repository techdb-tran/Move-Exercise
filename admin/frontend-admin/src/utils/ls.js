export const ACCESS_TOKEN = 'access_token';
export const USER_NAME = 'user_name';

export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem(ACCESS_TOKEN, access_token);
};
export const setUserNameToLS = (user_name) => {
  localStorage.setItem(USER_NAME, user_name);
};

export const getAccessTokenFromLS = () => localStorage.getItem(ACCESS_TOKEN) || '';

export const getUserNameFromLS = () => localStorage.getItem(USER_NAME) || '';

export const clearLS = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(USER_NAME);
};
