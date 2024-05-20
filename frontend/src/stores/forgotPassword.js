import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { ref, computed } from 'vue';
import http from '@/utils/http';

export const useForgotPasswordStore = defineStore('forgotPassword', () => {
  const visible = ref(false);
  const email = ref('');
  const isSuccess = ref(false);
  const isFail = ref(false);
  const isFirstSend = ref(true);
  const limitResend = ref(0);
  const isFirstResend = computed(()=>{
    return limitResend.value < 2;
  })
  const isResend = ref(false);
  const isErrorEmail = ref(false);
  const isValidEmail = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.value);
  });
  const authStore = useAuthStore();
  const handleShowForgotPassword = () => {
    authStore.setStep(0);
    setTimeout(function () {
      visible.value = true;
    }, 200);
  };
  const goToLoginPage = () => {
    visible.value = false;
    setTimeout(function () {
      authStore.setStep(1);
      resetForm();
    }, 200);
  };
  const handleSubmitForm = async (valueEmailResend) => {
    try {
      isSuccess.value = false;
      isFail.value = false;
      const response = await http.nodeInstance.post('/auth/forgot-password', {
        email: email.value || valueEmailResend,
      });
      if (response.status === 200) {
        isSuccess.value = true;
        isFirstSend.value = false;
        isResend.value = true;
        isErrorEmail.value = false;
      }
    } catch (error) {
      isFail.value = true;
      isFirstSend.value = false;
      isResend.value = true;
      isErrorEmail.value = true;
    } finally{
      limitResend.value++;
      if (limitResend.value === 2) {
        setTimeout(() => {
          limitResend.value = 1;
        }, 120000);
    }
    }
  };
  


  const resetForm = () => {
    email.value = '';
    isSuccess.value = false;
    isFail.value = false;
    isFirstSend.value = true;
    isResend.value = false;
    isErrorEmail.value = false;
    limitResend.value = 0;
  };

  const closeModal = () => {
    visible.value = false;
    resetForm();
  };
  return {
    visible,
    email,
    isSuccess,
    isFail,
    isErrorEmail,
    isFirstSend,
    isResend,
    isValidEmail,
    isFirstResend,
    handleSubmitForm,
    goToLoginPage,
    handleShowForgotPassword,
    resetForm,
    closeModal,
  };
});
