import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useOnboardingStore = defineStore('onboarding', () => {
  const stepShow = ref(0); //1: GetStarted, 2: CreateUsername, 3: ChooseCategory, 4: AlmostDone
  const isPopup = ref(false)
  const openPopup = () => {
    stepShow.value = 1
    isPopup.value = true
  }
  const nextStep = () => {
    stepShow.value++;
  };
  const skipShow = () => {
    stepShow.value = 5;
    isPopup.value = false
  };
  const endShow = () => {
    stepShow.value = 10;
    isPopup.value = false
  };

  return {
    openPopup,
    isPopup,
    stepShow,
    nextStep,
    endShow,
    skipShow,
  };
});
