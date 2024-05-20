<script setup>
import BlackBar from '../../components/UI/BlackBar.vue';
import { ref } from 'vue';
import VideoCard from '@/components/video-components/VideoCard.vue';
import DotsLoading from '@/components/UI/DotsLoading.vue';
import useSimpleLoadMore from '@/utils/useSimpleLoadMore.js';
import { useLeftPanelStore } from '@/stores/leftPanel.js';
import { getVideosYouMayLike } from '@/apis/videos.api';

const LeftPanelStore = useLeftPanelStore();

const videos = ref([]);

const loadMoreElement = ref(null);

const LoadMoreIsShowing = ref(true);

useSimpleLoadMore(loadMoreElement, LoadMoreIsShowing, videos, getVideosYouMayLike);
</script>

<template>
  <BlackBar class="my-8" />
  <section id="videos-you-may-like">
    <h2 class="title mb-4">Videos you may like</h2>
    <div
      class="videoContainer grid gap-6 mb-8"
      :class="LeftPanelStore.isOpenSidebar ? 'grid-cols-3' : 'grid-cols-4'"
    >
      <VideoCard v-for="video in videos" :key="video.id" :video="video" />
    </div>
    <div class="loadMoreDiv flex justify-center pb-4 pt-6">
      <DotsLoading ref="loadMoreElement" class="loadMoreElement" v-if="LoadMoreIsShowing" />
    </div>
  </section>
</template>

<style scoped></style>
