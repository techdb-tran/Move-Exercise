<template>
  <form class="relative w-[560px] mt-0" @submit.prevent="onSubmit">
    <div class="border mb-4"></div>
    <!-- Email  -->
    <Input label="Email" name="email" type="text" inputWidth="100%" />
    <div class="mb-4"></div>
    <!-- Password -->
    <Input label="Password" name="password" type="password" inputWidth="100%" />
    <span
      class="text-primary-color text-sm block mt-2 cursor-pointer"
      @click="handleShowForgotPassword"
      >Forgot Password?</span
    >
    <Button style="margin-top: 20px; width: 100%" :isSubmitted="isSubmitted">
      <SpinnerLoading v-if="submit" />
      <div>Log In</div>
    </Button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import Input from '../Input/Input.vue';
import Button from '../Button/Button.vue';
import { useForgotPasswordStore } from '@/stores/forgotPassword.js';
import { usePermaBanStore } from '@/stores/permaBan.js';
import { useSuspendedStore } from '@/stores/suspended.js';
import { formatDate } from '@/utils/formatDate.js';
import http from '@/utils/http.js';
import { setAccessTokenToLS, setClientIdToLS, setBrowseIdToLS } from '../../utils/auth.js';
import { useAuthStore } from '../../stores/auth.js';
import SpinnerLoading from '@/assets/svg/SpinnerLoading.vue';

const authStore = useAuthStore();
const isSubmitted = ref(false);
const forgotPasswordStore = useForgotPasswordStore();
const storeSuspended = useSuspendedStore();
const storePermaBan = usePermaBanStore();
const submit = ref(false);

const { handleSubmit, setFieldError, values } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email address is incorrect format',
      ),
    password: yup.string().required('Password is required'),
  }),
});
// unDisable submitted
const handleShowForgotPassword = () => {
  forgotPasswordStore.handleShowForgotPassword();
};
watch(
  () => [values.email, values.password],
  ([email, password]) => {
    isSubmitted.value = email !== '' && password !== '';
  },
);
const onSubmit = handleSubmit(async (values) => {
  try {
    submit.value = true;
    const res = await http.nodeInstance.post('/auth/login', values);
    const token = res.data.metadata.token;
    setAccessTokenToLS(token);
    setClientIdToLS(res.data.metadata.user.id);
    setBrowseIdToLS(res.data.metadata.browse_id);
    authStore.login();
    if (token) {
      authStore.setStep(0);
    }
  } catch (error) {
    if (error.response.status === 404) {
      setFieldError('email', 'Invalid account');
    } else if (error.response.status === 422) {
      setFieldError('password', 'Invalid password');
    } else if (error.response.status === 400) {
      setFieldError('password', 'Invalid password');
    } else if (error.response.status === 403) {
      if (error.response.data.message === 'Perma banned') {
        authStore.setStep(0);
        storePermaBan.isPermaBan = true;
      } else if (error.response.data.message.length > 25) {
        authStore.setStep(0);
        storeSuspended.isSuspended = true;
        storeSuspended.valueExpireBan = formatDate(error.response.data.message);
      } else {
        const headers = {
          email: values.email,
        };
        authStore.setEmail(values.email);
        try {
          await http.nodeInstance.get(`/auth/signup/resend-otp`, {
            headers: headers,
          });
          authStore.setStep(0);
          authStore.setStep(2);
        } catch (error) {
          authStore.setStep(0);
          authStore.setStep(2);
        }
      }
    } else {
      console.error(error);
    }
  } finally {
    submit.value = false;
  }
});
</script>
