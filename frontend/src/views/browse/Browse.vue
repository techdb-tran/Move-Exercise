<script setup>
import BlackBar from '@/components/UI/BlackBar.vue';
import { ref, watch } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import BrowseCategories from './BrowseCategories.vue';
import BrowseTopVideos from './BrowseTopVideos.vue';
import { useLeftPanelStore } from '@/stores/leftPanel.js';
import BrowseGreenBar from '@/components/UI/BrowseGreenBar.vue';

const LeftPanelStore = useLeftPanelStore();

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const selectedTabIndex = ref(Number(route.query.tabIndex) || 0);

watch(selectedTabIndex, () => {
  router.replace({ query: { tabIndex: selectedTabIndex.value } });
});
</script>

<template>
  <section
    class="duration-500 pt-6 relative"
    :class="LeftPanelStore.isOpenSidebar ? 'container' : 'containerLarge'"
  >
    <BlackBar>Browse</BlackBar>
    <BrowseGreenBar :class="selectedTabIndex === 1 ? 'translate-x-[114px]' : ''" />

    <TabView v-model:active-index="selectedTabIndex" class="w-full mt-2">
      <TabPanel
        header="Categories"
        :headerClass="selectedTabIndex === 0 ? 'browse-tabview-header-text-active' : ''"
        contentClass="browse-content"
      >
        <div class="w-[100%] h-[1px] bg-[#ccc] -translate-y-4"></div>
        <BrowseCategories />
      </TabPanel>
      <TabPanel
        header="Top videos"
        :headerClass="selectedTabIndex === 1 ? 'browse-tabview-header-text-active' : ''"
        contentClass="browse-content"
      >
        <div class="w-[100%] h-[1px] bg-[#ccc] -translate-y-4"></div>
        <BrowseTopVideos />
      </TabPanel>
    </TabView>
  </section>
</template>

<style scoped>
:deep(.p-tabview-nav) {
  padding-bottom: 3px;
  gap: 2rem;
}

:deep(.p-tabview-ink-bar) {
  display: none;
}

:deep(.p-tabview-header a) {
  padding: 16px 0;
}
</style>
