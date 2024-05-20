<template>
  <div>
    <Dialog
      :visible="uploadVideo.isStepper && uploadVideo.isConfirmClose === false"
      modal
      :style="{ width: '70%', borderRadius: '9px' }"
      class="rounded-lg overflow-y-scroll"
      :pt="{
        root: 'border-none',
      }"
      v-if="uploadVideo.isStepper && uploadVideo.isConfirmClose === false"
    >
      <template #container="{}">
        <Form @submit="onSubmit" :validation-schema="uploadVideoSchema">
          <div class="flex flex-col gap-4 p-5 pb-5">
            <div class="flex justify-between header-model">
              <h1 class="text-[24px] font-bold">{{ textTitleEdit }} details</h1>
              <CloseButton @click="closeCallback" class="cursor-pointer"></CloseButton>
            </div>
            <div class="flex gap-16">
              <div class="flex flex-col gap-4">
                <div
                  class="flex gap-3 cursor-pointer opacity-30 duration-500 step-1"
                  @click="uploadVideo.changeStep(1)"
                >
                  <div class="number-step">1</div>
                  <span class="font-bold">Details</span>
                </div>
                <div
                  class="flex gap-3 cursor-pointer opacity-30 duration-500 step-2"
                  @click="isStepOne ? uploadVideo.changeStep(2) : ''"
                >
                  <div class="number-step">2</div>
                  <span class="font-bold">Tags</span>
                </div>
                <div
                  class="flex gap-3 cursor-pointer opacity-30 duration-500 step-3"
                  @click="isStepTwo ? uploadVideo.changeStep(3) : ''"
                >
                  <div class="number-step">3</div>
                  <span class="font-bold">Settings</span>
                </div>
              </div>
              <!-- Form Details -->
              <div
                class="flex flex-col w-full gap-3 pb-16"
                v-show="uploadVideo.numberStepper === 1"
              >
                <div class="flex flex-col gap-1">
                  <label for="videoTile" class="width-fit-content font-medium">Video tile</label>
                  <Field
                    name="title"
                    id="videoTile"
                    placeholder="Add a tile"
                    class="h-10 p-2"
                    maxlength="150"
                    type="text"
                    v-model="formData.title"
                  />
                  <ErrorMessage name="title" class="text-error-text-color" />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="width-fit-content font-medium">Video thumbnail</label>
                  <!-- Input Thumbnail -->
                  <div
                    v-if="!formData.thumbnail"
                    class="border-dashed border-primary-color border-2 width-fit-content cursor-pointer"
                    @click="uploadThumbnail"
                  >
                    <div class="p-5 flex flex-col items-center gap-1">
                      <img src="@/assets/images/photo-video.png" alt="image" class="w-10" />
                      <span class="text-[12px]">Upload thumbnail</span>
                    </div>
                  </div>
                  <!-- Uploaded thumbnail -->
                  <div
                    v-else
                    class="w-50 h-32 border-solid border-primary-color border-2 width-fit-content relative"
                  >
                    <div
                      @click="cancelThumbnail"
                      class="rounded-full w-5 h-5 bg-misc-orange-color absolute right-[-10px] top-[-10px] flex justify-center items-center cursor-pointer"
                    >
                      <i class="pi pi-times text-primary-white-color text-[10px]"></i>
                    </div>
                    <img :src="formData.thumbnail" alt="Thumbnail image" class="w-full h-full" />
                    <p></p>
                  </div>
                  <input
                    id="videoThumbnail"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    ref="inputThumbnail"
                    @change="handleFileChose"
                  />
                  <span v-show="uploadVideo.isLimitThumbnail" class="text-error-text-color"
                    >Uploaded thumbnail must not exceed 12MB</span
                  >
                </div>
              </div>
              <!-- Form Tags -->
              <div class="flex flex-col w-full gap-4" v-show="uploadVideo.numberStepper === 2">
                <div class="flex flex-col gap-1">
                  <label for="videoTile" class="width-fit-content font-medium">Category</label>
                  <div class="relative w-1/2">
                    <Field
                      class="h-12 pl-2 w-full bg-transparent"
                      name="category"
                      as="select"
                      v-model="formData.category"
                    >
                      <option value="" disabled selected>Select a category</option>
                      <option
                        v-for="item in uploadVideo.categoriesData"
                        :value="item.id"
                        v-bind:key="item.id"
                      >
                        {{ item.name }}
                      </option>
                    </Field>
                    <ChevronDownIcon class="absolute right-5 top-1/2 -translate-y-1/2 z-[-1]" />
                  </div>
                </div>
                <div class="flex">
                  <div class="flex flex-col w-1/2 gap-4">
                    <label for="" class="font-medium">Workout level</label>
                    <div class="flex gap-2">
                      <div>
                        <Field
                          type="radio"
                          name="level"
                          value="Beginner"
                          v-model="formData.level"
                          class="radio-text"
                          id="Beginner"
                        />
                        <label class="text-[11px]" for="Beginner">Beginner</label>
                      </div>
                      <div>
                        <Field
                          type="radio"
                          name="level"
                          value="Intermediate"
                          v-model="formData.level"
                          class="radio-text"
                          id="Intermediate"
                        />
                        <label class="text-[11px]" for="Intermediate">Intermediate</label>
                      </div>
                      <div>
                        <Field
                          type="radio"
                          name="level"
                          value="Advanced"
                          v-model="formData.level"
                          class="radio-text"
                          id="Advanced"
                        />
                        <label class="text-[11px]" for="Advanced">Advanced</label>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col w-1/2 gap-4">
                    <label for="" class="font-medium">Duration</label>
                    <div class="flex gap-2">
                      <div class="flex gap-2">
                        <div>
                          <Field
                            type="radio"
                            name="duration"
                            value="less_than_30_mins"
                            v-model="formData.duration"
                            class="radio-text"
                            id="less_than_30_mins"
                          />
                          <label class="text-[11px]" for="less_than_30_mins">{{
                            '< 30 mins'
                          }}</label>
                        </div>
                        <div>
                          <Field
                            type="radio"
                            name="duration"
                            value="less_than_1_hour"
                            v-model="formData.duration"
                            class="radio-text"
                            id="less_than_1_hour"
                          />
                          <label class="text-[11px]" for="less_than_1_hour">{{ '< 1 hour' }}</label>
                        </div>
                        <div>
                          <Field
                            type="radio"
                            name="duration"
                            value="more_than_1_hour"
                            v-model="formData.duration"
                            class="radio-text"
                            id="more_than_1_hou"
                          />
                          <label class="text-[11px]" for="more_than_1_hou">{{ '> 1 hour' }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <div>
                    <label for="" class="font-medium mr-8 text-base">Search keywords</label>
                    <span class="italic tag-background text-sm opacity-70">(Optional)</span>
                  </div>
                  <p class="tag-background text-sm opacity-70">
                    Adding keywords help your viewers to find your videos easily. Enter a comma
                    after each word.
                  </p>
                  <div class="mt-2">
                    <Field
                      name="keyword"
                      id="keyword"
                      as="textarea"
                      placeholder="Add tags"
                      maxlength="500"
                      @input="updateCharacterCount"
                      class="w-full h-40 p-3 resize-none border-solid border-2 border-tag-background rounded-lg"
                      v-model="formData.keyword"
                    ></Field>
                    <div class="flex justify-end">
                      <span class="text-end">{{ lengthTextArea }}/500</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Form Settings -->
              <div
                class="flex flex-col w-full gap-1 pb-24"
                v-show="uploadVideo.numberStepper === 3"
              >
                <label for="">Comment settings</label>
                <p>Enable or disable your viewers to comment on the video.</p>
                <div class="flex gap-2 items-center">
                  <Field
                    name="isComment"
                    type="radio"
                    value="1"
                    v-model="formData.isComment"
                    class="radio-customize"
                  />
                  <label for="" class="mr-5">Enable</label>
                  <Field
                    name="isComment"
                    type="radio"
                    value="0"
                    v-model="formData.isComment"
                    class="radio-customize"
                  />
                  <label for="">Disable</label>
                </div>
              </div>
            </div>
          </div>
          <hr class="border-2" />
          <div
            class="flex px-5 py-4"
            :class="uploadVideo.isEditVideo ? 'justify-between' : 'justify-end'"
          >
            <div
              v-if="uploadVideo.isEditVideo"
              class="flex flex-col justify-center items-center gap-1"
            >
              <ProgressSpinner
                class="w-6 h-6"
                strokeWidth="8"
                animationDuration=".5s"
                v-show="uploadVideo.isLoading"
              ></ProgressSpinner>
              <span class="text-sm text-primary-color" v-show="uploadVideo.isLoading"
                >Processing...</span
              >
              <CheckedIcon v-show="!uploadVideo.isLoading"></CheckedIcon>
              <span class="text-sm text-primary-color" v-show="!uploadVideo.isLoading"
                >Upload complete</span
              >
            </div>
            <div class="flex gap-10 items-center">
              <button
                class="text-primary-color"
                v-show="uploadVideo.numberStepper !== 1"
                :disabled="uploadVideo.isUploadTitle"
                @click="backStep"
              >
                Back
              </button>
              <Button
                :style="{ margin: 0, height: '40px', width: '180px' }"
                v-show="uploadVideo.numberStepper === 1"
                @click="nextStep"
                :isSubmitted="isStepOne"
                >Next</Button
              >
              <Button
                :style="{ margin: 0, height: '40px', width: '180px' }"
                v-show="uploadVideo.numberStepper === 2"
                @click="nextStep"
                :isSubmitted="isStepTwo"
                >Next</Button
              >
              <Button
                :style="{ margin: 0, height: '40px', width: '180px' }"
                v-show="uploadVideo.numberStepper === 3"
                :isSubmitted="isStepThree && !uploadVideo.isLoading && !uploadVideo.isUploadTitle"
                @click="submitForm"
                type="submit"
                ><i class="pi pi-spin pi-spinner mr-3" v-show="uploadVideo.isUploadTitle"></i
                >Publish</Button
              >
            </div>
          </div>
        </Form>
      </template>
    </Dialog>
    <ConfirmCloseComponent></ConfirmCloseComponent>
    <NotificationSuccess></NotificationSuccess>
  </div>
</template>
<script setup>
import { ref, toRaw, watch, computed, onBeforeMount } from 'vue';
import Dialog from 'primevue/dialog';
import CloseButton from '@/assets/svg/CloseButton.vue';
import CheckedIcon from '@/assets/svg/CheckedIcon.vue';
import ProgressSpinner from 'primevue/progressspinner';
import http from '@/utils/http';
import { useUploadVideoStore } from '@/stores/uploadVideo.js';
import Button from '@/components/Button/Button.vue';
import ChevronDownIcon from '@/components/UI/ChevronDownIcon.vue';
import * as Yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
import ConfirmCloseComponent from './ConfirmCloseComponent.vue';
import NotificationSuccess from './NotificationSuccess.vue';
import { useVideoStore } from '../../stores/videos.js';
import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';

const videoStore = useVideoStore();
const { editVideoData } = storeToRefs(videoStore);

const uploadVideo = useUploadVideoStore();
const inputThumbnail = ref(null);
const isStepOne = ref(false);
const isStepTwo = ref(false);
const isStepThree = ref(true);
const lengthTextArea = ref(0);
const formSubmit = ref();
const dataThumbnail = ref();
const formData = ref({
  title: editVideoData?.value?.title || '',
  category: editVideoData?.value?.category_id || '',
  level: editVideoData?.value?.level || '',
  duration: editVideoData?.value?.duration || '',
  keyword: editVideoData?.value?.keyword || '',
  isComment: (editVideoData?.value?.is_comment ? '1' : '0') || '',
  thumbnail: editVideoData?.value?.thumbnail || null,
});

const uploadVideoSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title input is required')
    .matches(/^\S(.*\S)?$/, 'Title must not have spaces at the beginning or end'),
  thumbnail: Yup.mixed(),
  category: Yup.string().required('Select an category'),
  keyword: Yup.string(),
  isComment: Yup.boolean(),
});

onBeforeMount(() => {
  if (!uploadVideo.isEditVideo) {
    isStepOne.value = true;
    isStepTwo.value = true;
    isStepThree.value = true;
    uploadVideo.isLoading = false;
    uploadVideo.isUploadTitle = false;
  }
  uploadVideo.categoriesData;
});

watch(
  () => [
    formData.value.title,
    formData.value.category,
    formData.value.level,
    formData.value.duration,
    formData.value.isComment,
  ],
  ([title, category, level, duration, isComment]) => {
    isStepOne.value = title !== '' && title.trim() === title;
    isStepTwo.value = category !== '' && level !== '' && duration !== '';
    isStepThree.value = isComment !== '';
  },
);

const closeCallback = () => {
  uploadVideo.isUploadingVideo = true;
  uploadVideo.isConfirmClose = true;
  uploadVideo.isUploadVideo = false;
  uploadVideo.isStepper = true;
};

//update step when unclose
setTimeout(() => {
  uploadVideo.changeStep(uploadVideo.numberStepper);
}, 100);

const nextStep = () => {
  uploadVideo.changeStep(++uploadVideo.numberStepper);
};

const backStep = () => {
  uploadVideo.changeStep(--uploadVideo.numberStepper);
  console.log(uploadVideo.isUploadTitle);
};

const uploadThumbnail = () => {
  inputThumbnail.value.click();
};

const cancelThumbnail = () => {
  formData.value.thumbnail = null;
};

function updateCharacterCount(event) {
  lengthTextArea.value = event.target.value.length;
}

const handleFileChose = (event) => {
  const file = event.target.files[0];
  if (file?.size < 12 * 1024 * 1024) {
    const reader = new FileReader();
    reader.onload = () => {
      // Set the data URL as the image source
      formData.value.thumbnail = reader.result;
      dataThumbnail.value = file;
    };
    reader.readAsDataURL(file);
    uploadVideo.isUploadedThumbnail = true;
    uploadVideo.isLimitThumbnail = false;
  } else {
    uploadVideo.isLimitThumbnail = true;
  }
};

const onSubmit = async (values) => {
  formSubmit.value = values;
};

const submitForm = () => {
  uploadVideo.isUploadingVideo = false;
  uploadVideo.imageUrl = null;
  uploadVideo.isUploadVideo = false;
  uploadVideo.isConfirmClose = false;
  uploadVideo.isUploadTitle = true;

  setTimeout(async () => {
    const data = {
      ...formSubmit.value,
      thumbnail: dataThumbnail.value,
    };
    let formDatas = new FormData();
    formDatas.append('title', data.title);
    formDatas.append('category_id', data.category);
    formDatas.append('duration', data.duration);
    formDatas.append('level', data.level);
    formDatas.append('is_comment', formData.value.isComment);
    toRaw(dataThumbnail.value) ? formDatas.append('thumbnail', data.thumbnail) : '';
    formDatas.append('keyword', data.keyword);

    if (!uploadVideo.isEditVideo) {
      await http.phpInstance.post(`videos/${editVideoData?.value?.id}`, formDatas);
      uploadVideo.isLoadingDetailVideo = false;
      uploadVideo.isStepper = false;
      uploadVideo.isUploadTitle = false;
      uploadVideo.changeStep(1);
      uploadVideo.isLoading = true;
      toast.success('Edit video successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
      editVideoData.value = null;
      videoStore.getVideoListApi(10, 1);
    } else {
      try {
        await http.phpInstance.post(`videos/${uploadVideo.getIdVideo}`, formDatas);
        uploadVideo.isLoadingDetailVideo = false;

        window.removeEventListener('beforeunload', uploadVideo.confirmLeave);
        uploadVideo.isStepper = false;
        uploadVideo.isUploadTitle = false;
        uploadVideo.changeStep(1);
        uploadVideo.isLoading = false;
        toast.success('Uploaded video successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        videoStore.getVideoListApi(10, 1);
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  }, 500);
  videoStore.getVideoListApi(10, 1);
};

const textTitleEdit = computed(() => {
  return uploadVideo.isEditVideo ? 'Video' : 'Edit';
});

watch(editVideoData, () => {});
</script>

<style scoped src="./style.css"></style>
