import http from '@/utils/http';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
export const useResetPasswordStore = defineStore('resetPassword', () => {
  const newPassword = ref('');
  const confirmPassword = ref('');
  const isPasswordValidRegex = ref(true);
  const isPasswordMatch = ref(true);
  const isHidePassWord = ref(true);
  const isHideConfirmPassWord = ref(true);
  const isConfirmActive = computed(() => {
    return isPasswordValidRegex.value && isPasswordMatch.value
  }
)

  const validatePasswords = () => {
    const password = newPassword.value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s])(?=.*[0-9]).{8,16}$/;
    isPasswordValidRegex.value = passwordRegex.test(password);
  };
  const validateMatchPasswords = () => {
    isPasswordMatch.value = newPassword.value === confirmPassword.value;
  };
  watch([newPassword, confirmPassword], () => {
    validateMatchPasswords();
  });
  const hidePassWord = () => {
    isHidePassWord.value = !isHidePassWord.value
  }
  const hideConfirmPassWord = () => {
    isHideConfirmPassWord.value = !isHideConfirmPassWord.value;
  }
  const router = useRouter();

  const handleConfirm = async (tokenVal, mailVal) => {
    if(newPassword.value && confirmPassword.value)
    {
      try {
        const response = await http.nodeInstance.post(`/auth/reset-password/${tokenVal}`, {
          password: newPassword.value
        });
        const responseData = response.data;
        if (responseData.message === "Password reset successfully") {
          router.push(`/success-reset`);
        } else {
          console.error("Error updating password:", responseData.status);
          router.push(`/verification-failed/${tokenVal}/${mailVal}`)
        }
      } catch (error) {
        console.error("Error updating password:", error.message);
        router.push(`/verification-failed/${tokenVal}/${mailVal}`)
      }
    }else{
      if(!newPassword.value){
        isPasswordValidRegex.value = false;
      }
      else if(!confirmPassword.value){
        isPasswordMatch.value = false;
      }
    }
  };
  return {
    newPassword,
    confirmPassword,
    isPasswordValidRegex,
    isPasswordMatch,
    isConfirmActive,
    isHidePassWord,
    isHideConfirmPassWord,
    validatePasswords,
    validateMatchPasswords,
    hidePassWord,
    hideConfirmPassWord,
    handleConfirm
  };
});
