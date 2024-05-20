<template>
  <div class="fixed top-0 left-0 right-0 bottom-0">
    <img
      class="absolute w-full h-full z-0"
      src="../../assets/images/BackGroundAdminLogin.jpeg"
      alt=""
    />
    <div class="absolute z-1 flex justify-center items-center w-full h-full">
      <div class="w-[650px] h-[410px] bg-slate-600 rounded-xl">
        <div class="w-full h-full px-10 py-10">
          <div class="text-black text-xl mb-5">
            Welcome to <span class="font-bold">Move Admin</span>
          </div>
          <form @submit.prevent="onSubmit">
            <div>
              <label class="text-base cursor-pointer block my-1" for="username">Username</label>
              <input
                class="w-full h-[40px] rounded-md pl-3 my-2 outline-primary-color"
                type="text"
                v-model="username"
                v-bind="usernameAttrs"
                id="username"
              />
              <div class="text-red-500">{{ errors.username }}</div>
            </div>
            <div class="relative">
              <label class="text-base cursor-pointer block my-1" for="password">Password</label>
              <input
                class="w-full h-[40px] rounded-md pl-3 outline-primary-color"
                :type="type"
                id="password"
                v-model="password"
                v-bind="passwordAttrs"
              />
              <EyeOff
                v-if="display"
                @click="changeType('text')"
                class="w-4 h-4 absolute top-10 right-3 cursor-pointer"
              />
              <EyeOn
                v-else
                class="w-4 h-4 absolute top-10 right-3 cursor-pointer"
                @click="changeType('password')"
              ></EyeOn>
              <div class="text-red-500">{{ errors.password }}</div>
            </div>
            <button
              class="flex justify-center items-center w-full h-12 mt-10 bg-primary-color hover:bg-opacity-80 text-white rounded-[10px] font-bold text-[16px]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/api/http.js';
import { setAccessTokenToLS, setUserNameToLS } from '/src/utils/ls.js';
import EyeOff from '@/assets/svg/EyeOff.vue';
import EyeOn from '@/assets/svg/EyeOn.vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const router = useRouter();
const display = ref(true);
const type = ref('password');

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required')
  })
});
const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values, { setFieldError }) => {
  try {
    const res = await http.nodeInstance.post('auth/login', {
      username: values.username,
      password: values.password
    });
    const token = res.data.metadata.accessToken;
    setAccessTokenToLS(token);
    setUserNameToLS(username.value);
    router.push('/overview');
  } catch (error) {
    setFieldError('username', 'Invalid account');
  }
});
const changeType = (value) => {
  display.value = !display.value;
  type.value = value;
};
</script>

<style scoped></style>
