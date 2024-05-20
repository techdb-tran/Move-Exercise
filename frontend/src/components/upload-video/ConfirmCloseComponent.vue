<template>
  <div>
    <Dialog
      :visible="uploadVideo.isConfirmClose"
      modal
      :style="{ width: '842px', borderRadius: '9px' }"
      class="rounded-lg"
      :pt="{
        root: 'border-none',
      }"
      v-if="uploadVideo.isConfirmClose"
    >
      <template #container="{}">
        <div class="flex flex-col gap-4 p-5">
          <div class="flex justify-between header-model">
            <h1 v-if="uploadVideo.isEditVideo" class="text-3xl font-bold">You have not publish your video</h1>
            <h1 v-else class="text-3xl font-bold">Your edits have not been saved</h1>
            <CloseButton @click="cancel" class="cursor-pointer"></CloseButton>
          </div>
          <div>
            <p v-if="uploadVideo.isEditVideo">
              Your video is not published yet, you will lose all details in your video. Are you sure
              to close this window?
            </p>
            <p v-else>Are you sure to close this window?</p>
          </div>
          <div class="flex justify-center gap-10">
            <button class="text-primary-color" @click="cancel">Cancel</button>
            <Button
              class="hover:bg-primary-color-hover"
              :isSubmitted="true"
              :style="{ margin: 0, height: '40px', width: '180px' }"
              @click="confirm"
              >Confirm</Button
            >
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import Dialog from 'primevue/dialog';
import CloseButton from '@/assets/svg/CloseButton.vue';
import Button from '@/components/Button/Button.vue';
import { useUploadVideoStore } from '@/stores/uploadVideo.js';
import { useVideoStore } from '../../stores/videos.js';
import { storeToRefs } from 'pinia';

const videoStore = useVideoStore();
const { editVideoData } = storeToRefs(videoStore);

const uploadVideo = useUploadVideoStore();

const cancel = () => {
  uploadVideo.isConfirmClose = false;
  setTimeout(() => {
    uploadVideo.changeStep(uploadVideo.numberStepper);
  }, 100);
};
const confirm = () => {
  uploadVideo.isUploadingVideo = false;
  uploadVideo.isUploadVideo = false;
  uploadVideo.isStepper = false;
  uploadVideo.isConfirmClose = false;
  uploadVideo.imageUrl = null;
  editVideoData.value = null;
  uploadVideo.isEditVideo = true;
  uploadVideo.changeStep(1);
  window.removeEventListener('beforeunload', uploadVideo.confirmLeave);
  // uploadVideo.cancelRequest()
};
</script>
<style scoped></style>
