import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import http from '../utils/http';
import { useAuthStore } from '../stores/auth';
import { toast } from 'vue3-toastify';
import { setUserSetupStatusToLS } from '@/utils/auth';

const CURL_LOCATION = import.meta.env.VITE_URL_CURL_LOCATION;
const CKEY_LOCATION = import.meta.env.VITE_URL_CKEY_LOCATION;

export const useProfileStore = defineStore('profile', () => {
  const config = {
    cUrl: CURL_LOCATION,
    ckey: CKEY_LOCATION,
  };

  const headers = {
    'X-CSCAPI-KEY': config.ckey,
  };

  const optionCountry = ref();
  const optionState = ref();
  const optionCity = ref();
  const settingProfileSuccess = ref(false);
  const settingNotificationSuccess = ref(false);
  const profileData = ref();
  const isLoading = ref(false);
  const authStore = useAuthStore();
  const notification = ref();

  // Call open API countries
  const loadCountries = async () => {
    try {
      const response = await axios.get(config.cUrl, {
        headers,
      });
      optionCountry.value = response.data;
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  // Call open API states from countries
  const loadStates = async (countryName) => {
    try {
      const response = await axios.get(`${config.cUrl}/${countryName}/states`, {
        headers,
      });
      optionState.value = response?.data;
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  // Call open API cities from states and countries
  const loadCities = async (countryName, stateName) => {
    try {
      const response = await axios.get(`${config.cUrl}/${countryName}/states/${stateName}/cities`, {
        headers,
      });
      optionCity.value = response?.data;
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  // Change Password
  const visible = ref(false);
  const visibleSuccess = ref(false);

  const changePassword = async (body) => {
    try {
      const res = await http.phpInstance.post('/user/changepassword', body);
      if (res.status === 200) {
        visible.value = false;
        visibleSuccess.value = true;
      }
    } catch (error) {
      const data = error.response?.data?.data;
      const message = data?.error?.message;
      toast.error(message);
    }
  };

  // Get profile
  const getProfile = async () => {
    try {
      const res = await http.nodeInstance.get('/user');
      if (res.status === 200) {
        profileData.value = res.data?.metadata;
        optionCountry.value = res.data?.metadata.country;
        optionState.value = res.data?.metadata.state;
      }
    } catch (error) {
      authStore.logout();
    } finally {
      isLoading.value = false;
    }
  };

  //Edit profile settings
  const patchProfile = async (body) => {
    try {
      isLoading.value = true;
      const res = await http.nodeInstance.patch('/user/profile-setup', body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 201) {
        settingProfileSuccess.value = true;
      }
      // follow change data information user
      authStore.changeUserInfo(true);
      setUserSetupStatusToLS('true');
    } catch (error) {
      const data = error.response?.data;
      const message = data ? data.message : error.message;
      toast.error(message);
    } finally {
      isLoading.value = false;
    }
  };

  // Get API notification
  const getNotificationApi = async () => {
    try {
      const response = await http.nodeInstance.get('user/notification-setup');
      if (response.status === 200) {
        notification.value = response?.data?.metadata;
      }
    } catch (error) {
      toast.error(error);
    }
  };

  //Set up Notification
  const patchNotificationApi = async (body) => {
    try {
      const response = await http.nodeInstance.patch('user/notification-setup', body);
      if (response.status === 200) {
        settingNotificationSuccess.value = true;
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return {
    loadCountries,
    loadStates,
    loadCities,
    changePassword,
    patchProfile,
    getProfile,
    getNotificationApi,
    patchNotificationApi,
    profileData,
    optionCountry,
    optionState,
    optionCity,
    visible,
    visibleSuccess,
    settingProfileSuccess,
    isLoading,
    settingNotificationSuccess,
    notification,
  };
});
