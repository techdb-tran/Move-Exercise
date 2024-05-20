<template>
  <header class="z-999 bg-black fixed w-full top-0">
    <div class="flex items-center px-10 py-0 justify-between h-14 relative">
      <div class="flex items-center gap-10 h-full">
        <div
          class="flex items-center h-full relative font-bold text-xl text-primary-white-color cursor-pointer"
        >
          Dashboard
        </div>
      </div>
      <div class="header-container--logo">
        <RouterLink :to="{ name: 'home' }">
          <img src="@/assets/images/logo-white.png" alt="logo" class="cursor-pointer" />
        </RouterLink>
      </div>
      <div class="flex items-center gap-4">
        <button
          @click="openUpload"
          class="bg-primary-color text-primary-white-color px-5 py-2 rounded-md font-bold text-xs flex items-center gap-2 justify-center"
        >
          <div v-show="uploadVideo.isLoading" class="relative flex items-center">
            <ProgressSpinner
              style="width: 25px; height: 25px"
              strokeWidth="10"
              animationDuration="1s"
              aria-label="Custom ProgressSpinner"
            />
            <span class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">{{ uploadVideo.countNumberUpload }}</span>
          </div>
          <span class="text-base">Upload a video</span>
        </button>
        <NotiAccount v-if="authStore.loggedIn" />
        <div v-if="authStore.loggedIn" class="relative">
          <img
            class="object-cover w-10 h-10 cursor-pointer rounded-full"
            :src="avatarUrl"
            alt="Avatar user"
            @click="toggleShowPopupAccount"
          />
          <div class="absolute top-14 right-0 z-999">
            <Transition name="popup">
              <div v-if="showPopupAccount" v-on-click-outside="closeModal">
                <PopupAccount v-on:turnOffPopupAccount="closeModal" />
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
    <UploadVideoComponent></UploadVideoComponent>
  </header>
</template>

<script setup>
import NotiAccount from './NotiAccount.vue';
import { useAuthStore } from '@/stores/auth.js';
import { getAvatarUrlFromLS } from '../../utils/auth.js';
import { ref, watch, onMounted } from 'vue';
import { useProfileStore } from '../../stores/profile.js';
import { setAvatarUrlToLS } from '../../utils/auth.js';
import PopupAccount from '@/components/Header/PopupAccount.vue';
import { vOnClickOutside } from '@vueuse/components';
import UploadVideoComponent from '@/components/upload-video/UploadVideoComponent.vue';
import { useUploadVideoStore } from '@/stores/uploadVideo.js';
import ProgressSpinner from 'primevue/progressspinner';

const authStore = useAuthStore();
const avatarUrl = ref(getAvatarUrlFromLS());
const profileStore = useProfileStore();
const showPopupAccount = ref(false);

const toggleShowPopupAccount = () => {
  showPopupAccount.value = true;
};
const closeModal = () => {
  setTimeout(() => {
    showPopupAccount.value = false;
  }, 0);
};

watch(
  () => authStore.statusChangeAvatarUrl,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      await profileStore.getProfile();
      setAvatarUrlToLS(profileStore.profileData.avatar_url);
      avatarUrl.value = profileStore.profileData.avatar_url;
      authStore.changeAvatarUrl(false);
    }
  },
);
onMounted(async () => {
  if (authStore.loggedIn) {
    await profileStore.getProfile();
    setAvatarUrlToLS(profileStore.profileData.avatar_url);
    avatarUrl.value = profileStore.profileData.avatar_url;
  }
});

const uploadVideo = useUploadVideoStore();

const openUpload = () => {
  uploadVideo.isUploadVideo = true;
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
/* transition for popup account */
.popup-enter-active {
  transition: all 0.1s ease-in;
}
.popup-leave-active {
  transition: all 0.1s ease-out;
}
.popup-enter-from,
.popup-leave-to {
  transform: translateY(-2px);
  opacity: 0;
}

.popup-search-transition-enter-active,
.popup-search-transition-leave-active {
  transition: opacity 0.3s ease;
}
.popup-search-transition-enter-from,
.popup-search-transition-leave-to {
  opacity: 0;
}
/* transition for popup account */
</style>
