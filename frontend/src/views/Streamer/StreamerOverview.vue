<template>
  <div class="w-full pt-20 px-6 grid grid-cols-2">
    <div class="col-span-1">
      <div class="ml-0">
        <h2 class="text-[24px] font-bold">Overview</h2>
        <div class="w-[241px] h-[100px] rounded-xl shadow-card mt-6 px-4 pt-2">
          <h4 class="text-[16px] font-bold">Total followers</h4>
          <div class="font-bold mt-2 text-[32px]">{{ totalFollowers }}</div>
        </div>
      </div>
      <div class="mt-12">
        <h2 class="text-[24px] font-bold">Video summary</h2>
        <div class="flex gap-5">
          <div class="w-[241px] h-[100px] rounded-xl shadow-card mt-6 px-4 pt-2">
            <h4 class="text-[16px] font-bold">Total video views</h4>
            <div class="font-bold mt-2 text-[32px]">{{ totalVideoViews }}</div>
          </div>
          <div class="w-[241px] h-[100px] rounded-xl shadow-card mt-6 px-4 pt-2">
            <h4 class="text-[16px] font-bold">Average view time</h4>
            <div class="font-bold mt-2 text-[32px]">{{ averageViewTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-1">
      <div>
        <h2 class="text-[24px] font-bold">Latest analytics</h2>
        <NoDataLatestVideo v-if="false"/>
        <LatestVideo v-if="true"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import http from '@/utils/http';
import LatestVideo from './LatestVideo.vue';
import NoDataLatestVideo from './NoDataLatestVideo.vue';
import { onMounted, ref } from 'vue';
import { formatSecond } from '@/utils/formatDate';

const totalFollowers = ref(0);
const totalVideoViews = ref(0);
const averageViewTime = ref(0);
const getOverviewVideoAnalytics = async ()=>{
  try {
    const res = await http.nodeInstance.get('/analytic/overview');
    totalFollowers.value = res.data.metadata.total_followers;
    totalVideoViews.value = res.data.metadata.total_video_views;
    averageViewTime.value = formatSecond(res.data.metadata.average_view_time)
  } catch (error) {
    console.error(error)
  }
}
onMounted(()=>{
  getOverviewVideoAnalytics();
})
</script>
<style scoped>
.shadow-card{
  box-shadow: 0 2px 8px rgb(160, 154, 154);
}
</style>
