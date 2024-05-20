<template>
  <div v-if="!searchStore.noResult" class="mt-16 mr-32 px-10 font-sans mb-4 py-8">
    <BlackBar>Search results for {{ searchStore.titleSearchResult }}</BlackBar>

    <!-- Categories  -->
    <div class="mt-5">
      <h2 class="font-bold text-[16px]">Categories</h2>
      <div class="flex gap-10">
        <div
          v-for="category in searchStore?.searchResultData?.categories"
          :key="category?.id"
          class="flex gap-10 mt-3"
        >
          <div @click="() => categoryClickHandler(category?.id)" class="cursor-pointer">
            <img :src="category?.image_url" alt="" class="w-[180px] h-[260px] object-cover" />
            <h2 class="font-bold text-[17px] mt-2">{{ category?.name }}</h2>
            <p class="text-[13px]">{{ formatView(category?.count_views) }} views</p>
          </div>
        </div>
      </div>
      <!-- Separating strip -->
      <div class="h-[1px] w-full bg-[#CCCCCC] my-[22px]"></div>
    </div>

    <!-- Channels  -->
    <div>
      <h2 class="mb-[17px] font-bold grid grid-cols-2">Channels</h2>
      <div class="grid grid-cols-2">
        <div v-for="user in searchStore?.searchResultData?.users" :key="user?.users">
          <div
            @click="() => channelClickHandler(user?.id)"
            class="flex items-center gap-4 mb-5 cursor-pointer"
          >
            <img
              :src="user?.avatar_url"
              alt="avatar"
              class="w-[88px] h-[88px] object-cover rounded-[50%]"
            />
            <div>
              <div class="flex items-center gap-[6px]">
                <p class="text-[20px] font-medium">{{ user?.username }}</p>
                <div v-if="user?.count_follow > 0"><VerifiedBadge /></div>
              </div>
              <p class="text-[13px]">{{ user?.count_follow }} followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Separating strip -->
    <div class="h-[1px] w-full bg-[#CCCCCC] my-[20px]"></div>

    <!-- Videos  -->
    <div>
      <h2 class="mb-[17px] font-bold grid grid-cols-2">Videos</h2>
      <div class="grid grid-cols-3 gap-7">
        <VideoCard
          v-for="video in searchStore?.searchResultData?.videos"
          :key="video?.id"
          :video="video"
          @click="() => videoClickHandler(video?.id)"
        />
      </div>
    </div>
  </div>
  <div v-if="searchStore.noResult" class="mt-16 mr-32 px-10 font-sans mb-4 py-8">
    <BlackBar>No search results for {{ searchStore.titleSearchResult }}</BlackBar>
    <div class="mx-auto text-center mt-80">
      <h2 class="text-[16px] font-bold">No result found for {{ searchStore.titleSearchResult }}</h2>
      <p class="mt-2 text-[16px] font-light italic">
        Please try searching with a different keyword.
      </p>
    </div>
  </div>
</template>

<script setup>
import BlackBar from '../../components/UI/BlackBar.vue';
import VerifiedBadge from '../../components/UI/VerifiedBadge.vue';
import VideoCard from '../../components/video-components/VideoCard.vue';
import { useSearchStore } from '../../stores/search.js';
import { useRouter } from 'vue-router';
import formatView from '@/utils/formatView';

const router = useRouter();
const searchStore = useSearchStore();

// Handle Video Click
const videoClickHandler = (video) => {
  router.push({ name: 'video', params: { videoId: video } });
};

// Handle category Click
const categoryClickHandler = (category) => {
  router.push({ name: 'category', params: { categoryId: category } });
};

// Handle channels click
const channelClickHandler = (channel) => {
  router.push({ name: 'channel', params: { userId: channel } });
};
</script>

<style scoped></style>
