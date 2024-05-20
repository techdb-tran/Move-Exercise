<template>
  <div class="grid grid-cols-12 gap-4" v-if="isChannelHaveVideo">
    <div class="col-span-4" v-for="item in listVideo" :key="item.id">
      <VideoCard :video="item" />
    </div>
  </div>
  <div v-else>The channel has not upload any video yet !</div>
</template>

<script setup>
import VideoCard from '@/components/video-components/VideoCard.vue';
import http from '@/utils/http';
import { onMounted, ref, watch } from 'vue';

const pageNum = ref(1);
const props = defineProps({
  idChannel: String,
});
const listVideo = ref();
const isChannelHaveVideo = ref(true);

const getListVideoChannel = async () => {
  try {
    const res = await http.nodeInstance(
      `video/list-video-of-user/${props.idChannel}?page=1&page_size=12`,
    );
    listVideo.value = res.data.metadata;
  } finally {
    if (listVideo.value.length === 0) isChannelHaveVideo.value = false;
  }
};

const getMoreListVideoChannel = async () => {
  pageNum.value++;
  const res = await http.nodeInstance.get(
    `video/list-video-of-user/${props.idChannel}?page=${pageNum.value}&page_size=12`,
  );
  const newData = res.data.metadata;
  if (newData.length > 0) {
    listVideo.value = [...listVideo.value, ...newData];
  } else {
    window.removeEventListener('scroll', handleScroll);
  }
};

const handleScroll = () => {
  const bottomOfWindow =
    document.documentElement.scrollHeight - window.innerHeight === window.scrollY;
  if (bottomOfWindow) {
    getMoreListVideoChannel();
  }
};

watch(
  () => props.idChannel,
  () => {
    getListVideoChannel();
  },
);

onMounted(() => {
  getListVideoChannel();
  window.addEventListener('scroll', handleScroll);
});
</script>
