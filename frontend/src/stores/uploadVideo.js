import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '@/utils/http';

export const useUploadVideoStore = defineStore('uploadVideo', () => {
  const isUploadVideo = ref(false);
  const isStepper = ref(false);
  const isLoading = ref(false);
  const isUploadingVideo = ref(false);
  const numberStepper = ref(1);
  const isConfirmClose = ref(false);
  const isNotification = ref(false);
  const isLoadingDetailVideo = ref(true);
  const getIdVideo = ref();
  const saveIdLevel = ref();
  const saveValueLevel = ref();
  const saveIdDuration = ref();
  const saveValueDuration = ref();
  const isEditVideo = ref(true);
  const categoriesData = ref();
  const isUploadTitle = ref(false);
  const isLimitThumbnail = ref(false);
  const cancelTokenSource = ref(null);
  const countNumberUpload = ref(0)

  //Change Step
  const changeStep = (idStepper) => {
    document.querySelector('.active-step')?.classList.remove('active-step');
    document.querySelector(`.step-${idStepper}`)?.classList.add('active-step');
    numberStepper.value = idStepper;
  };

  function confirmLeave(event) {
    // Cancel the event (modern browsers)
    event.preventDefault();
    // Chrome requires returnValue to be set
    event.returnValue = '';

    // Show a confirmation dialog
    const confirmationMessage = 'Are you sure you want to leave this page?';
    event.returnValue = confirmationMessage; // For Chrome
    return confirmationMessage; // For other browsers
  }

    // Get categories data
    const getCategories = async () => {
      try {
        const response = await http.nodeInstance.get(`categories`);
        categoriesData.value = response.data.metadata;
      } catch (error) {
        console.log(error);
      }
    };

    const cancelRequest = () => {
      if (cancelTokenSource.value) {
        cancelTokenSource.value.cancel('Operation canceled by the user.');
        cancelTokenSource.value = null; // Reset the cancel token
      }
    };

  return {
    isUploadVideo,
    isStepper,
    isLoading,
    isUploadingVideo,
    numberStepper,
    isConfirmClose,
    isLoadingDetailVideo,
    isNotification,
    getIdVideo,
    saveIdLevel,
    saveValueLevel,
    saveIdDuration,
    saveValueDuration,
    isEditVideo,
    categoriesData,
    isUploadTitle,
    isLimitThumbnail,
    cancelTokenSource,
    countNumberUpload,
    changeStep,
    confirmLeave,
    getCategories,
    cancelRequest
  };
});
