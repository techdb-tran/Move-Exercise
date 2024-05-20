<template>
  <div class="card mt-7 ml-2">
    <div>
      <Transition name="slide-fade">
        <div
          v-if="selectedRows?.length > 0"
          class="w-[90%] h-[45px] px-5 flex justify-between items-center ml-5 rounded-xl border-primary-color border-[1px] bg-[#E6FFFB] mb-2"
        >
          <div class="flex gap-8">
            <div @click="handleShowPopupRemove" class="flex gap-2 cursor-pointer">
              <Trash />
              <h2 class="text-primary-color text-sm font-bold">Delete video</h2>
            </div>
            <div class="flex gap-2 cursor-pointer" @click="downloadSelectedVideos">
              <Download />
              <h2 class="text-primary-color text-sm font-bold">Download video</h2>
            </div>
          </div>
          <div class="mr-52">
            <span @click="selectAllVideos"> {{ textAllBeforeSelected }}</span>
            <span class="font-bold mr-1 text-black">{{ selectedRows.length }}</span
            >videos on this page has been selected.
            <span
              class="font-bold text-primary-color ml-1 cursor-pointer"
              @click="selectAllVideos"
              >{{ selectAllText }}</span
            >
          </div>
          <div></div>
        </div>
      </Transition>
    </div>
    <div v-if="isLoading">
      <div v-for="index in 20" :key="index">
        <Skeleton class="mt-3 ml-5 w-full mr-5" height="3rem"></Skeleton>
      </div>
    </div>
    <div v-else-if="videosList && videosList.length > 0">
      <DataTable
        :value="videosList"
        :paginator="true"
        :rows="5"
        :rowHover="rowHover"
        v-model:selection="selectedRows"
        :totalRecords="totalVideo"
        :rowsPerPageOptions="[5, 10, 20, 30]"
        @page="handlePageChange"
        dataKey="id"
        lazy
        paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink"
        currentPageReportTemplate="{first} - {last} of {totalRecords} result"
        tableClass="mb-11"
      >
        <Column
          selectionMode="multiple"
          :exportable="false"
          class="font-normal text-sm w-[50px] custom-checkbox"
        >
        </Column>
        <Column class="font-normal text-sm w-[160px]" header="VIDEOS">
          <template #body="slotProps">
            <img
              v-if="slotProps.data.thumbnail"
              @click="hanldeShowVideo(slotProps.data.id)"
              :src="slotProps.data.thumbnail"
              alt="Video thumbnail"
              class="w-[124px] h-[70px] object-cover cursor-pointer"
            />
            <img
              v-else
              @click="hanldeShowVideo(slotProps.data.id)"
              src="@/assets/images/defaultThumbnail.png"
              alt="Video thumbnail"
              class="w-[124px] h-[70px] object-cover cursor-pointer"
            />
            <div v-if="selectedShowVideo === slotProps.data.id">
              <Dialog
                v-model:visible="visible"
                modal
                :style="{ width: '65rem' }"
                :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
                :dismissableMask="true"
              >
                <vueVimeoPlayer
                  :player-width="1040"
                  :player-height="600"
                  :video-url="slotProps.data.url"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
                  :options="{
                    autoplay: true,
                    byline: false,
                    portrait: false,
                    title: false,
                    vimeo_logo: false,
                    transparent: false,
                  }"
                  @playing="playingHandler($event)"
                  @pause="pauseHandler()"
                  @ended="endHandler()"
                />
              </Dialog>
            </div>
          </template>
        </Column>
        <Column class="font-normal text-sm w-6/14" header="DETAILS">
          <template #body="slotProps">
            <div>
              <p class="font-bold text-sm">{{ slotProps.data.title }}</p>
              <p class="font-light">{{ slotProps.data.category_name }}</p>
              <div class="gap-2 mt-[6px] flex">
                <Tag>Advanced</Tag>
                <Tag>> 1 hour</Tag>
              </div>
            </div>
          </template>
        </Column>
        <Column class="font-normal text-sm w-[160px]" header="DATE POSTED">
          <template #body="slotProps">
            <div class="font-light">{{ formatDate(slotProps.data.created_at) }}</div>
          </template>
        </Column>
        <Column field="count_view" class="font-normal text-sm w-[160px]" header="VIEWS"></Column>
        <Column
          field="count_comment"
          class="font-normal mx-auto text-sm w-[160px]"
          header="COMMENTS"
        >
          <template #body="slotProps">
            <div class="ml-3">{{ slotProps.data.count_comment || 0 }}</div>
          </template>
        </Column>
        <Column field="average_rates" class="font-normal text-sm w-[160px]" header="RATINGS">
          <template #body="slotProps">
            <div class="flex ml-4">
              <div>{{ Math.ceil(slotProps.data.average_rates * 10) / 10 || 0 }}</div>
              <StarRating class="ml-2 mb-auto" />
            </div>
          </template>
        </Column>
        <Column v-if="rowHover" field="id" class="text-center" style="position: relative">
          <template #body="slotProps">
            <div class="flex gap-6 items-center relative">
              <Edit @click.stop="handleEditVideo(slotProps.data, slotProps.data.id)" />
              <Option @click="handleToggle(slotProps.data.id)" />
              <StepperUploadComponent v-if="showModalEditVideo === slotProps.data.id" />
              <div
                v-if="selectedVideoId === slotProps.data.id"
                class="absolute bg-white w-[170px] h-[72px] border-[1px] border-primary-color rounded-xl top-6 right-[50%] p-[14px]"
              >
                <div
                  class="flex gap-2 cursor-pointer"
                  @click="handleRemoveVideoMore(slotProps.data.id)"
                >
                  <Trash />
                  <h2 class="text-primary-color text-sm ml-[2px]">Delete video</h2>
                </div>
                <div class="flex gap-2 cursor-pointer mt-2">
                  <Download />
                  <h2 class="text-primary-color text-sm">Download video</h2>
                </div>
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-else class="px-5">
      <p class="italic text-[16px]">You have not uploaded any videos yet.</p>
      <div class="-translate-y-8" @click="openUpload">
        <Button :isSubmitted="true">
          <div class="flex gap-2 items-center justify-center">
            <div class="translate-y-1">
              <Camera />
              <div class="translate-x-3 -translate-y-1">
                <ChildrenCamera />
              </div>
            </div>
            <p>Upload a video</p>
          </div>
        </Button>
      </div>
    </div>
  </div>
  <Dialog
    :draggable="false"
    v-model:visible="videoRemove"
    modal
    :style="{ width: '36rem' }"
    class="px-4"
  >
    <template #header>
      <div class="font-bold font-sans -translate-y-2 text-[24px] pt-4">
        {{ textDeleteAll }} videos
      </div>
    </template>
    <span
      @click="handleClosePopupRemove"
      class="button--close absolute top-4 right-4 cursor-pointer"
    >
      <img src="@/assets/images/closebutton.png" alt="" />
    </span>
    <span class="block mt-2 mb-4 text-sm"
      >{{ subTextDeleteAll }} videos will be permanently deleted. You will lose all datas such from
      your videos as
      <span class="font-bold">views, comments & ratings</span>
      . Are you sure?</span
    >
    <div class="flex justify-center gap-10 items-center -translate-y-6">
      <p @click="handleClosePopupRemove" class="text-primary-color mt-10 px-2 cursor-pointer">
        Cancel
      </p>
      <div @click="handleRemoveVideo">
        <Button width="170px" :isSubmitted="true">Delete</Button>
      </div>
    </div>
  </Dialog>
  <Dialog
    :draggable="false"
    v-model:visible="deleteVideoSuccessfully"
    modal
    :style="{ width: '25rem' }"
    class="p-4"
  >
    <template #header>
      <div class="font-bold font-sans -translate-y-2 text-[24px]">Delete video</div>
    </template>
    <span
      @click="deleteVideoSuccessfully = false"
      class="button--close absolute top-4 right-4 cursor-pointer"
    >
      <img src="@/assets/images/closebutton.png" alt="" />
    </span>
    <span class="p-text-secondary block mt-2 mb-4 text-[15px]"
      >Your video has been successfully deleted.</span
    >
    <div @click="deleteVideoSuccessfully = false" class="flex justify-center gap-2">
      <CustomButton
        class="flex w-[170px] h-[40px] bg-primary-color text-white font-bold justify-center items-center cursor-pointer rounded-sm"
        >Okay</CustomButton
      >
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import StarRating from '@/components/UI/StarRating.vue';
import Tag from '../../components/UI/Tag.vue';
import Dialog from 'primevue/dialog';
import Edit from '../../assets/svg/Option.vue';
import Option from '../../assets/svg/Edit.vue';
import Trash from '../../assets/svg/Trash.vue';
import Download from '../../assets/svg/Download.vue';
import { useVideoStore } from '../../stores/videos.js';
import { storeToRefs } from 'pinia';
import Button from '../../components/Button/Button.vue';
import Camera from '../../assets/svg/Camera.vue';
import ChildrenCamera from '../../assets/svg/ChildrenCamera.vue';
import { useUploadVideoStore } from '@/stores/uploadVideo.js';
import StepperUploadComponent from '@/components/upload-video/StepperUploadComponent.vue';
import { vueVimeoPlayer } from 'vue-vimeo-player';
import Skeleton from 'primevue/skeleton';

const videoStore = useVideoStore();
const uploadVideo = useUploadVideoStore();
const { videosList, videoRemove, deleteVideoSuccessfully, editVideoData, totalVideo } =
  storeToRefs(videoStore);

const selectedRows = ref();
const rowHover = ref(true);
const selectedVideoId = ref(null);
const showModalEditVideo = ref(null);
const visible = ref(false);
const isLoading = ref(true);

// để kiểm tra xem tất cả các video có được chọn hay không
const selectAllChecked = computed(() => {
  return (
    selectedRows.value && videosList.value && selectedRows.value.length === videosList.value.length
  );
});

const selectAllText = computed(() => {
  return selectAllChecked.value ? 'Clear selection' : 'Select all videos';
});

const textAllBeforeSelected = computed(() => {
  return selectAllChecked.value ? 'All  ' : '';
});

const textDeleteAll = computed(() => {
  return selectAllChecked.value ? 'Delete all' : 'Delete';
});

const subTextDeleteAll = computed(() => {
  return selectAllChecked.value ? 'All of your' : 'The selected';
});

// Hàm để chọn hoặc bỏ chọn tất cả các video
const selectAllVideos = () => {
  if (selectAllChecked.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = [...videosList.value];
  }
};
// Show more
const handleToggle = (videoId) => {
  selectedVideoId.value = selectedVideoId.value === videoId ? null : videoId;
};

// Show video
const selectedShowVideo = ref(null);
const hanldeShowVideo = (videoId) => {
  selectedShowVideo.value = selectedShowVideo.value === videoId ? null : videoId;
  visible.value = true;
};
// Format day
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthName = monthNames[monthIndex];

  return `${day} ${monthName} ${year}`;
};

//Delete item
const handleShowPopupRemove = () => {
  videoRemove.value = true;
};

const handleClosePopupRemove = () => {
  videoRemove.value = false;
};

const handleRemoveVideo = () => {
  const videoIds = selectedRows.value.map((video) => video.id);
  videoStore.removeVideoListApi(videoIds);
  videosList.value = videosList.value.filter((video) => !videoIds.includes(video.id));
  selectedRows.value = [];
  if (videosList.value.length === 0) {
    videoStore.getVideoListApi(5, 1);
  }
};

const handleRemoveVideoMore = (videoId) => {
  selectedVideoId.value = null;
  videoStore.removeVideoListApi(videoId);
  videosList.value = videosList.value.filter((video) => video.id !== videoId);
  selectedRows.value = [];
};

// Upload Video
const openUpload = () => {
  uploadVideo.isUploadVideo = true;
};

// Edit Video
const handleEditVideo = (rowData, videoId) => {
  uploadVideo.isEditVideo = false;
  editVideoData.value = rowData;
  showModalEditVideo.value = showModalEditVideo.value === videoId ? null : videoId;
  uploadVideo.isStepper = true;
  uploadVideo.isConfirmClose === false;
  showModalEditVideo.value = true;
};

//Paginator
const handlePageChange = (event) => {
  const { first, rows } = event;
  const page = Math.floor(first / rows) + 1;
  const pageSize = rows;
  videoStore.getVideoListApi(pageSize, page);
};

onMounted(async () => {
  await videoStore.getVideoListApi(5, 1);
  isLoading.value = false;
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
