<script setup>
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import VideoCard from '@/components/video-components/VideoCard.vue';
// import { getWatchAlsoVideos } from '@/apis/videos.api';
import { getWatchAlsoVideos } from '@/apis/videos.api';

const watchAlsoVideos = ref([]);

const props = defineProps({
  videoId: String,
});

onMounted(async () => {
  try {
    // const response = await getWatchAlsoVideos(props.videoId);
    const response = await getWatchAlsoVideos(props.videoId);
    watchAlsoVideos.value = response.data.metadata;
  } catch (error) {
    toast.error(`Error loading watch also videos: ${error.message}`);
  }
});
</script>

<template>
  <aside class="w-[26rem] m-3 flex gap-5 flex-col">
    <h2 class="font-bold text-[13px]">WATCH ALSO</h2>
    <VideoCard v-for="video in watchAlsoVideos" :key="video.id" :video="video" />
  </aside>
</template>

<style scoped></style>
