<template>
  <div class="card flex justify-content-center custom-dialog-style">
    <Dialog v-model:visible="visible" :draggable="false" :closeOnEscape="false" modal class="p-4">
      <template #header>
        <div class="relative w-full">
          <button class="w-6 h-6 absolute top-0 right-0 cursor-pointer" @click="closePopup">
            <CancelIcon />
          </button>
          <div class="font-bold text-[16px] leading-[21px] font-sans text-black">
            Verify your email to keep account secure
          </div>
        </div>
      </template>
      <form class="w-[536px] p-1" @submit.prevent="onSubmit">
        <div class="text-black font-sans text-sm">
          We sent a 6-digit code to <span class="font-bold">{{ authStore.email }}. </span>Enter the
          code below to confirm your account.
        </div>
        <div class="text-sm mt-5" v-if="canClick">
          Verification Code (<span class="text-primary-color cursor-pointer" @click="resendCode"
            >Resend code</span
          >)
        </div>
        <div class="text-sm mt-5" v-else>
          Verification Code has been sent, can request resend after: (<span class="text-red-700"
            >{{ count }}s</span
          >)
        </div>
        <input
          class="w-full h-10 mt-1 p-1 outline-border-color outline outline-[0.5px] rounded-lg focus:outline-primary-color focus:outline focus:outline-[0.5px] focus:rounded-lg text-sm pl-4 caret-primary-color"
          type="number"
          @input="checkInput"
          v-model="verifyCode"
          required
        />
        <ErrorMessage>{{ errorOtp }}</ErrorMessage>
        <div class="flex justify-center">
          <button
            class="flex justify-center items-center w-[200px] h-10 mt-5 bg-secondary-text-color text-border-color rounded-[10px] font-bold text-[16px]"
            :class="{ '!bg-primary-color !text-primary-white-color': inputFilled }"
          >
            <SpinnerLoading v-if="submit" />
            <div>Submit</div>
          </button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import CancelIcon from '../../assets/images/CancelIcon.vue';
import { useAuthStore } from '@/stores/auth';
import ErrorMessage from '../../components/error_message/ErrorMessage.vue';
import http from '@/utils/http.js';
import {
  setAccessTokenToLS,
  setClientIdToLS,
  setBrowseIdToLS,
  setStatusVerifiedToLS,
} from '../../utils/auth.js';
import SpinnerLoading from '@/assets/svg/SpinnerLoading.vue';

const visible = ref(false);
const verifyCode = ref('');
const inputFilled = ref(false);
const authStore = useAuthStore();
const errorOtp = ref('');
const count = ref(0);
const canClick = ref(true);
const submit = ref(false);

const closePopup = () => {
  verifyCode.value = '';
  inputFilled.value = false;
  canClick.value = true;
  count.value = 0;
  visible.value = false;
  authStore.setStep(0);
};
const checkInput = () => {
  if (verifyCode.value.toString().length > 0) {
    inputFilled.value = true;
  } else {
    inputFilled.value = false;
  }
};
const onSubmit = async () => {
  try {
    submit.value = true;
    verifyCode.value = verifyCode.value.toString();
    const data = {
      otp: verifyCode.value,
    };
    const headers = {
      email: authStore.email,
    };
    const res = await http.nodeInstance.post('/auth/signup/verify', data, {
      headers: headers,
    });
    const token = res.data.metadata.token;
    const status = res.data.message;
    setStatusVerifiedToLS(status);
    setAccessTokenToLS(token);
    setClientIdToLS(res.data.metadata.user.id);
    setBrowseIdToLS(res.data.metadata.browse_id);
    authStore.login();
    authStore.setStep(0);
  } catch (error) {
    if (error.response.status === 400 || error.response.status === 404) {
      errorOtp.value = error.response.data.message;
    }
  } finally {
    submit.value = false;
  }
};
const resendCode = async () => {
  canClick.value = false;
  count.value = 120;
  const countdownInterval = setInterval(() => {
    count.value--;
    if (count.value <= 0) {
      clearInterval(countdownInterval);
      canClick.value = true;
    }
  }, 1000);
  try {
    const headers = {
      email: authStore.email,
    };
    await http.nodeInstance.get('/auth/signup/resend-otp', {
      headers: headers,
    });
  } catch (error) {
    console.log(error);
  }
};
watch(
  () => authStore.showStep,
  (newValue) => {
    if (newValue === 2) {
      visible.value = true;
    } else {
      visible.value = false;
    }
  },
);
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
