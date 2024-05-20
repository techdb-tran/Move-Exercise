<template>
<div class="card flex flex-col">
  <header class="w-full bg-black h-16">
        <RouterLink to="/"><img class="m-auto mt-5 cursor-pointer" src="../../assets/images/logo-white.png" alt="logo white"></RouterLink>
  </header>
  <Card class="create-new-password">
    <template #title>
      <div class="title-create-new-password">Create new password</div>
      <p class="text-sm text-black font-normal mt-0">
        Please enter your new password and make sure your password is alphanumeric with at least 8
        characters.
      </p>
    </template>
    <template #content>
      <form @submit.prevent="handleConfirm">
        <div class="w-full">
          <label for="new-password" class="text-sm text-black">New password</label>
          <div class="new-password-wrap">
            <input id="new-password" class="w-full" :type="passwordType" autocomplete="new-password"
              placeholder="Enter new password" v-model="store.newPassword" @input="store.validatePasswords" />
            <EyeOpen v-if="!store.isHidePassWord" class="w-4 h-3.5 m-auto cursor-pointer" alt="eye-image" @click="() => {
                store.hidePassWord();
              }
              " />
            <EyeOff v-if="store.isHidePassWord" class="w-4 h-3.5 m-auto cursor-pointer" alt="eye-image" @click="() => {
                store.hidePassWord();
              }
              " />
          </div>
          <span v-if="!store.isPasswordValidRegex" class="text-red-500 text-sm">Password must include uppercase,
            lowercase, numeric, and special characters, and be
            8-16 characters long.</span>
        </div>
        <div class="mt-5 w-full">
          <label for="confirm-new-password" class="text-sm text-black">Confirm new password</label>
          <div class="confirm-new-password-wrap">
            <input id="confirm-new-password" class="w-full" :type="passwordConfirmType" autocomplete="new-password"
              placeholder="Confirm new password" v-model="store.confirmPassword"
              @input="store.validateMatchPasswords" />
            <EyeOpen v-if="!store.isHideConfirmPassWord" class="w-4 h-3.5 m-auto cursor-pointer" alt="eye-image" @click="() => {
                store.hideConfirmPassWord();
              }
              " />
            <EyeOff v-if="store.isHideConfirmPassWord" class="w-4 h-3.5 m-auto cursor-pointer" alt="eye-image" @click="() => {
                store.hideConfirmPassWord();
              }
              " />
          </div>
          <span v-if="!store.isPasswordMatch" class="text-red-500 text-sm">Passwords do not match</span>
        </div>
        <div class="flex justify-center w-full">
          <Button class="confirm-btn" :isSubmitted="store.isConfirmActive">Confirm</Button>
        </div>
      </form>
    </template>
  </Card>
</div>
</template>

<script setup>
import Card from 'primevue/card';
import Button from '../Button/Button.vue';
import { useResetPasswordStore } from '../../stores/resetPassword';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import EyeOff from '@/assets/svg/EyeOff.vue';
import EyeOpen from '@/assets/svg/EyeOn.vue';
import http from '@/utils/http';
const store = useResetPasswordStore()
const props = defineProps({
  token: String,
  email: String,
});
const passwordType = computed(() => (store.isHidePassWord ? 'password' : 'text'));
const passwordConfirmType = computed(() => (store.isHideConfirmPassWord ? 'password' : 'text'));
const route = useRoute();
const router = useRouter()
function handleConfirm() {
  store.handleConfirm(route.params.token, route.params.email);
}

async function getValidToken() {
  try {
    const res = await http.nodeInstance.get(`/auth/verify-forgot-password-token/${route.params.token}`);
  } catch (error) {
    router.push(`/verification-failed/${route.params.token}/${route.params.email}`);
  }
}
onMounted(() => {
  getValidToken()
})
</script>

<style scoped>
.new-password-wrap,
.confirm-new-password-wrap {
  display: flex;
  border: 1px solid #cccccc;
  border-radius: 5px;
  height: 40px;
  outline: none;
  padding-left: 5px;
}

#new-password,
#confirm-new-password {
  margin-top: 5px;
  width: 90%;
  outline: none;
}

.create-new-password {
  box-shadow: 0 2px 8px rgb(219, 210, 210);
  width: 424px;
  margin: auto;
  margin-top: 154px;
  min-height: 333px;
}

.title-create-new-password {
  color: black;
  font-size: 16px;
  margin-top: -10px;
}

.confirm-btn {
  width: 235px;
}
</style>
