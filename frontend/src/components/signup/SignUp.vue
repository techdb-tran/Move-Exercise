<template>
  <form @submit.prevent="onSubmit" class="relative w-[560px] mt-0">
    <div class="border mb-4"></div>
    <!-- Email  -->
    <Input label="Email" name="email" type="text" inputWidth="100%" />
    <div class="mb-4"></div>
    <!-- Password -->
    <Input label="Password" name="password" type="password" inputWidth="100%" />
    <div class="mb-4"></div>
    <!-- Confirm Password -->
    <Input label="Confirm Password" name="confirmPassword" type="password" inputWidth="100%" />
    <div class="mb-4"></div>
    <div class="text-primary-text-color text-sm">
      By clicking Sign Up, you are indicating that you have read and acknowledge the
      <span class="text-primary-color cursor-pointer">Terms of Service</span> and
      <span class="text-primary-color cursor-pointer">Privacy Notice</span>.
    </div>
    <Button style="margin-top: 20px; width: 100%" :isSubmitted="isSubmitted">
      <SpinnerLoading v-if="submit" />
      <div>Sign up</div></Button
    >
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useAuthStore } from '@/stores/auth.js';
import Button from '../Button/Button.vue';
import Input from '../Input/Input.vue';
import http from '@/utils/http.js';
import SpinnerLoading from '@/assets/svg/SpinnerLoading.vue';

const authStore = useAuthStore();
const isSubmitted = ref(false);
const errorEmail = ref('');
const errorPassword = ref('');
const { handleSubmit, setFieldError, values } = useForm({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
  },
  validationSchema: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email address is incorrect format',
      ),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must have at least 8 characters')
      .max(16, 'Password must not be longer than 16 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/ ])[A-Za-z\d`~!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/ ]{8,}$/,
        'Password must include uppercase, lowercase, number, and special character.',
      ),
    confirmPassword: yup
      .string()
      .required('Password is required.')
      .min(8, 'Password must have at least 8 characters.')
      .max(16, 'Password must not be longer than 16 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/ ])[A-Za-z\d`~!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/ ]{8,}$/,
        'Password must include uppercase, lowercase, number, and special character.',
      )
      .oneOf([yup.ref('password')], 'The confirm password does not match.'),
  }),
});
const submit = ref(false);

// unDisable Submitted
watch(
  () => [values.email, values.password, values.confirmPassword],
  ([email, password, confirmPassword]) => {
    isSubmitted.value = email !== '' && password !== '' && confirmPassword !== '';
  },
);
const onSubmit = handleSubmit(async (values) => {
  try {
    submit.value = true;
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...data } = values;
    const res = await http.nodeInstance.post('/auth/signup', data);
    const email = res.data.metadata.user.email;
    authStore.setEmail(email);
    authStore.setStep(2);
  } catch (error) {
    if (error.response.status === 409) {
      errorEmail.value = error.response.data.message;
      setFieldError('email', errorEmail.value);
    } else if (error.response.status === 422) {
      errorPassword.value = error.response.data.message;
      setFieldError('password', errorPassword.value);
    } else {
      console.log(error);
    }
  } finally {
    submit.value = false;
  }
});
</script>

<style scoped></style>
