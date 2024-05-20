<template>
<div v-if="isHaveData" class="w-[503px] min-h-[510px] h-fit rounded-xl shadow-card mt-6 px-4 pt-[14px]">
  <h4 class="text-[18px] font-bold">Latest video</h4>
  <div class="mt-4 w-[471px] h-[265px]">
    <img v-if="thumbnail" class="w-[471px] h-[265px] object-cover" :src="thumbnail" alt="latest video" />
    <img v-else class="w-[471px] h-[265px] object-cover" src="@/assets/images/defaultThumbnail.png"
      alt="video default image" />
  </div>
  <h3 class="font-bold mt-[10px]">{{ title }}</h3>
  <div class="mt-[18px]">
    <div class="flex justify-between">
      <p>Total views</p>
      <p class="font-bold">{{ countView }}</p>
    </div>
    <div class="flex justify-between">
      <p>Total REPs received</p>
      <p class="font-bold">{{ totalComment }} REPs</p>
    </div>
    <div class="flex justify-between">
      <p>Ratings</p>
      <div class="flex items-center">
        <p class="font-bold">{{ rating }}</p>
        <div class="ml-1">
          <StarRating />
        </div>
      </div>
    </div>
    <span class="mt-[22px] block text-primary-color cursor-pointer" @click="goToVideoAnalytics">Go to video
      analytics</span>
  </div>
</div>
<NoDataLatestVideo v-if="!isHaveData" />
</template>
<script setup>
import StarRating from '@/components/UI/StarRating.vue';
import http from '@/utils/http';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import NoDataLatestVideo from './NoDataLatestVideo.vue';
import { formatString } from '@/utils/formatString';
const router = useRouter()
function goToVideoAnalytics() {
  router.push('/streamer/videoAnalytics')
};
const thumbnail = ref(null);
const title = ref('No Title');
const countView = ref(0);
const totalComment = ref(0);
const rating = ref(0);
const isHaveData = ref(false);
const getLatestVideo = async () => {
  try {
    const res = await http.nodeInstance.get('/analytic/latest-video');
    isHaveData.value = true;
    thumbnail.value = res.data.metadata.thumbnail;
    title.value =res.data.metadata.title? formatString(res.data.metadata.title,52): 'No title';
    countView.value = res.data.metadata.count_view;
    totalComment.value = res.data.metadata.total_comment;
    rating.value = res.data.metadata.average_rating;
  } catch (error) {

  }
}
onMounted(() => {
  getLatestVideo();
})
</script>
<style scoped>
.shadow-card {
  box-shadow: 0 2px 8px rgb(160, 154, 154);
}
</style>