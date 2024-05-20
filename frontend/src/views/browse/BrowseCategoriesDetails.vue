<template>
  <section
    class="duration-500 pt-6"
    :class="LeftPanelStore.isOpenSidebar ? 'container' : 'containerLarge'"
  >
    <div class="w-full mt-2 flex">
      <BrowseCategoriesDetailInfo />
    </div>
    <div class="relative font-bold text-primary-color w-[60px] h-[32px] mt-6">
      Videos
      <div class="absolute bottom-0 left-0 w-full h-1 bg-primary-color"></div>
    </div>
    <div class="border-[1px] mb-3"></div>
    <div class="flex items-center justify-end">
      <label class="font-bold text-[12px] mr-4">LEVEL</label>
      <Dropdown
        v-model="selectedLevel"
        :options="levels"
        optionLabel="name"
        placeholder="All levels"
        class="md:w-14rem"
        @change="resultLevel"
      />
      <label class="font-bold text-[12px] mr-4 ml-6">SORT BY</label>
      <Dropdown
        v-model="selectedSort"
        :options="sorts"
        optionLabel="name"
        scrollHeight="500px"
        placeholder="Most recent"
        class="md:w-14rem"
        @change="resultSort"
      />
    </div>
    <div
      class="mt-6 grid gap-4"
      :class="LeftPanelStore.isOpenSidebar ? 'grid-cols-3' : 'grid-cols-4'"
    >
      <VideoCard v-for="video in videoList" :key="video.id" :video="video" />
    </div>
    <div class="loadMoreDiv flex justify-center py-10">
      <DotsLoading v-if="showLoadMore" ref="el" />
    </div>
  </section>
</template>

<script setup>
import { useLeftPanelStore } from '@/stores/leftPanel.js';
import Dropdown from 'primevue/dropdown';
import { ref, onMounted, watch } from 'vue';
import http from '@/utils/http.js';
import { useRoute } from 'vue-router';
import VideoCard from '@/components/video-components/VideoCard.vue';
import BrowseCategoriesDetailInfo from '@/components/browseCategoriesDetailInfo/BrowseCategoriesDetailInfo.vue';
import DotsLoading from '@/components/UI/DotsLoading.vue';
import { useElementVisibility } from '@vueuse/core';

const LeftPanelStore = useLeftPanelStore();
const route = useRoute();
const categoryId = ref(route.params.categoryId);
const videoList = ref([]);
const page = ref(1);
const pageSize = ref(12);
const el = ref(null);
const isVisible = useElementVisibility(el);
const showLoadMore = ref(true);
const isLoadingVideo = ref(false);

const selectedLevel = ref();
const levels = ref([
  {
    name: 'All levels',
    value: '',
  },
  {
    name: 'Beginner',
    value: 'Beginner',
  },
  {
    name: 'Intermediate',
    value: 'Intermediate',
  },
  {
    name: 'Advanced',
    value: 'Advanced',
  },
]);
const selectedSort = ref();
const sorts = ref([
  {
    name: 'Most recent',
    sortBy: 'most_recent',
    sortOrder: 'DESC',
  },
  {
    name: 'Views (High to Low)',
    sortBy: 'total_view',
    sortOrder: 'DESC',
  },
  {
    name: 'Views (Low to High)',
    sortBy: 'total_view',
    sortOrder: 'ASC',
  },
  {
    name: 'Duration (Long to Short)',
    sortBy: 'duration_time',
    sortOrder: 'DESC',
  },
  {
    name: 'Duration (Short to Long)',
    sortBy: 'duration_time',
    sortOrder: 'ASC',
  },
  {
    name: 'Ratings (Hight to Low)',
    sortBy: 'average_rates',
    sortOrder: 'DESC',
  },
  {
    name: 'Ratings (Low to Hight)',
    sortBy: 'average_rates',
    sortOrder: 'ASC',
  },
]);

const sortByLevel = ref('');
const resultLevel = () => {
  sortByLevel.value = selectedLevel.value.value;
};
const sortBy = ref('most_recent');
const sortOrder = ref('DESC');
const resultSort = () => {
  sortBy.value = selectedSort.value.sortBy;
  sortOrder.value = selectedSort.value.sortOrder;
};

const loadVideoListByCategory = async () => {
  try {
    isLoadingVideo.value = true;
    const res = await http.nodeInstance.get(
      `https://api.node.move-training-stg.madlab.tech/v1/api/video/list-of-category/${categoryId.value}/?page=${page.value}&sort_by=${sortBy.value}&sort_order=${sortOrder.value}&page_size=${pageSize.value}&level=${sortByLevel.value}`,
    );
    videoList.value.push(...res.data.metadata.videos);
    page.value = page.value + 1;
    if (res.data.metadata.videos.length < pageSize.value) {
      showLoadMore.value = false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingVideo.value = false;
  }
};
onMounted(() => {
  loadVideoListByCategory();
});
watch(isVisible, () => {
  if (isVisible.value && !isLoadingVideo.value) {
    loadVideoListByCategory();
  }
});
watch([selectedLevel, selectedSort], () => {
  page.value = 1;
  videoList.value = [];
  showLoadMore.value = true;
  isLoadingVideo.value = false;
  loadVideoListByCategory();
});
</script>

<style></style>
