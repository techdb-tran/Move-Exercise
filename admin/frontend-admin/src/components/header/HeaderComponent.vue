<template>
  <header class="z-999 bg-black fixed w-full top-0">
    <div class="flex items-center mx-4 py-0 justify-end h-14 relative">
      <div class="header-container--logo">
        <RouterLink to="/overview"
          ><img src="@/assets/images/logo-white.png" alt="logo" class="cursor-pointer"
        /></RouterLink>
      </div>
      <div class="flex items-center gap-4">
        <BellIcon class="relative cursor-pointer" />
        <div class="flex items-center">
          <div v-if="!getUserNameFromLS()" class="text-white mr-4">Admin</div>
          <div v-else class="text-white mr-4">{{ getUserNameFromLS() }}</div>
          <button
            class="text-white bg-primary-color rounded-xl h-10 w-20 justify-center items-center"
            @click="logout"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import BellIcon from '@/assets/svg/BellIcon.vue';
import { clearLS, getUserNameFromLS } from '/src/utils/ls.js';
import { useRouter } from 'vue-router';
import http from '@/api/http.js';

const router = useRouter();

const logout = async () => {
  try {
    await http.nodeInstance.post('auth/logout');
    clearLS();
    router.push('/');
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.header-container--logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.header-container--search--input:focus {
  border: none;
}

.header-container--search--input:focus-visible {
  outline: none;
}

button:hover {
  background-color: var(--primary-color-hover);
}
</style>
