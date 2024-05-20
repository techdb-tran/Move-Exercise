<template>
  <Toast />
  <div class="card overflow-scroll p-10">
    <div class="mb-10">
      <BlackBar><h1 class="text-4xl font-bold">Featured Video</h1></BlackBar>
    </div>
    <div v-if="featuredVideo.isLoadingFeatureVideo">
      <div v-for="index in 5" :key="index">
        <Skeleton class="mt-3 w-full" height="3rem"></Skeleton>
      </div>
    </div>
    <DataTable
      :value="listFeatureVideo"
      :rowHover="true"
      :loading="loadingFeatureVideo"
      stripedRows
      paginator
      :rows="5"
      @page="onPageFeatureVideo()"
      :rowsPerPageOptions="[5, 10, 20, 30]"
      v-if="!featuredVideo.isLoadingFeatureVideo"
    >
    <template #empty>No videos found.</template>
      <Column header="Videos" class="max-w-[300px]">
        <template #body="slotProps">
          <div class="flex gap-5 w-full">
            <div
              class="min-w-36 h-20 bg-black flex justify-center cursor-pointer max-w-36"
              @click="handleOpenDetailVideo(slotProps.data.video.id)"
            >
              <img :src="slotProps.data.video.thumbnail" class="h-full" />
            </div>
            <div class="flex flex-col justify-center items-start text-ellipsis">
              <span class="font-bold line-clamp-2" v-tooltip.top="slotProps.data.video.title">{{
                slotProps.data.video.title
              }}</span>
              <span class="font-light">{{ slotProps.data.video.level }}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column header="Date posted">
        <template #body="slotProps">
          <div>
            {{ format(new Date(slotProps.data.video.created_at), 'dd/MM/yyyy HH:mm:ss') }}
          </div>
        </template>
      </Column>
      <Column field="video.user.username" header="Created by" headerClass="text-center"> </Column>
      <Column field="video.count_view" header="Views"></Column>
      <Column header="Rating" class="text-center">
        <template #body="slotProps">
          <div class="flex items-center gap-1" @click="handlePickVideo">
            <span>{{
              slotProps.data.video.average_rates
                ? parseFloat(slotProps.data.video.average_rates).toFixed(1)
                : 0
            }}</span>
            <StarRating />
          </div>
        </template>
      </Column>
      <Column class="w-10">
        <template #body="slotProps">
          <div class="flex justify-end">
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="handleDeteleVideo($event, slotProps.data.video.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <DetailVideo v-if="isOpenDetail" @closeModal="handleCloseDetailVideo" :idVideo="idVideo" />
    <div class="mt-28 mb-14">
      <BlackBar><h1 class="text-4xl font-bold">Add Video To Featured Video List</h1></BlackBar>
    </div>

    <div v-if="featuredVideo.isLoadingTopVideo">
      <div v-for="index in 5" :key="index">
        <Skeleton class="mt-3 w-full" height="3rem"></Skeleton>
      </div>
    </div>
    <DataTable
      :value="listTopVideo"
      :rowHover="true"
      :loading="loadingTopVideo"
      stripedRows
      selectionMode="single"
      :rows="10"
      lazy
      @page="onPageTopVideo($event)"
      paginator
      :pageLinkSize="10"
      :totalRecords="totalRow"
      :rowsPerPageOptions="[5, 10, 20, 30]"
      v-if="!featuredVideo.isLoadingTopVideo"
    >
      <template #header>
        <div class="flex justify-between">
          <IconField iconPosition="left">
            <InputIcon class="flex items-center">
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="valueSearch" placeholder="Keyword Search" @keyup="searchTable" />
          </IconField>
        </div>
      </template>
      <template #empty>No videos found.</template>
      <Column header="Videos" class="max-w-[300px]">
        <template #body="slotProps">
          <div
            @click="handleOpenDetailVideo(slotProps.data.id)"
            class="cursor-pointer flex gap-5 w-full"
          >
            <div class="min-w-36 h-20 bg-black flex justify-center max-w-36">
              <img :src="slotProps.data.thumbnail" class="h-full" />
            </div>
            <div class="flex flex-col justify-center items-start text-ellipsis">
              <p class="font-bold line-clamp-2" v-tooltip.top="slotProps.data.title">
                {{ slotProps.data.title }}
              </p>
              <span class="font-light">{{ slotProps.data.level }}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column header="Date posted">
        <template #body="slotProps">
          <div>
            {{ format(new Date(slotProps.data.created_at), 'dd/MM/yyyy HH:mm:ss') }}
          </div>
        </template>
      </Column>
      <Column field="user.username" header="Created by" headerClass="text-center"> </Column>
      <Column field="count_view" header="Views"></Column>
      <Column header="Rating">
        <template #body="slotProps">
          <div class="flex items-center gap-1" @click="handlePickVideo">
            {{
              slotProps.data.average_rates ? parseFloat(slotProps.data.average_rates).toFixed(1) : 0
            }}
            <StarRating class="ml-1" />
          </div>
        </template>
      </Column>
      <Column class="w-10">
        <template #body="slotProps">
          <div class="flex justify-end">
            <Button
              v-show="hideButtonAddVideo(slotProps.data.id)"
              icon="pi pi-plus"
              outlined
              rounded
              severity="primary"
              @click="handleAddVideo($event, slotProps.data.id)"
            />
            <ConfirmPopup></ConfirmPopup>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import DetailVideo from '@/views/video_list/DetailVideo.vue';
import StarRating from '@/components/UI/StarRating.vue';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import http from '@/api/http';
import { useFeaturedVideoStore } from '@/store/featuredVideo.js';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import BlackBar from '@/components/UI/BlackBar.vue';
import Skeleton from 'primevue/skeleton';

const confirm = useConfirm();
const toast = useToast();
const listFeatureVideo = ref([]);
const listTopVideo = ref([]);
const isOpenDetail = ref(false);
const loadingFeatureVideo = ref(false);
const loadingTopVideo = ref(false);
const featuredVideo = useFeaturedVideoStore();
const totalRow = ref();
let timeoutSearchTable;
const valueSearch = ref();
const dataTablePage = ref();
const idVideo = ref();

featuredVideo.isLoadingTopVideo = true
featuredVideo.isLoadingFeatureVideo = true

//Handle search data table
const searchTable = () => {
  clearTimeout(timeoutSearchTable);
  timeoutSearchTable = setTimeout(() => {
    getTopVideo({ searchItem: valueSearch.value, page: dataTablePage.value });
  }, 500);
};

//Handle delete video
const handleDeteleVideo = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Remove this video from list feature ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Remove video',
    accept: () => {
      featuredVideo.removeFeaturedVideo(id);
      setTimeout(() => {
        getDataListVideo();
      }, 500);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Removed video successfully',
        life: 3000
      });
    },
    reject: () => {}
  });
};

//Handle add video
const handleAddVideo = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Add this video to list feature ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Add video',
    accept: () => {
      featuredVideo.addFeaturedVideo(id);
      setTimeout(() => {
        getDataListVideo();
      }, 1000);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Added video successfully',
        life: 3000
      });
    },
    reject: () => {}
  });
};

const onPageFeatureVideo = () => {
  getDataListVideo();
};

const onPageTopVideo = (event) => {
  getTopVideo({ page: event.page + 1, sizePage: event.rows, searchItem: valueSearch.value });
  dataTablePage.value = event.page + 1;
};

const handleOpenDetailVideo = (id) => {
  isOpenDetail.value = true;
  idVideo.value = id;
};

const handleCloseDetailVideo = () => {
  isOpenDetail.value = false;
};

const getDataListVideo = async () => {
  try {
    loadingFeatureVideo.value = true;
    const res = await http.nodeInstance.get(`featured-carousel`);
    listFeatureVideo.value = res.data.metadata;
    featuredVideo.isLoadingFeatureVideo = false
  } finally {
    loadingFeatureVideo.value = false;
  }
};

const getTopVideo = async (event) => {
  try {
    loadingTopVideo.value = true;
    const res = await http.nodeInstance.get(
      `/video/list/?startDate=&filters=1&page=${event?.page ? event.page : 1}
      &page_size=${event?.sizePage ? event.sizePage : 10}
      &searchTerm=${event?.searchItem ? event.searchItem : ''}`
    );
    listTopVideo.value = res.data.metadata.videos;
    totalRow.value = res.data.metadata.totalVideo;
    featuredVideo.isLoadingTopVideo = false
  } finally {
    loadingTopVideo.value = false;
  }
};

const hideButtonAddVideo = (id) => {
  let checkId = listFeatureVideo.value.map((item) => {
    if (item.video.id === id) {
      return false;
    } else {
      return true;
    }
  });
  return !checkId.some((element) => element === false);
};

onMounted(() => {
  getDataListVideo();
  getTopVideo();
});
</script>
