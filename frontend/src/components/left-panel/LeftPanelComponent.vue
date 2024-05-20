<template>
  <div
    class="w-60 fixed h-full mt-14 pb-12 border-2 border-solid border-r-zinc-300 sidebar top-0 bg-primary-white-color overflow-scroll"
    :class="isOpenSidebar ? 'w-60' : 'w-[60px]'"
    ref="sidebarElm"
  >
    <div
      ref="sidebarContainer"
      class="p-4 duration-500"
      :class="isOpenSidebar ? 'py-4 pl-4 pr-3' : 'pt-4 pr-px pb-px pl-px'"
    >
      <div
        ref="sidebarHeader"
        class="flex items-center justify-between mb-4 fixed top-14 left-0 duration-500 overflow-hidden bg-primary-white-color py-[10px] pl-5 pr-0 w-56"
        :class="isOpenSidebar ? 'w-56' : 'w-[52px]'"
      >
        <h4 class="font-bold text-xs text-nowrap h-8 flex items-center" v-show="isOpenSidebar">
          FOLLOWED CHANNELS
        </h4>
        <img
          src="@/assets/images/right-arrow-icon.svg"
          alt="icon"
          v-if="authStore.loggedIn"
          v-show="isOpenSidebar"
          class="cursor-pointer close-sidebar--btn"
          @click="closeSidebar()"
        />
        <img
          src="@/assets/images/expand-icon.svg"
          alt="icon"
          v-if="authStore.loggedIn"
          v-show="!isOpenSidebar"
          class="cursor-pointer open-sidebar--btn"
          @click="openSidebar()"
        />
      </div>
      <div v-if="authStore.loggedIn" class="flex flex-col gap-4 mt-9">
        <div
          v-for="data in followChannelStore.saveDataFollowed"
          :key="data.id"
          :id="data.id"
          class="flex rounded-3xl group cursor-pointer"
          :class="
            isOpenSidebar ? 'hover:bg-tag-background-hover justify-between' : 'justify-center'
          "
          @click="handleVisitAnotherChannel(data.id)"
          ref="followers"
        >
          <div class="flex gap-1">
            <div class="flex gap-2">
              <div class="w-10 h-10">
                <img
                  v-tooltip.right="data.username"
                  :src="data.avatar_url"
                  class="min-w-10 min-h-10 max-w-10 max-h-10 rounded-full object-cover"
                  :class="isOpenSidebar ? '' : 'hover:opacity-70'"
                />
              </div>
              <div class="flex flex-col justify-center mf-4 overflow-hidden" v-show="isOpenSidebar">
                <div class="flex gap-2 items-center w-32">
                  <span class="text-sm text-nowrap text-ellipsis overflow-hidden">{{
                    data.username
                  }}</span>
                  <img
                    src="@/assets/images/verified-badge-icon.svg"
                    alt="icon"
                    v-if="data.is_verified"
                    class="pr-1"
                  />
                </div>
                <div
                  class="text-xs text-primary-text-color overflow-hidden flex gap-2 items-center"
                >
                  <div
                    class="w-1.5 h-1.5 bg-primary-color rounded-3xl"
                    v-show="data.videoInfo?.newVideosCount"
                  ></div>
                  <span class="text-nowrap">{{
                    data.videoInfo?.newVideosCount !== 0
                      ? data.videoInfo?.newVideosCount === 1
                        ? data.videoInfo?.newVideosCount + ' new video'
                        : data.videoInfo?.newVideosCount + ' new videos'
                      : data.videoInfo?.totalVideosCount + ' videos'
                  }}</span>
                </div>
              </div>
            </div>
            <div
              v-show="isOpenSidebar"
              class="flex justify-end items-center hidden group-hover:flex"
            >
              <i
                class="pi pi-ellipsis-v cursor-pointer"
                style="font-size: 1rem"
                @click="toggle($event, data.id)"
              ></i>
            </div>
          </div>
        </div>
        <ProgressSpinner
          style="width: 30px; height: 30px"
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
          v-show="followChannelStore.isLoadingFollowers"
          aria-label="Custom ProgressSpinner"
        />

        <div v-if="followChannelStore.isShowBrowse">
          <div class="text-xs overflow-hidden" v-show="isOpenSidebar">
            <div class="text-nowrap">You have not followed any</div>
            <div class="text-nowrap">instructors yet.</div>
          </div>
          <RouterLink :to="{ name: 'browse' }">
            <button
              class="bg-primary-color text-primary-white-color py-2 rounded-md font-semibold mt-2"
              :class="isOpenSidebar ? 'px-5' : 'w-full px-1'"
            >
              <span v-if="isOpenSidebar"> Browse </span>
              <i v-else class="pi pi-user-plus" style="font-size: 1rem"></i>
            </button>
          </RouterLink>
        </div>
      </div>
      <div class="bg-primary-color rounded-md mt-9" v-else>
        <div class="p-4">
          <h1 class="text-primary-white-color font-extrabold text-xl mb-1">
            Interested in getting fit?
          </h1>
          <p class="mb-3">Sign up now to follow your favorite instructor!</p>
          <button
            class="bg-primary-white-color text-primary-color px-5 py-2 rounded-md font-semibold sidebar-container--signup-btn"
            @click="onPopupLogin"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  </div>
  <OverlayPanel ref="openMenu">
    <div
      class="text-primary-color hover:bg-tag-background cursor-pointer rounded flex gap-2 items-center px-2"
      @click="toggleFollowChannel(leftPanelStore.idUser)"
    >
      <i class="pi pi-heart-fill"></i>
      <span class="font-semibold">Following</span>
    </div>
  </OverlayPanel>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useLeftPanelStore } from '@/stores/leftPanel.js';
import ProgressSpinner from 'primevue/progressspinner';
import { useRouter } from 'vue-router';
import { useFollowChannelStore } from '@/stores/followChannel.js';
import OverlayPanel from 'primevue/overlaypanel';
import http from '@/utils/http';

const router = useRouter();
const authStore = useAuthStore();
const sidebarElm = ref(null);
const isOpenSidebar = ref(true);
const leftPanelStore = useLeftPanelStore();
const sidebarContainer = ref(null);
const sidebarHeader = ref(null);
const followers = ref(null);
const followChannelStore = useFollowChannelStore();
const openMenu = ref();

const onPopupLogin = () => {
  authStore.setShowComponent(false);
  authStore.setStep(1);
};

// Function to open the sidebar
function openSidebar() {
  sidebarHeader.value.style.justifyContent = 'space-between';
  sidebarHeader.value.style.padding = '10px 0 10px 20px';
  isOpenSidebar.value = true;
  leftPanelStore.isOpenSidebar = true;
}

// Function to close the sidebar
function closeSidebar() {
  sidebarHeader.value.style.justifyContent = 'center';
  sidebarHeader.value.style.padding = '10px 0 10px 10px';
  isOpenSidebar.value = false;
  leftPanelStore.isOpenSidebar = false;
}

// Go to detail channel
const handleVisitAnotherChannel = (userId) => {
  router.push({
    name: 'channel',
    params: {
      userId: userId,
    },
  });
};

//Open Menu
const toggle = (event, id) => {
  openMenu.value.toggle(event);
  leftPanelStore.idUser = id;
  event.stopPropagation();
};

//Unfollow
const toggleFollowChannel = async () => {
  openMenu.value.hide();
  try {
    followChannelStore.isFollowing = !followChannelStore.isFollowing;
    await http.nodeInstance.post(`/follow/follow-user/${leftPanelStore.idUser}`);
  } catch (error) {
    console.log(error);
  }
  // Update follower list
  followChannelStore.idUser = leftPanelStore.idUser;
  followChannelStore.reloadFollower(1);
  followChannelStore.dataFollowers = 1;
  followChannelStore.pageFollowed = 1;
  followChannelStore.isRender = true;
};

onMounted(() => {
  followChannelStore.pageFollowed = 1
  if (authStore.loggedIn) {
    followChannelStore.saveDataFollowed = [];
    followChannelStore.getFollowData(followChannelStore.pageFollowed);
  }
  sidebarElm.value.addEventListener('scroll', () => {
    if (followChannelStore.isRender === true) {
      if (
        sidebarElm.value.scrollTop + sidebarElm.value.clientHeight >=
        sidebarContainer.value.offsetHeight
      ) {
        loadMoreContent();
        followChannelStore.isRender = false;
      }
    }
  });

  //Load more when scroll left panel
  function loadMoreContent() {
    if (followChannelStore.pageFollowed < followChannelStore.dataFollowers) {
      followChannelStore.getFollowData(++followChannelStore.pageFollowed);
    }
  }
});
</script>

<style scoped>
.sidebar {
  transition: 0.5s;
  z-index: 999;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 9px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 9px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

button:hover {
  background-color: var(--primary-color-hover);
}

.sidebar-container--signup-btn:hover {
  color: black;
  background-color: var(--primary-white-color);
}
</style>
