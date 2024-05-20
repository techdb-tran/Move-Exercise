export const CLIENT_ID_KEY = 'client-id';
export const BROWSE_ID_KEY = 'browse-id';
export const ACCESS_TOKEN = 'access_token';
export const AVATAR_URL = 'avatar-url';
export const STATUS_VERIFIED = 'status-verified';
export const USER_SETUP_STATUS = 'user_setup_status';
export const USER_INFORMATION = 'user_information';

export const access_token = localStorage.getItem('access_token');

export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem(ACCESS_TOKEN, access_token);
};

export const setStatusVerifiedToLS = (status) => {
  localStorage.setItem(STATUS_VERIFIED, status);
};

export const setClientIdToLS = (client_id) => {
  localStorage.setItem(CLIENT_ID_KEY, client_id);
};

export const setBrowseIdToLS = (browse_id) => {
  localStorage.setItem(BROWSE_ID_KEY, browse_id);
};

export const setAvatarUrlToLS = (avatar_url) => {
  localStorage.setItem(AVATAR_URL, avatar_url);
};

export const removeStatusVerifiedLS = () => {
  localStorage.removeItem(STATUS_VERIFIED);
};

export const setUserSetupStatusToLS = (status) => {
  localStorage.setItem(USER_SETUP_STATUS, status);
};
export const setUserInformationToLs = (user) => {
  localStorage.setItem(USER_INFORMATION, JSON.stringify(user));
};

export const clearLS = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(CLIENT_ID_KEY);
  localStorage.removeItem(BROWSE_ID_KEY);
  localStorage.removeItem(AVATAR_URL);
  localStorage.removeItem(STATUS_VERIFIED);
  localStorage.removeItem(USER_SETUP_STATUS);
  localStorage.removeItem(USER_INFORMATION);
};

export const getAccessTokenFromLS = () => localStorage.getItem(ACCESS_TOKEN) || '';
export const getClientIdFromLS = () => localStorage.getItem(CLIENT_ID_KEY) || '';
export const getBrowseIdLS = () => localStorage.getItem(BROWSE_ID_KEY) || '';
export const getAvatarUrlFromLS = () => localStorage.getItem(AVATAR_URL) || '';
export const getStatusVerifiedFromLS = () => localStorage.getItem(STATUS_VERIFIED) || '';
export const getStatusUserSetupFromLS = () => localStorage.getItem(USER_SETUP_STATUS) || '';
export const getUserInformationFromLS = () =>
  JSON.parse(localStorage.getItem(USER_INFORMATION)) || '';
