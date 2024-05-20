<template>
  <Toast />
  <div class="card pt-4">
    <DataTable
      :value="listVideo.videos"
      :rowHover="true"
      :loading="loading"
      :rows="10"
      @page="onPage"
      v-model:selection="selectedProducts"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="grid grid-cols-12 items-start gap-3">
          <div class="col-span-5">
            <h1 class="text-4xl font-bold text-start">Video List</h1>
          </div>
          <div class="col-span-4 whitespace-nowrap items-center w-4/5">
            <span class="mr-2">SORT BY</span>
            <Dropdown
              v-model="selectedSortBy"
              :options="sortBy"
              optionLabel="name"
              placeholder="All status"
              class="w-11/12 md:w-14rem border-primary-color"
              @change="handleSortBy"
            />
          </div>
          <div class="col-span-3 whitespace-nowrap items-center w-11/12">
            <div class="w-4/5">
              <span class="mr-2">SHOW</span>
              <Dropdown
                v-model="selectedSortTime"
                :options="sortTime"
                optionLabel="name"
                placeholder="All time"
                class="w-full md:w-14rem border-primary-color"
                @change="handleSortTime"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mt-8">
          <Button
            icon="pi pi-trash"
            severity="primary"
            label="Delete"
            class="p-1.5 font-bold"
            Raised
            :disabled="!selectedProducts || selectedProducts.length === 0"
            @click="handleDeteleMutilVideo($event)"
          />
          <ConfirmPopup group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
              <div class="border-round p-3">
                <span>{{ message.message }}</span>
                <div class="flex align-items-center gap-2 mt-3">
                  <Button label="Delete" @click="acceptCallback" size="small"></Button>
                  <Button
                    label="Cancel"
                    outlined
                    @click="rejectCallback"
                    severity="secondary"
                    size="small"
                    text
                  ></Button>
                </div>
              </div>
            </template>
          </ConfirmPopup>
          <IconField iconPosition="left">
            <InputIcon class="top-5">
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="search" placeholder="Search" @input="handleSearchVideo" />
          </IconField>
        </div>
      </template>
      <template #empty> No videos found. </template>
      <Column selectionMode="multiple" class="w-1/12" style="max-width: 5%" :exportable="false">
      </Column>
      <Column field="avatar" header="Videos" class="w-2/12">
        <template #body="slotProps">
          <div
            @click="handleOpenDetailVideo(slotProps.data.id)"
            class="cursor-pointer text-center w-32 h-20"
          >
            <img :src="slotProps.data.thumbnail" class="h-full w-full" />
          </div>
        </template>
      </Column>
      <Column header="Details" class="w-2/12">
        <template #body="slotProps">
          <div class="font-bold">{{ truncate(slotProps.data.title, 50) }}</div>
          <div v-for="item in slotProps.data.Category" :key="item">
            <span class="font-light">{{ item }}</span>
          </div>
        </template>
      </Column>
      <Column header="Date posted" class="w-1/12">
        <template #body="slotProps">
          <div>
            {{ format(new Date(slotProps.data.created_at), 'dd/MM/yyyy HH:mm:ss') }}
          </div>
        </template>
      </Column>
      <Column header="Created by" headerClass="text-center" class="max-w-10 w-2/12" style="">
        <template #body="slotProps">
          <div class="w-full truncate flex items-center">
            {{ slotProps.data.user.username }}
            <VerifiedBadge v-if="slotProps.data.user.is_verified" class="ml-1" />
          </div>
        </template>
      </Column>
      <Column field="count_view" header="Views" class="w-1/12 text-center"></Column>
      <Column field="count_comment" header="Comment" class="w-1/12 text-center">
        <template #body="slotProps">
          <div class="flex justify-center">
            {{ slotProps.data.count_comment ? slotProps.data.count_comment : 0 }}
          </div>
        </template>
      </Column>
      <Column header="Rating" class="w-1/12 text-center">
        <template #body="slotProps">
          <div class="flex justify-center">
            {{
              slotProps.data.average_rates ? parseFloat(slotProps.data.average_rates).toFixed(1) : 0
            }}
            <StarRating class="ml-1" />
          </div>
        </template>
      </Column>
      <Column class="w-1/12">
        <template #header>
          <div class="">Options</div>
        </template>
        <template #body="slotProps">
          <div class="flex">
            <Button
              icon="pi pi-eye"
              outlined
              rounded
              severity="primary"
              v-if="slotProps.data.is_exist"
              class="mr-2"
              @click="handleHideVideo($event, slotProps.data.id)"
            />
            <ConfirmPopup group="hide">
              <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="border-round p-3">
                  <span>{{ message.message }}</span>
                  <div class="flex align-items-center gap-2 mt-3">
                    <Button
                      label="Hide"
                      @click="acceptCallback(slotProps.data.id)"
                      size="small"
                    ></Button>
                    <Button
                      label="Cancel"
                      outlined
                      @click="rejectCallback"
                      severity="secondary"
                      size="small"
                      text
                    ></Button>
                  </div>
                </div>
              </template>
            </ConfirmPopup>
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="handleDeteleVideo($event, slotProps.data.id)"
            />
            <ConfirmPopup group="headless">
              <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="border-round p-3">
                  <span>{{ message.message }}</span>
                  <div class="flex align-items-center gap-2 mt-3">
                    <Button
                      label="Delete"
                      @click="acceptCallback(slotProps.data.id)"
                      size="small"
                    ></Button>
                    <Button
                      label="Cancel"
                      outlined
                      @click="rejectCallback"
                      severity="secondary"
                      size="small"
                      text
                    ></Button>
                  </div>
                </div>
              </template>
            </ConfirmPopup>
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator
      :first="first"
      :rows="10"
      @page="onPage"
      :totalRecords="listVideo?.totalVideo"
    ></Paginator>
    <DetailVideo v-if="isOpenDetail" @closeModal="handleCloseDetailVideo" :idVideo="idVideo" />
    <VideoHideList @reRenderListVideo="reRenderListVideo" :idVideoHide="idVideoHide" />
  </div>
</template>

<script setup>
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import Paginator from 'primevue/paginator';
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue';
import VideoHideList from '@/views/video_list/VideoHideList.vue';
import DetailVideo from '@/views/video_list/DetailVideo.vue';
import StarRating from '@/components/UI/StarRating.vue';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted } from 'vue';
import { format, subDays } from 'date-fns';
import http from '@/api/http';

let inputTimeOut;
const isSearching = ref(false);
const first = ref(0);
const pageNum = ref(1);
const currentDate = new Date();
const search = ref('');
const confirm = useConfirm();
const toast = useToast();
const listVideo = ref([]);
const selectedProducts = ref();
const isOpenDetail = ref(false);
const idVideo = ref();
const idVideoHide = ref();
const selectedSortBy = ref({
  name: 'All status',
  code: 0
});
const selectedSortTime = ref({ name: 'All time', code: 'all' });
const timeAfterSort = ref('');
const loading = ref(false);
const sortBy = ref([
  { name: 'All status', code: 0 },
  { name: 'Views (High to Low)', code: 1 },
  { name: 'Views (Low to High)', code: 2 },
  { name: 'Ratings (High to Low)', code: 3 },
  { name: 'Ratings (Low to High)', code: 4 }
]);

const sortTime = ref([
  { name: 'All time', code: 'all' },
  { name: 'Last 7 days', code: 7 },
  { name: 'Last 30 days', code: 30 },
  { name: 'Last 90 days', code: 90 },
  { name: 'Last 1 year ago', code: 365 }
]);

const handleHideVideo = async (event, id) => {
  confirm.require({
    target: event.currentTarget,
    group: 'hide',
    message: 'Hide this video ?',
    accept: async () => {
      await http.nodeInstance.post(`/video/hide/${id}`);
      resetIndexPage();
      getDataListVideo();
      toast.add({
        severity: 'success',
        summary: 'Hide Video',
        detail: 'Hide video successfully',
        life: 3000
      });
      idVideoHide.value = id;
    }
  });
};

const handleDeteleVideo = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: 'Delete this video ?',
    accept: async () => {
      await http.nodeInstance.post(`/video/delete`, {
        video_id: [id]
      });
      resetIndexPage();
      getDataListVideo();
      toast.add({
        severity: 'success',
        summary: 'Delete Video',
        detail: 'Delete video successfully',
        life: 3000
      });
    }
  });
};

const handleDeteleMutilVideo = (event) => {
  const idSelectedProducts = selectedProducts.value.map((item) => item.id);
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: idSelectedProducts.length > 1 ? 'Delete these videos ?' : 'Delete this video ?',
    accept: async () => {
      await http.nodeInstance.post(`/video/delete`, {
        video_id: idSelectedProducts
      });
      selectedProducts.value = [];
      toast.add({
        severity: 'success',
        summary: 'Delete videos',
        detail: 'Delete videos successfully',
        life: 3000
      });
      resetIndexPage();
      getDataListVideo();
    }
  });
};

const handleSearchVideo = async () => {
  clearTimeout(inputTimeOut);
  inputTimeOut = setTimeout(async () => {
    isSearching.value = search.value ? true : false;
    try {
      loading.value = true;
      const res = await http.nodeInstance.get(
        `/video/list/?searchTerm=${search.value}&page=${pageNum.value}&page_size=10`
      );
      listVideo.value = res.data.metadata;
    } finally {
      loading.value = false;
      resetIndexPage();
      selectedSortBy.value = { name: 'All status', code: 0 };
      selectedSortTime.value = { name: 'All time', code: 'all' };
    }
  }, 500);
};

const onPage = (event) => {
  pageNum.value = event.page + 1; //page start at 0
  if (isSearching.value) {
    handleSearchVideo();
  } else {
    first.value = event.page * 10;
    getDataListVideo();
  }
};

const handleOpenDetailVideo = (id) => {
  isOpenDetail.value = true;
  idVideo.value = id;
};

const handleCloseDetailVideo = () => {
  isOpenDetail.value = false;
};

const handleSortBy = () => {
  resetIndexPage();
  getDataListVideo();
};

const resetIndexPage = () => {
  first.value = 1;
  pageNum.value = 1;
};

const handleSortTime = () => {
  resetIndexPage();
  if (selectedSortTime.value.code !== 'all') {
    const dayAfterChangeSort = subDays(currentDate, selectedSortTime.value.code);
    timeAfterSort.value = format(dayAfterChangeSort, 'yyyy-MM-dd');
    getDataListVideo();
  } else {
    timeAfterSort.value = {};
    getDataListVideo();
  }
};

const reRenderListVideo = () => {
  getDataListVideo();
};

const getDataListVideo = async () => {
  try {
    loading.value = true;
    const res = await http.nodeInstance.get(
      `/video/list/?startDate=${timeAfterSort.value}&filters=${selectedSortBy.value.code}&page=${pageNum.value}&page_size=10`
    );
    listVideo.value = res.data.metadata;
  } finally {
    loading.value = false;
  }
};

const truncate = (value, length) => {
  if (value.length <= length) return value;
  return value.slice(0, length) + '...';
};

onMounted(() => {
  getDataListVideo();
});
</script>
