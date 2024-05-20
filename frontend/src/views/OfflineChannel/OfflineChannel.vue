<template>
  <div class="container pt-6" @scroll="handleScroll">
    <div v-if="isFoundChannel === 'Found'" class="">
      <!-- Channel Left -->
      <div class="flex justify-between">
        <div class="flex">
          <div class="mr-3">
            <img :src="dataChannel.avatar_url" alt="avatar" class="h-14 w-14 rounded-full" />
          </div>
          <div class="mt-1">
            <div class="flex items-center">
              <div class="mr-2 font-medium">{{ dataChannel.username }}</div>
              <VerifiedBadge class="ml-1.5" v-if="dataChannel.is_verified" />
            </div>
            <div class="r text-sm mt-0.5">{{ dataChannel.follow_count }} followers</div>
          </div>
        </div>
        <!-- Channel right -->
        <div class="flex items-center" v-if="!isChannelUser">
          <div class="flex items-center cursor-pointer" @click="toggleFollowChannel">
            <NotFollowingIcon v-if="!followChannelStore.isFollowing" />
            <FollowingIcon v-if="followChannelStore.isFollowing" />
            <div class="font-bold text-primary-color ml-3 mr-2" v-if="!followChannelStore.isFollowing">Follow</div>
            <div class="font-bold text-primary-color ml-3 mr-2" v-if="followChannelStore.isFollowing">Following</div>
          </div>
          <div class="channel__option relative cursor-pointer">
            <MoreButton />
            <div
              class="channel__option--report bg-primary-white-color hover:bg-tag-background-hover absolute p-3 rounded-lg text-sm right-0"
              @click="handleReportChannel"
            >
              Report <span class="font-semibold ml-1">{{ dataChannel.username }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- About -->
      <div class="channel__nav mt-4">
        <div class="text-primary-color font-bold flex cursor-pointer">
          <div
            class="mr-6 inline"
            :class="{
              relative: ComponentActive === 'About',
              channel__about: ComponentActive === 'About',
            }"
            @click="handleActiveAbout"
          >
            About
          </div>
          <div
            class="inline"
            :class="{
              relative: ComponentActive === 'Videos',
              channel__about: ComponentActive === 'Videos',
            }"
            @click="handleActiveVideos"
          >
            Videos
          </div>
        </div>
        <div class="line--gray mt-4"></div>
        <div class="mt-5 font-bold" v-if="ComponentActive === 'About'">
          <div class="text-2xl">{{ dataChannel.username }} is following</div>
          <div class="grid grid-cols-4 mt-16">
            <div
              class="cursor-pointer mb-12"
              v-for="item in listChannelFollow"
              :key="item.id"
              @click="handleChangeChannel(item.id)"
            >
              <ChannelItem :item="item" />
            </div>
          </div>
        </div>
        <div class="mt-5" v-if="ComponentActive === 'Videos'">
          <span class="font-bold text-2xl"> Videos of {{ dataChannel.username }}</span>
          <VideoChannel class="mt-5" :idChannel="props.userId" />
        </div>
        <ReportModal v-if="storeReport.stepShow === 1" :token="token" :browseId="browseId" />
        <ReportSuccess v-if="storeReport.stepShow === 2" />
      </div>
    </div>
    <NotFoundChannel v-if="isFoundChannel === 'NotFound'" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ref, defineProps, watch } from 'vue';
import VideoChannel from './VideoChannel.vue';
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue';
import MoreButton from '@/components/UI/MoreButton.vue';
import FollowingIcon from '@/components/UI/FollowingIcon.vue';
import NotFollowingIcon from '@/components/UI/NotFollowingIcon.vue';
import ReportModal from '@/views/OfflineChannel/ReportModal.vue';
import ChannelItem from '@/views/OfflineChannel/ChannelItem.vue';
import ReportSuccess from '@/views/OfflineChannel/ReportSuccess.vue';
import { getAccessTokenFromLS, getBrowseIdLS, getClientIdFromLS } from '@/utils/auth.js';
import { useReportUser } from '@/stores/reportuser';
import http from '@/utils/http';
import NotFoundChannel from '@/components/Suspended/NotFoundChannel.vue';
import { useFollowChannelStore } from '@/stores/followChannel.js';
import { useAuthStore } from '@/stores/auth.js';

const isFoundChannel = ref('');
const props = defineProps({
  userId: String,
});
const router = useRouter();
const storeReport = useReportUser();
const token = getAccessTokenFromLS();
const browseId = getBrowseIdLS();
const dataChannel = ref([]);
const listChannelFollow = ref([]);
const followChannelStore = useFollowChannelStore();
const storeAuth = useAuthStore();
const ComponentActive = ref('About');
const isChannelUser = ref(false);
const clientId = getClientIdFromLS();
const pageNum = ref(1);

const toggleFollowChannel = async () => {
  if (token) {
    try {
      followChannelStore.isFollowing = !followChannelStore.isFollowing;
      await http.nodeInstance.post(`/follow/follow-user/${props.userId}`);
    } catch (error) {
      console.log(error);
    } finally {
      getDataChannel();
    }
    // Update follower list
    followChannelStore.idUser = props.userId;
    followChannelStore.reloadFollower(1);
    followChannelStore.dataFollowers = 1;
    followChannelStore.pageFollowed = 1;
    followChannelStore.isRender = true;
  } else {
    storeAuth.showStep = 1;
  }
};

const checkIsUserFollowChannel = async () => {
  if (token) {
    const response = await http.nodeInstance.get(`/follow/follow-user/${props.userId}`);
    followChannelStore.isFollowing = response.data.metadata;
  }
};

const getDataChannel = async () => {
  if (props.userId === clientId) isChannelUser.value = true;
  else isChannelUser.value = false;
  try {
    const response = await http.nodeInstance.get(
      `/user/general-info/${props.userId}?page=${pageNum.value}`,
    );
    dataChannel.value = response.data.metadata.user;
    listChannelFollow.value = response.data.metadata.data;
    isFoundChannel.value = 'Found';
  } catch {
    isFoundChannel.value = 'NotFound';
  }
};

const handleActiveAbout = () => {
  ComponentActive.value = 'About';
};

const handleActiveVideos = () => {
  ComponentActive.value = 'Videos';
};

watch(
  () => props.userId,
  (newId) => {
    getDataChannel();
    storeReport.idChannelReport = newId;
    checkIsUserFollowChannel();
  },
);

const handleChangeChannel = (userId) => {
  router.push({
    name: 'channel',
    params: { userId: userId },
  });
};

const handleReportChannel = () => {
  if (token) {
    storeReport.stepShow = 1;
    storeReport.idChannelReported = props.userId;
  } else {
    storeAuth.showStep = 1;
  }
};

const getMoreDataChannel = async () => {
  pageNum.value++;
  const res = await http.nodeInstance.get(
    `/user/general-info/${props.userId}?page=${pageNum.value}`,
  );
  const newData = res.data.metadata.data;
  if (newData.length > 0) {
    listChannelFollow.value = [...listChannelFollow.value, ...newData];
  } else {
    window.removeEventListener('scroll', handleScroll);
  }
};

const handleScroll = () => {
  if (isFoundChannel.value === 'Found' && ComponentActive.value === 'About') {
    const bottomOfWindow =
      document.documentElement.scrollHeight - window.innerHeight === window.scrollY;
    if (bottomOfWindow) {
      getMoreDataChannel();
    }
  }
};

onMounted(() => {
  getDataChannel();
  checkIsUserFollowChannel();
  window.addEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.line--gray {
  width: 100%;
  height: 1px;
  background-color: #ececec;
}

.channel__about:after {
  content: '';
  position: absolute;
  bottom: -16px;
  width: 100%;
  height: 4px;
  background-color: rgb(19 208 180 / var(--tw-text-opacity));
  left: 0;
  transition: 0.5s all;
}

.verified--defined {
  top: 24px;
  box-shadow: 0px 0px 5px 1px var(--secondary-text-color);
  position: absolute;
  width: 380px;
  background-color: var(--primary-white-color);
  display: none;
}

.verified:hover .verified--defined {
  display: block;
}

.channel__option--report {
  cursor: pointer;
  box-shadow: 0px 0px 5px 1px var(--secondary-text-color);
  display: none;
}

.channel__option:hover .channel__option--report {
  display: flex;
}
</style>
