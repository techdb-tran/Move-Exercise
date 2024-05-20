<template>
  <div class="pt-1 duration-500" :class="LeftPanelStore.isOpenSidebar ? 'container' : 'containerLarge'">
    <div class="warningsetprofile flex justify-between items-center mt-6 mb-4" v-if="onboardingStore.stepShow === 5 && onboardingStore.isPopup === false">
      <div class="text-sm">Complete your profile now.</div>
      <div class="flex items-center">
        <Button label="Skip this" class="text-primary-color mr-10" text @click="handleSkipNoti" />
        <Button class="bg-primary-color hover:bg-primary-color-hover text-white py-2 px-4" @click="handleRouteProfile">
          <span class="font-bold">Complete the profile</span>
        </Button>
      </div>
    </div>
    <!-- <OfflineChannel /> -->
    <FeatureCarousel />
    <CategoriesSection />
    <VideosYouMayLike />
  </div>
</template>

<script setup>
// import OfflineChannel from '@/views/OfflineChannel/OfflineChannel.vue';
import Button from 'primevue/button';
import FeatureCarousel from './FeatureCarousel.vue';
import CategoriesSection from './CategoriesSection.vue';
import router from '@/router';
import VideosYouMayLike from './VideosYouMayLike.vue';
import { useLeftPanelStore } from '@/stores/leftPanel.js';
import { onMounted, ref } from 'vue';
import http from '@/utils/http';
import { setUserSetupStatusToLS, getStatusUserSetupFromLS, getAccessTokenFromLS } from '@/utils/auth';
import { useOnboardingStore } from '@/stores/onboarding';
const LeftPanelStore = useLeftPanelStore();
const handleRouteProfile = () => {
  router.push('/profile');
};
const onboardingStore = useOnboardingStore()
const profileUser = ref()
const statusUserSetup = ref('')
const userToken = getAccessTokenFromLS()

const checkIsUserUpdate = () => {
  if (!profileUser.value.birthday || !profileUser.value.gender || !profileUser.value.city) {
    setUserSetupStatusToLS('false')
    statusUserSetup.value = getStatusUserSetupFromLS()
  }
  else setUserSetupStatusToLS('true')
}

const handleSkipNoti = () => {
  onboardingStore.endShow()
}

const getProfile = async () => {
  try {
    const res = await http.nodeInstance.get('/user');
    profileUser.value = res.data.metadata
    checkIsUserUpdate()
  } catch (error) {
    console.log(error);
  };
}

onMounted(() => {
  statusUserSetup.value = getStatusUserSetupFromLS()
  if(statusUserSetup.value !== 'skip' && userToken) {
    getProfile()
  }
})

</script>

<style scoped>
.warningsetprofile {
  max-width: 1000px;
  background-color: #fff6e6;
  border: #ffce99 1px solid;
  padding: 12px 12px 12px 18px;
  border-radius: 5px;
}
</style>
