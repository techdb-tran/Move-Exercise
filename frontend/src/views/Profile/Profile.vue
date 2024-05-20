<template>
  <section class="duration-500 pt-6 relative container px-10 font-sans mb-4 py-8">
    <BlackBar>Settings</BlackBar>
    <BrowseGreenBar :class="selectedTabIndex === 1 ? 'translate-x-[85px]' : 'max-w-[50px]'" />
    <TabView v-model:active-index="selectedTabIndex" class="w-full mt-2">
      <TabPanel
        header="Profile"
        :headerClass="selectedTabIndex === 0 ? 'browse-tabview-header-text-active' : ''"
        contentClass="browse-content"
      >
        <div class="w-full h-[1px] bg-[#ccc] -translate-y-4"></div>
        <SettingProfile />
      </TabPanel>
      <TabPanel
        header="Notifications"
        :headerClass="selectedTabIndex === 1 ? 'browse-tabview-header-text-active' : ''"
        contentClass="browse-content"
      >
        <div class="w-full h-[1px] bg-[#ccc] -translate-y-4"></div>
        <Notification />
      </TabPanel>
    </TabView>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Notification from './Notifications.vue';
import SettingProfile from './SettingProfile.vue';
import BlackBar from '../../components/UI/BlackBar.vue';
import BrowseGreenBar from '@/components/UI/BrowseGreenBar.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Panel
const selectedTabIndex = ref(Number(route.query.tabIndex) || 0);

watch(selectedTabIndex, () => {
  router.replace({ query: { tabIndex: selectedTabIndex.value } });
});
</script>

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
