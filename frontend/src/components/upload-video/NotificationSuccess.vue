<template>
  <div>
    <Dialog
      :visible="uploadVideo.isNotification"
      modal
      :style="{ width: '50%', borderRadius: '9px' }"
      class="rounded-lg"
      :pt="{
        root: 'border-none',
      }"
      v-if="uploadVideo.isNotification && uploadVideo.isLoading"
    >
      <template #container="{}">
        <div class="flex flex-col gap-4 p-5">
          <div class="flex justify-between header-model"></div>
          <div>
            <p>Your video is being uploaded, please do not close this browser</p>
          </div>
          <div class="flex justify-center gap-10">
            <Button
              class="hover:bg-primary-color-hover"
              :isSubmitted="true"
              :style="{ margin: 0, height: '40px', width: '180px' }"
              @click="confirm"
              >Ok</Button
            >
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import Dialog from 'primevue/dialog';
import Button from '@/components/Button/Button.vue';
import { useUploadVideoStore } from '@/stores/uploadVideo.js';

const uploadVideo = useUploadVideoStore();

const confirm = () => {
  uploadVideo.isUploadingVideo = false;
  uploadVideo.isStepper = false;
  uploadVideo.imageUrl = null;
  uploadVideo.changeStep(1);
  uploadVideo.isLoading = true;
  uploadVideo.isNotification = false;
  uploadVideo.isUploadVideo = false;
  uploadVideo.isConfirmClose = false;
};
</script>
<style scoped></style>
