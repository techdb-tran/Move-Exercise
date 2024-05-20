<template>
  <div>
    <Dialog
      :visible="uploadVideo.isUploadVideo"
      modal
      :style="{ width: '65%', height: '80%', borderRadius: '9px' }"
      class="rounded-lg"
      :pt="{
        root: 'border-none',
      }"
      v-if="uploadVideo.isStepper === false"
    >
      <template #container="{}">
        <div class="flex flex-col gap-4 p-5 pb-10 h-full">
          <div class="flex justify-between header-model">
            <h1 class="text-[24px] font-bold">Upload a video</h1>
            <CloseButton @click="closeCallback" class="cursor-pointer"></CloseButton>
          </div>
          <div class="border-2 border-primary-color border-solid rounded-lg h-full" ref="dropZone">
            {{ dropFile() }}
            <div class="flex flex-col w-full h-full items-center justify-center gap-2">
              <div><img src="@/assets/images/photo-video.png" alt="image" class="w-14" /></div>
              <span class="font-medium text-sm">Drag and drop your video to upload</span>
              <span class="font-medium text-sm">Or</span>
              <button
                @click="HandleUploadVideo"
                label="Select a file"
                class="px-12 text-[16px] py-3 text-primary-white-color bg-primary-color text-base font-bold rounded-lg hover:bg-primary-color-hover"
              >
                Select a file
              </button>
              <input
                type="file"
                accept="video/mp4"
                class="hidden"
                ref="inputUpload"
                @change="handleFileChosen"
              />
              <span v-if="isLimitFile" class="text-xs">Max file size: 50mb</span>
              <span v-else class="text-xs text-error-text-color text-[12px]"
                >Uploaded files must not exceed 50MB</span
              >
              <span v-show="!isVideoFile" class="text-xs text-error-text-color text-[12px]"
                >The file must be a video and .mp4 file</span
              >
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
  <StepperUploadComponent v-if="uploadVideo.isStepper"></StepperUploadComponent>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import CloseButton from '../../assets/svg/CloseButton.vue';
import http from '../../utils/http';
// import axios from 'axios';
import { useUploadVideoStore } from '../../stores/uploadVideo.js';
import StepperUploadComponent from './StepperUploadComponent.vue';

const uploadVideo = useUploadVideoStore();
const inputUpload = ref();
const isLimitFile = ref(true);
const isVideoFile = ref(true);
const dropZone = ref();

onMounted(() => {});

uploadVideo.getCategories();

const closeCallback = () => {
  uploadVideo.isUploadVideo = false;
  uploadVideo.isStepper = false;
};

const HandleUploadVideo = () => {
  inputUpload.value.click();
};

const dropFile = () => {
  dropZone.value?.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  dropZone.value?.addEventListener('dragenter', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  dropZone.value?.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDrop(e.dataTransfer.files);
  });
};

function handleDrop(files) {
  // Handle dropped files
  if (['video/mp4'].includes(files[0].type)) {
    handleFileChosen({ target: { files: [files[0]] } });
  } else {
    isVideoFile.value = false;
  }
}

const handleFileChosen = async (event) => {
  const file = event.target.files[0];
  let formData = new FormData();
  formData.append('video', file);

  // Add the event listener to beforeunload
  window.addEventListener('beforeunload', uploadVideo.confirmLeave);

  // limit data of file 50MB
  if (file?.size < 50 * 1024 * 1024) {
    ++uploadVideo.countNumberUpload;
    uploadVideo.isLoading = true;
    uploadVideo.isStepper = true;
    uploadVideo.isEditVideo = true;
    // uploadVideo.cancelTokenSource = axios.CancelToken.source();
    try {
      const getRequest = await http.phpInstance.post('videos', formData, {
        // cancelToken: uploadVideo.cancelTokenSource.token,
      });
      uploadVideo.getIdVideo = getRequest.data.data.id;
      isLimitFile.value = true;
      isVideoFile.value = true;
      --uploadVideo.countNumberUpload;
      if(uploadVideo.countNumberUpload === 0){
        uploadVideo.isLoading = false;
      }
      uploadVideo.isUploadTitle = false;
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  } else {
    isLimitFile.value = false;
  }
};
</script>
<style scoped></style>
