<template>
  <header class="z-999 bg-black fixed w-full top-0">
    <div class="flex items-center px-10 py-0 justify-between h-14 relative">
      <div class="flex items-center gap-10 h-full">
        <RouterLink
          :to="{ name: 'browse' }"
          class="flex items-center h-full relative font-bold text-xl text-primary-white-color cursor-pointer hover:opacity-70"
        >
          Browse
        </RouterLink>
        <button class="FAQ-btn cursor-pointer p-[6px] rounded-lg" @click="toggle">
          <img src="@/assets/images/menu-icon.svg" alt="icon" class="w-8 h-8" />
        </button>
        <Menu
          ref="menu"
          id="overlay_menu"
          :model="items"
          :popup="true"
          class="py-3"
          :style="{ top: '56px', color: 'black', position: 'fixed' }"
        ></Menu>
      </div>
      <div class="header-container--logo">
        <RouterLink :to="{ name: 'home' }">
          <img src="@/assets/images/logo-white.png" alt="logo" class="cursor-pointer" />
        </RouterLink>
      </div>

      <div class="relative flex items-center gap-4 z-20">
        <!-- Search-->
        <div class="flex items-center h-9 relative left-6">
          <input
            type="text"
            v-model="search"
            placeholder="Search"
            class="header-container--search--input w-[290px] h-full p-3 rounded-l-md"
            @keyup.enter="handleSearchResult"
          />
          <button
            @click="handleSearchResult"
            class="p-2.5 w-10 h-full header-container--search--button bg-primary-color rounded-r-lg"
          >
            <img src="@/assets/images/search-icon.svg" alt="logo" class="pb-2" />
          </button>
          <button
            @click="startVoiceSearch"
            class="p-2 w-10 h-full bg-primary-color relative right-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-white font-semibold"
            >
              <path
                strokeLinecap="round"
                stroke-linejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
          </button>
          <Dialog v-model:visible="visible" modal :style="{ width: '30rem', padding: '16px' }">
            <button @click="closeDialog" class="button--close absolute top-3 right-4">
              <img src="@/assets/images/closebutton.png" alt="" />
            </button>
            <h2 class="text-[20px] font-medium mt-10">Please say something....</h2>
            <div
              style="animation: pulse 1s infinite"
              class="w-[68px] h-[68px] rounded-[50%] mt-20 mx-auto bg-red-600 flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-10 h-10 text-white font-semibold"
              >
                <path
                  strokeLinecap="round"
                  stroke-linejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            </div>
          </Dialog>
          <!-- Search Instant  -->
          <transition name="popup-search-transition">
            <div v-if="showPopupSearch">
              <SearchInstant />
            </div>
          </transition>
        </div>

        <!-- Notifications  -->
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
        <button
          v-else
          class="bg-primary-color text-primary-white-color px-6 py-1.5 rounded-md font-bold text-base"
          @click="onPopupLogin"
        >
          Log In
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
//onMounted
import NotiAccount from './NotiAccount.vue';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { vOnClickOutside } from '@vueuse/components';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Menu from 'primevue/menu';
import PopupAccount from '@/components/Header/PopupAccount.vue';
import SearchInstant from './SearchInstant.vue';
import { useSearchStore } from '../../stores/search.js';
import { useProfileStore } from '../../stores/profile.js';
import {
  setUserInformationToLs,
  getUserInformationFromLS,
  getAccessTokenFromLS,
} from '../../utils/auth.js';
import Dialog from 'primevue/dialog';

const searchStore = useSearchStore();
const { search, showPopupSearch, noResult } = storeToRefs(searchStore);
let searchTimeout;
const visible = ref(false);
const token = getAccessTokenFromLS();

//Handle Search Value Change
watch(search, (newValue) => {
  clearTimeout(searchTimeout);
  if (newValue.trim() !== '') {
    showPopupSearch.value = true;
    searchTimeout = setTimeout(() => {
      searchStore.getSearchInstantApi();
    }, 500);
  } else {
    showPopupSearch.value = false;
  }
});

// Handle Header Component
const authStore = useAuthStore();
const onPopupLogin = () => {
  authStore.setShowComponent(true);
  authStore.setStep(1);
};

// Handle Search Result
const handleSearchResult = () => {
  // eslint-disable-next-line no-useless-escape
  const specialCharacters = /[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharacters.test(search.value)) {
    noResult.value = true;
    searchStore.titleSearchResult = searchStore.search;
    router.push('/search');
    return;
  } else if (search?.value?.length > 0 && search?.value?.trim()) {
    searchStore.getSearchResultApi();
    searchStore.titleSearchResult = searchStore.search;
    router.push('/search');
  }
};

// Search microphone
// eslint-disable-next-line no-undef
const recognition = new webkitSpeechRecognition();
const startVoiceSearch = () => {
  visible.value = true;
  recognition.lang = 'en-US';

  recognition.onend = () => {
    visible.value = false;
  };

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    search.value = speechToText.replace(/\.$/, '');
    handleSearchResult();
  };
  recognition.start();
};

const closeDialog = () => {
  visible.value = false;
  stopVoiceRecognition();
};

const stopVoiceRecognition = () => {
  if (typeof recognition !== 'undefined') {
    recognition.abort();
    visible.value = false;
  }
};

const router = useRouter();
const menu = ref();
const items = ref([
  {
    label: 'FAQ',
    command: () => {
      router.push('/faq');
    },
  },
  {
    label: 'Community guideline',
    command: () => {
      router.push('/community-guidelines');
    },
  },
]);
const showPopupAccount = ref(false);
const profileStore = useProfileStore();
const avatarUrl = ref(getUserInformationFromLS().avatar_url);

const toggle = (event) => {
  menu.value.toggle(event);
};
const toggleShowPopupAccount = () => {
  showPopupAccount.value = true;
};
const closeModal = () => {
  setTimeout(() => {
    showPopupAccount.value = false;
  }, 0);
};
watch(
  () => authStore.statusChangeUserInfo,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      await profileStore.getProfile();
      setUserInformationToLs(profileStore.profileData);
      avatarUrl.value = profileStore.profileData.avatar_url;
      authStore.changeUserInfo(false);
    }
  },
);
const handleStorageChange = (event) => {
  if (event.key === 'access_token') {
    if (token !== getAccessTokenFromLS() && token !== '') {
      window.location.reload();
    }
  }
};
onMounted(() => {
  window.addEventListener('storage', handleStorageChange);
});

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});

onMounted(async () => {
  if (authStore.loggedIn) {
    await profileStore.getProfile();
    setUserInformationToLs(profileStore.profileData);
    avatarUrl.value = profileStore.profileData.avatar_url;
  }
});
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

.FAQ-btn:hover {
  padding: 4px;
  border: solid var(--primary-white-color) 2px;
  background: none;
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

.router-link-exact-active {
  border-top: 4px solid transparent;
  border-bottom: 4px solid var(--primary-color-green);
  opacity: 1 !important;
}
</style>
