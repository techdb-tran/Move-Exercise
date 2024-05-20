<template>
  <div class="w-11/12 flex justify-between mt-[90px] ml-6">
    <h3 class="text-2xl text-black font-bold">Video Analytics</h3>
    <div class="flex">
      <div class="flex items-center">
        <label for="sortStatus" class="text-black font-bold text-xs">SORT BY</label>
        <Dropdown
          id="sortStatus"
          v-model="selectedValueStatus"
          :options="statusVideo"
          optionLabel="name"
          placeholder="All status"
          class="min-w-[154px] w-fit ml-3 outline outline-1 text-xs outline-primary-color-hover text-primary-color-hover"
        />
      </div>
      <div class="flex items-center ml-10">
        <label for="sortShow" class="text-black font-bold text-xs">SHOW</label>
        <Dropdown
          id="sortShow"
          v-model="selectedValueTime"
          :options="showTime"
          optionLabel="name"
          placeholder="All time"
          class="min-w-[154px] w-fit ml-3 outline outline-1 text-xs outline-primary-color text-primary-color-hover"
        />
      </div>
    </div>
  </div>
  <div class="card mt-7">
    <div v-if="nodes">
      <DataTable
        :value="nodes"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15, 20]"
        :totalRecords="totalVideo"
        @page="handlePageChange"
        lazy
        paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
        currentPageReportTemplate="{first} - {last} of {totalRecords} result"
      >
        <template #empty>
          <div v-if="isLoading">
            <LoadingVideoAnalytics />
          </div>
          <div class="flex justify-center">
            <p class="text-primary-text-color">No data.</p>
          </div>
        </template>
        <Column
          field="thumbnail"
          class="font-normal text-sm w-1/12 min-w-[124px]"
          header="VIDEOS"
        >
          <template #body="slotProps">
            <img
              @click="handleGetVideoId(slotProps.data.id)"
              v-if="slotProps.data.thumbnail"
              class="w-[124px] h-[70px] object-cover cursor-pointer"
              :src="slotProps.data.thumbnail"
              alt="video img"
            />
            <img
              @click="handleGetVideoId(slotProps.data.id)"
              v-else
              class="w-[124px] h-[70px] object-cover cursor-pointer"
              src="@/assets/images/defaultThumbnail.png"
              alt="video img"
            />
          </template>
        </Column>
        <Column field="title" class="font-normal text-sm w-6/12" header="DETAILS">
          <template #body="slotProps">
            <div class="h-[70px] cursor-pointer" @click="handleGetVideoId(slotProps.data.id)">
              <h3 class="font-bold text-black">{{ slotProps.data.title? formatString(slotProps.data.title, 80): 'No Title' }}</h3>
              <h3>{{ slotProps.data.category_name || 'No category' }}</h3>
              <h3 class="mt-[13px]">{{ formatDateVideoAna(slotProps.data.updated_at) }}</h3>
            </div>
          </template>
        </Column>
        <Column field="count_view" class="font-normal text-sm w-1/10" header="VIEWS">
          <template #body="slotProps">
            <p class="h-[70px] text-black cursor-pointer" @click="handleGetVideoId(slotProps.data.id)">
              {{ slotProps.data.count_view }}
            </p>
          </template>
        </Column>
        <Column
          field="average_view_time"
          class="font-normal text-sm w-1/10"
          header="AVG. VIEW TIME"
        >
          <template #body="slotProps">
            <div class="flex h-[70px] cursor-pointer" @click="handleGetVideoId(slotProps.data.id)">
              <p class="text-black">
                {{ formatSecond(Math.floor(slotProps.data.average_view_time)) }}
              </p>
              <p class="text-primary-text-color ml-2">
                {{ '(' + Math.floor(slotProps.data.percentage_viewed) + '%)' }}
              </p>
            </div>
          </template>
        </Column>
        <Column
          field="average_rates"
          class="font-normal text-sm w-1/10"
          header="RATINGS"
        >
          <template #body="slotProps">
            <div class="flex ml-4 h-[70px] cursor-pointer" @click="handleGetVideoId(slotProps.data.id)">
              <p>{{ formatRating(slotProps.data.average_rates) }}</p>
              <StarRating class="ml-2 mb-auto" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import StarRating from '@/components/UI/StarRating.vue';
import LoadingVideoAnalytics from './LoadingVideoAnalytics.vue';
import { getVideoAnalytics } from '@/apis/videos.api';
import { formatDateVideoAna, formatSecond, formatRating } from '@/utils/formatDate';
import { formatString } from '@/utils/formatString';
import { useRouter } from 'vue-router';

const nodes = ref([]);
const selectedValueStatus = ref(null);
const selectedValueTime = ref(null);
const isLoading = ref(false);
const router = useRouter();
const totalVideo = ref()

const statusCurrent = computed(() => {
  return selectedValueStatus.value;
});
const timeCurrent = computed(() => {
  return selectedValueTime.value;
});
const handlePageChange = (event) => {
  const { first, rows } = event;
  const page = Math.floor(first / rows) + 1;
  const pageSize = rows;
  handleGetData(
      page,
      pageSize,
      statusCurrent.value.sort_by,
      statusCurrent.value.sort_order,
      timeCurrent.value.start_date,
      timeCurrent.value.end_date,)
};
onMounted(() => {
  handleGetData();
  selectedValueStatus.value = statusVideo.value[0];
  selectedValueTime.value = showTime.value[0];
  watchEffect(() => {
    handleGetData(
      1,
      5,
      statusCurrent.value.sort_by,
      statusCurrent.value.sort_order,
      timeCurrent.value.start_date,
      timeCurrent.value.end_date,
    );
  });
});

const statusVideo = ref([
  { name: 'All status', value: 'AS', sort_by: 'all_status', sort_order: 'DESC' },
  { name: 'Views (High to Low)', value: 'VHL', sort_by: 'views', sort_order: 'DESC' },
  { name: 'Views (Low to High)', value: 'VLS', sort_by: 'views', sort_order: 'ASC' },
  { name: 'Ratings (High to Low)', value: 'RHL', sort_by: 'average_rates', sort_order: 'DESC' },
  { name: 'Ratings (Low to High)', value: 'RLH', sort_by: 'average_rates', sort_order: 'ASC' },
]);

const currentDate = new Date();
const currentISODate = currentDate.toISOString();
const last7Days = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
const last30Days = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
const last90Days = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
const oneYearAgo = new Date(
  currentDate.getFullYear() - 1,
  currentDate.getMonth(),
  currentDate.getDate(),
).toISOString();
const showTime = ref([
  { name: 'All time', value: 'AT', start_date: '2000-01-01 00:00:00', end_date: currentISODate },
  { name: 'Last 7 days', value: 'L7', start_date: last7Days, end_date: currentISODate },
  { name: 'Last 30 days', value: 'L30', start_date: last30Days, end_date: currentISODate },
  { name: 'Last 90 days', value: 'L90', start_date: last90Days, end_date: currentISODate },
  { name: '1 year ago', value: 'OY', start_date: oneYearAgo, end_date: currentISODate },
]);

const handleGetData = async (page, page_size, sort_by, sort_order, start_date, end_date) => {
  try {
    isLoading.value = true;
    const response = await getVideoAnalytics(
      page,
      page_size,
      sort_by,
      sort_order,
      start_date,
      end_date,
    );
    nodes.value = response.data.metadata.stats;
    totalVideo.value = response.data.metadata.total_videos
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
const handleGetVideoId = (id) => {
  router.push(`/streamer/video-analytics-detail/${id}`);
};
</script>
