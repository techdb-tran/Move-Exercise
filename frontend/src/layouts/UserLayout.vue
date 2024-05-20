<template>
  <Header />
  <div>
    <LeftPanel />
    <GetStarted v-if="store.stepShow === 1" />
    <CreateUsername v-if="store.stepShow === 2" />
    <ChooseCategory v-if="store.stepShow === 3" />
    <AlmostDone v-if="store.stepShow === 4" />
    <div class="duration-500" :class="LeftPanelStore.isOpenSidebar ? 'ml-60' : 'ml-14'">
      <RouterView :key="route.path" />
    </div>
  </div>
</template>
<script setup>
import { useOnboardingStore } from '@/stores/onboarding';
import ChooseCategory from '@/views/Home/OnBoarding/ChooseCategory.vue';
import GetStarted from '@/views/Home/OnBoarding/GetStarted.vue';
import CreateUsername from '@/views/Home/OnBoarding/CreateUsername.vue';
import AlmostDone from '@/views/Home/OnBoarding/AlmostDone.vue';
import Header from '@/components/Header/HeaderComponent.vue';
import LeftPanel from '@/components/left-panel/LeftPanelComponent.vue';
import { useLeftPanelStore } from '@/stores/leftPanel.js';
import { RouterView, useRoute } from 'vue-router';
import { getStatusVerifiedFromLS } from '@/utils/auth';

const route = useRoute();
const store = useOnboardingStore();
const LeftPanelStore = useLeftPanelStore();
const statusVerified = getStatusVerifiedFromLS();
if (statusVerified === 'Verified') {
  store.openPopup()
}
</script>
<style scoped></style>
