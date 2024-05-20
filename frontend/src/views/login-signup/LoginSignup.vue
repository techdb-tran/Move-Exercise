<template>
  <div class="card flex justify-content-center custom-dialog-style">
    <Dialog
      v-model:visible="visible"
      :draggable="false"
      :closeOnEscape="false"
      modal
      class="p-4"
      :blockScroll="true"
    >
      <template #header>
        <div class="relative w-full">
          <button class="w-6 h-6 absolute top-0 right-0 cursor-pointer" @click="closePopup">
            <CancelIcon />
          </button>
          <div class="flex justify-center">
            <LogoIcon />
          </div>
        </div>
      </template>
      <div class="flex justify-center h-[52px] mt-4">
        <button
          class="cursor-pointer relative font-bold w-[86px]"
          :class="{ 'text-primary-color': showComponent }"
          @click="showComponentLoginSignup(true)"
        >
          Log In
          <Transition name="appearLogin">
            <div
              v-if="showComponent"
              class="font-bold text-primary-color absolute bottom-0 left-0 w-full h-1 bg-primary-color"
            ></div>
          </Transition>
        </button>
        <button
          class="cursor-pointer relative font-bold w-[86px]"
          :class="{ 'text-primary-color': !showComponent }"
          @click="showComponentLoginSignup(false)"
        >
          Sign Up
          <Transition name="appearSignup">
            <div
              v-if="!showComponent"
              class="font-bold text-primary-color absolute bottom-0 left-0 w-full h-1 bg-primary-color"
            ></div>
          </Transition>
        </button>
      </div>
      <div v-if="showComponent">
        <Login />
      </div>
      <div v-else>
        <SignUp />
      </div>
    </Dialog>
    <ForgotPassWord />
  </div>
  <CodeVerify />
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Login from '@/components/login/Login.vue';
import SignUp from '@/components/signup/SignUp.vue';
import { useAuthStore } from '/src/stores/auth.js';
import CancelIcon from '../../assets/images/CancelIcon.vue';
import LogoIcon from '@/assets/images/LogoIcon.vue';
import ForgotPassWord from '@/components/ForgotPassWord/ForgotPassWord.vue';
import CodeVerify from '@/views/login-signup/CodeVerify.vue';

// const loginStore = useLoginStore();
const authStore = useAuthStore();
const visible = ref(false);
const showComponent = computed(() => authStore.showComponent);

const closePopup = () => {
  visible.value = false;
  authStore.setStep(0);
};

const showComponentLoginSignup = (value) => {
  authStore.setShowComponent(value);
};
watch(
  () => authStore.showStep,
  (newValue) => {
    if (newValue === 1) {
      visible.value = true;
    } else {
      visible.value = false;
    }
  },
);
</script>
<style>
/* animation for switch login - signup */
.appearLogin-enter-from {
  width: 0%;
  left: unset;
  right: 0;
}
.appearLogin-enter-to {
  width: 100%;
  left: unset;
  right: 0;
}
.appearLogin-enter-active {
  transition: all 0.5s ease;
}

.appearLogin-leave-from {
  width: 100%;
  left: unset;
  right: 0;
}
.appearLogin-leave-to {
  width: 0%;
  left: unset;
  right: 0;
}
.appearLogin-leave-active {
  transition: all 0.5s ease;
}
.appearSignup-enter-from {
  width: 0%;
}
.appearSignup-enter-to {
  width: 100%;
}
.appearSignup-enter-active {
  transition: all 0.5s ease;
}

.appearSignup-leave-from {
  width: 100%;
}
.appearSignup-leave-to {
  width: 0%;
}
.appearSignup-leave-active {
  transition: all 0.5s ease;
}
</style>
