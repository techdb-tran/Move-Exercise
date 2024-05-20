<template>
  <div class="PopupAccount">
    <div class="bg-white w-[260px] h-[230px] rounded-lg box-shadow inline-block">
      <div class="m-4">
        <button class="h-[50px] w-[228px] flex items-center">
          <img class="w-11 h-11 rounded-full mr-2" v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
          <img
            class="w-11 h-11 rounded-full mr-2"
            v-else
            src="../../assets/images/image-user.jpg"
            alt="avatar"
          />
          <div class="font-bold text-black text-[17px] leading-[22px] mr-3 short-account-name">
            {{ fullName ? fullName : email }}
          </div>
          <VerifiedBadgeIcon v-if="verified" class="w-4 h-4" />
        </button>

        <div class="border-[1px] mt-2"></div>
        <RouterLink
          v-if="displayComponentRouter"
          to="/streamer"
          class="flex items-center h-[50px] w-[228px] cursor-pointer hover:text-primary-color"
        >
          <DashboardIcon />
          <div class="ml-3">Dashboard</div>
        </RouterLink>
        <RouterLink
          to="/"
          v-if="!displayComponentRouter"
          class="flex items-center h-[50px] w-[228px] cursor-pointer hover:text-primary-color"
        >
          <BackToMove />
          <div class="ml-3">Back to Move</div>
        </RouterLink>
        <div class="border-[1px]"></div>
        <RouterLink
          to="/profile"
          @click="$emit('turnOffPopupAccount')"
          class="flex items-center h-[50px] w-[228px] cursor-pointer hover:text-primary-color"
        >
          <SettingsIcon />
          <div class="ml-3">Settings</div>
        </RouterLink>
        <div class="border-[1px]"></div>
        <button
          @click="authStore.logout(), $emit('turnOffPopupAccount')"
          class="flex items-center h-[50px] w-[228px] cursor-pointer hover:text-primary-color"
        >
          <LogoutIcon />
          <div class="ml-3">Log out</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import LogoutIcon from '../../assets/images/LogoutIcon.vue';
import SettingsIcon from '../../assets/images/SettingsIcon.vue';
import DashboardIcon from '../../assets/images/DashboardIcon.vue';
import VerifiedBadgeIcon from '@/assets/images/VerifiedBadgeIcon.vue';
import BackToMove from '/src/assets/svg/BackToMove.vue';
import { useAuthStore } from '@/stores/auth.js';
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { watchEffect } from 'vue';
import { getUserInformationFromLS } from '@/utils/auth.js';

const authStore = useAuthStore();
const avatarUrl = ref('');
const fullName = ref('');
const email = ref('');
const verified = ref();
const displayComponentRouter = ref(true);
const currentRoute = useRoute();

const updateComponent = (route) => {
  if (route.path.includes('/streamer')) {
    displayComponentRouter.value = false;
  } else {
    displayComponentRouter.value = true;
  }
};

watchEffect(() => {
  updateComponent(currentRoute);
});

onMounted(() => {
  const informationUser = getUserInformationFromLS();
  avatarUrl.value = informationUser.avatar_url;
  fullName.value = informationUser.username;
  email.value = informationUser.email;
  verified.value = informationUser.is_verified;
});
</script>

<style scoped>
.box-shadow {
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.3);
}
.short-account-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
