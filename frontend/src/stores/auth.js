import { clearLS } from '@/utils/auth';
import { defineStore } from 'pinia';
import http from '@/utils/http.js';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  //0 turn off popup, 1 turn on popup login and signup, 2 turn on popup verify code after signup success, 3 turn on popup forgot password
  const showStep = ref(0);
  //true login, false sign up
  const showComponent = ref(true);
  const loggedIn = ref(localStorage.getItem('access_token') ? true : false);
  const email = ref('');
  const statusChangeUserInfo = ref(false);

  const setStep = (step) => {
    showStep.value = step;
  };
  const setShowComponent = (boolean) => {
    showComponent.value = boolean;
  };
  const login = () => {
    loggedIn.value = true;
    window.location.reload();
  };
  const logout = async () => {
    try {
      await http.nodeInstance.post(
        'https://api.node.move-training-stg.madlab.tech/v1/api/auth/logout',
      );
      clearLS();
      loggedIn.value = false;
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const setEmail = (newEmail) => {
    email.value = newEmail;
  };
  const changeUserInfo = (boolean) => {
    statusChangeUserInfo.value = boolean;
  };

  return {
    showStep,
    showComponent,
    loggedIn,
    email,
    statusChangeUserInfo,

    setStep,
    setShowComponent,
    login,
    logout,
    setEmail,
    changeUserInfo,
  };
});
