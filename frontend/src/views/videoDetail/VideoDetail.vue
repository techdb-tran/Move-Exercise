<script setup>
import { useReportUser } from '@/stores/reportuser';
import ReportSuccess from '../OfflineChannel/ReportSuccess.vue';
import ReportModal from '../OfflineChannel/ReportModal.vue';
import { onMounted, ref, watch } from 'vue';
import VideoPlayer from '../../components/video-components/VideoPlayer.vue';
import { toast } from 'vue3-toastify';
import StarRating from '@/components/UI/StarRating.vue';
import formatView from '@/utils/formatView';
import Tag from '@/components/UI/Tag.vue';
import NotFollowingIcon from '@/components/UI/NotFollowingIcon.vue';
import StarRateVideoIcon from '@/components/UI/StarRateVideoIcon.vue';
import FollowingIcon from '@/components/UI/FollowingIcon.vue';
// import Avatar from 'primevue/avatar';
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue';
import WatchAlso from '@/views/videoDetail/WatchAlso.vue';
import Comment from '../comments/Comment.vue';
import Rating from 'primevue/rating';
import { onClickOutside } from '@vueuse/core';
import CloseButton from '@/assets/svg/CloseButton.vue';
import GreenStarIcon from '@/components/UI/GreenStarIcon.vue';
import { getVideoDetail, putRateVideo } from '@/apis/videos.api';
import { postFollowUser } from '@/apis/users.api';
import { useFollowChannelStore } from '@/stores/followChannel.js';
import { getClientIdFromLS } from '@/utils/auth';
import { useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '/src/stores/auth.js';
import SpinningLoader from '@/components/UI/SpinningLoader.vue';

const storeReport = useReportUser();
const authStore = useAuthStore();
const followChannelStore = useFollowChannelStore();
const route = useRoute();
const videoId = route.params.videoId;
const comment = ref();
const currentUserId = Number(getClientIdFromLS());
const video = ref(null);
let doneFetching = false;
const ratingLoading = ref(false);
const ratingPanel = ref(null);
const ratePanelVisible = ref(false);
const rating = ref(null);

// clicked outside rating panel = close panel
onClickOutside(ratingPanel, () => (ratePanelVisible.value = false));

// Get video detail on mounted
onMounted(async () => {
  try {
    const response = await getVideoDetail(videoId);
    video.value = response.data.data;
    followChannelStore.isFollowing = video.value.additional.is_follower;

    // Find userId to find user rating in video rating array, if userId is found, update current rating
    if (currentUserId) {
      const foundUserRating = video.value.rate.find((rate) => rate.user_id === currentUserId);

      if (foundUserRating) {
        rating.value = foundUserRating?.rate;
      }
    }
  } catch (error) {
    if (error.response.status === 422) {
      toast.error(`Video is unavailable, please watch other videos`);
    } else {
      toast.error(`Error loading video: ${error.message}`);
    }
  } finally {
    setTimeout(() => {
      doneFetching = true;
    }, 500);
  }
  // setTimeout(() => {
  //   if (route.query.cmt && comment.value) {
  //     comment.value.$el.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, 2000);
});

// Handle click follow
const followHandler = async (userId) => {
  if (!currentUserId) {
    authStore.setStep(1);
    authStore.setShowComponent(true);
  } else {
    try {
      await postFollowUser(userId);
      // Update follower list
      followChannelStore.isFollowing = !followChannelStore.isFollowing;
      followChannelStore.idUser = userId;
      followChannelStore.reloadFollower(1);
      followChannelStore.dataFollowers = 1;
      followChannelStore.pageFollowed = 1;
      followChannelStore.isRender = true;

      // Update uploader followers on screen
      const response = await getVideoDetail(videoId);
      video.value.user.total_follower = response.data.data.user.total_follower;
    } catch (error) {
      toast.error(`Error following channel: ${error.message}`);
    }
  }
};

// handle click "rate video" button
const rateBtnHandler = () => {
  if (!currentUserId) {
    authStore.setStep(1);
    authStore.setShowComponent(true);
  } else {
    ratePanelVisible.value = true;
  }
};

// update views number when a view is counted
const updateViewCount = async () => {
  const response = await getVideoDetail(videoId);
  video.value.view_count = response.data.data.view_count;
};

// If rating changes, then call API to update rating
watch(rating, async () => {
  // Call API to rate video
  if (!doneFetching) return;
  try {
    ratingLoading.value = true;
    await putRateVideo(videoId, rating.value);

    // Update Video Rating on screen
    const response = await getVideoDetail(videoId);
    video.value.rate_avg = response.data.data.rate_avg;
  } catch (error) {
    toast.error(`Error rating video: ${error.message}`);
  } finally {
    ratingLoading.value = false;
  }
});
</script>

<template>
  <div class="mt-14 flex">
    <section class="midContainer w-full" v-if="video">
      <VideoPlayer :video="video" @viewCounted="updateViewCount" />

      <div class="m-4">
        <!-- Title div -->
        <div class="flex justify-between pb-3 gap-4">
          <h1 class="text-xl font-semibold line-clamp-2">{{ video.title }}</h1>
          <StarRating class="scale-125">{{ Math.round(video.rate_avg * 10) / 10 }}</StarRating>
        </div>

        <!-- View count div -->
        <div class="text-sm font-medium pb-3">
          <span class="text-misc-orange-color">{{ formatView(video.view_count) }} views</span>
          <span>&nbsp;<b> &#183; </b>&nbsp;</span>
          <span class="text-primary-color">{{ video.category.name }}</span>
        </div>

        <!-- Tag/follow/rate div -->
        <div class="flex justify-between border-b-2 border-b-border-color pb-4">
          <div class="flex gap-2">
            <Tag>{{ video.level }}</Tag>
            <Tag>{{ video.duration }}</Tag>
          </div>
          <div
            ref="followRateDiv"
            class="text-sm font-bold text-primary-color flex gap-6 relative items-center"
          >
            <button
              @click="followHandler(video.user.id)"
              v-if="video.user.id !== currentUserId"
              class="hover:opacity-70"
            >
              <span class="flex items-center gap-2" v-if="!followChannelStore.isFollowing">
                <NotFollowingIcon /> FOLLOW
              </span>
              <span class="flex items-center gap-2" v-if="followChannelStore.isFollowing">
                <FollowingIcon /> FOLLOWING
              </span>
            </button>

            <button @click="rateBtnHandler" class="hover:opacity-70">
              <span class="flex items-center gap-2" v-if="!rating">
                <StarRateVideoIcon class="fill-none" /> RATE VIDEO
              </span>
              <span class="flex items-center gap-2" v-if="rating">
                <StarRateVideoIcon class="fill-primary-color" /> VIDEO RATED
              </span>
            </button>

            <div
              class="ratePopup absolute right-0 bottom-10 bg-primary-white-color p-4 rounded-lg shadow-lg w-[22rem]"
              v-show="ratePanelVisible"
              ref="ratingPanel"
            >
              <p class="text-base text-primary-black-color pb-1">Rate the video</p>
              <p class="paragraph font-normal pb-8">
                Tell us what do you think about this session.
              </p>
              <Rating v-model="rating" :cancel="false" v-if="!ratingLoading">
                <template #officon>
                  <GreenStarIcon class="fill-none" />
                </template>
                <template #onicon>
                  <GreenStarIcon class="fill-primary-color" />
                </template>
              </Rating>
              <div v-if="ratingLoading" class="h-[22px] flex justify-start gap-1">
                <SpinningLoader class="w-[22px] h-[22px]" />LOADING
              </div>
              <button class="absolute right-3 top-3 p-1" @click="ratePanelVisible = false">
                <CloseButton />
              </button>
            </div>
          </div>
        </div>

        <!-- Poster div -->
        <div class="my-4 flex gap-4 border-b-2 border-b-border-color pb-4">
          <RouterLink
            :to="{ name: 'channel', params: { userId: video.user.id } }"
            class="avatarContainer rounded-full w-14 h-14 overflow-clip cursor-pointer hover:opacity-80"
          >
            <img
              :src="video.user.avatar_url"
              :alt="video.user.fullname"
              class="rounded-full min-h-full"
            />
          </RouterLink>
          <div>
            <RouterLink
              :to="{ name: 'channel', params: { userId: video.user.id } }"
              class="font-medium flex items-center gap-3 hover:underline cursor-pointer"
              >{{ video.user.username }} <VerifiedBadge v-if="video.user.is_verified"
            /></RouterLink>
            <p class="paragraph">{{ video.user.total_follower }} followers</p>
          </div>
        </div>
      </div>
      <Comment :video="video" ref="comment" />
    </section>
    <WatchAlso :videoId="videoId" v-if="video" />
  </div>
</template>

<style scoped>
:deep(.p-rating) {
  gap: 0.3rem;
}
</style>
