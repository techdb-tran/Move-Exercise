<template>
  <Dialog class="relative p-4" :style="{width:'568px'}" v-model:visible="store.visible" :draggable="false" modal header="Reset password">
    <template #header>
      <div class="font-bold absolute left-4 top-4">Reset password</div>
    </template>
    <CloseButton @click="store.closeModal" class="cursor-pointer absolute right-4 top-4"/>
    <form @submit.prevent="handleSubmitForm"> 
      <label for="reset-password" class="text-sm text-black mt-[54px] block">Enter email address for your account</label>
      <input id="reset-password" class="w-full h-10" type="email" v-model="store.email"
        :class="{ 'isErrorEmail': store.isErrorEmail }" @focus="onFocus"/>
      <div v-if="!isFocus">
        <div class="flex justify-center mt-3 w-full" v-if="store.isSuccess">
        <div class="success-message-wrap text-center">
          <p class="success-message">We've sent an email to <span :style="{ 'font-weight': 'bold' }">{{ store.email
              }}</span><br />
            Click the link in the email to reset your password.</p>
        </div>
      </div>
      <div class="flex justify-center mt-3 w-full" v-if="store.isFail">
        <div class="error-message-wrap text-center">
          <p class="error-message">Sorry, we couldn't find that email<br />
            Please check your email address again!</p>
        </div>
      </div>
      </div>
      <div class="flex justify-center">
        <Button v-if="store.isFirstSend" :style="{ width: '15.5rem', marginTop: '16px' }"
          :isSubmitted="store.isValidEmail" :disabled="!store.isValidEmail" type="submit">Send password reset link
        </Button>
        <Button v-if="store.isResend" :style="{ width: '15.5rem', marginTop: '16px' }" :isSubmitted="store.isFirstResend">Resend the
          link</Button>
      </div>
      <div class="flex justify-center">
        <p class="text-sm text-primary-color mt-4 cursor-pointer" @click="goToLoginPage">Back to login page</p>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Button from '../Button/Button.vue';

import { useForgotPasswordStore } from '../../stores/forgotPassword';
import CloseButton from '@/assets/svg/CloseButton.vue';
import {ref} from 'vue'
const store = useForgotPasswordStore();
const isFocus = ref(false);

const handleSubmitForm = () => {
  isFocus.value = false;
  store.handleSubmitForm();
};
const onFocus = () =>{
  isFocus.value = true;
}
const goToLoginPage = ()=>{
    store.goToLoginPage();
}
</script>

<style scoped>
#reset-password {
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  outline: none;
  padding-left: 10px;
  width: 536px;
}

#reset-password:focus {
  border: 1px solid #13D0B4;
}

.success-message-wrap,
.error-message-wrap {
  width: 545px;
  min-height: 4rem;
  height: fit-content;
  display: block;
  border-radius: 5px;
  margin: auto;
}

.success-message,
.error-message {
  width: 25rem;
  min-height: 2.5rem;
  font-size: 14px;
  color: black;
  margin: auto;
  padding: 12px;
}

.success-message-wrap {
  border: 1px solid #13D0B4;
  background: #E6FFFB;
}

.error-message-wrap {
  border: 1px solid #FF647A;
  background: #FDEDEF;
}

.isErrorEmail {
  border-color: #FF647A;
  color: #FF647A;
  border: 1px solid #FF647A !important;
}
form{
  margin-top: 19px 
}
</style>