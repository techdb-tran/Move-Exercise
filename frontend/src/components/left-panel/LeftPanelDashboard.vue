<script setup>
import { ref, watchEffect } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import AnalyticsIcon from '@/components/UI/AnalyticsIcon.vue';
import ChevronDownIcon from '@/components/UI/ChevronDownIcon.vue';
import VideoIcon from '@/components/UI/VideoIcon.vue';
import GearIcon from '@/components/UI/GearIcon.vue';

const route = useRoute();

const routeIsAnalytics = ref(false);
const isShowingAnalyticsRoutes = ref(true);

watchEffect(() => {
  if (route.name === 'streamerOverview' || route.name === 'streamerVideoAnalytics') {
    routeIsAnalytics.value = true;
  } else {
    routeIsAnalytics.value = false;
  }
});
</script>

<template>
  <div
    class="z-[1000] sidebar w-60 fixed h-screen mt-14 pb-12 border-2 border-solid border-r-zinc-300 top-0 bg-primary-white-color overflow-scroll"
  >
    <nav class="flex flex-col p-4 gap-4">
      <button
        :class="{ routerLink: true, relative: true, 'router-link-exact-active': routeIsAnalytics }"
        @click="() => (isShowingAnalyticsRoutes = !isShowingAnalyticsRoutes)"
      >
        <AnalyticsIcon />
        Analytics
        <ChevronDownIcon
          :class="{ rotate: isShowingAnalyticsRoutes }"
          class="right-0 top-1/2 -translate-y-1/2 absolute"
        />
      </button>
      <div class="flex flex-col gap-4" v-show="isShowingAnalyticsRoutes">
        <RouterLink :to="{ name: 'streamerOverview' }" class="pl-8 analyticLink"
          >Overview</RouterLink
        >
        <RouterLink :to="{ name: 'streamerVideoAnalytics' }" class="pl-8 analyticLink"
          >Video analytics</RouterLink
        >
      </div>

      <RouterLink :to="{ name: 'streamerVideos' }" class="routerLink"
        ><VideoIcon /> Videos</RouterLink
      >
      <RouterLink :to="{ name: 'streamerChannelSettings' }" class="routerLink">
        <GearIcon />
        Channel settings</RouterLink
      >
    </nav>
  </div>
</template>

<style scoped>
.routerLink {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.analyticLink.router-link-exact-active {
  color: black;
  font-weight: 700;
}

.routerLink.router-link-exact-active {
  color: var(--primary-color);
  font-weight: 700;
  fill: var(--primary-color);
}

.chevron {
  transition: transform 0.5s;
}

.rotate {
  transform: rotate(180deg);
}
</style>
