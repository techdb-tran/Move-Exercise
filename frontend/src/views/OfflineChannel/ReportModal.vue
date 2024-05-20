<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :style="{ width: '604px' }"
    class="p-4 relative"
  >
    <template #header>
      <div class="flex-grow font-bold text-2xl mb-4">Report user</div>
    </template>
    <span class="cursor-pointer absolute top-4 right-4" @click="store.endShow">
      <CloseButton />
    </span>
    <div class="mb-3" v-for="item in listReasonReport" :key="item.id">
      <div @click="handlePickReasonReport(item.id, item.title)" class="inline-block">
        <InputRadioButton :value="item.title" :label="item.title" name="reason" :id="item.title" />
      </div>
    </div>
    <div class="mt-4 mb-12 text-xs leading-6 opacity-80">
      Flagged videos and users are reviewed by MOVE staff 24 hours a day, 7 days a week to determine
      whether they violate Community Guidelines. Accounts are penalised for Community Guidelines
      violations, and serious or repeated violations can lead to account termination.
    </div>
    <div class="text-xs opacity-80">
      Please also contact law enforcement if you believe that someone is in immediate danger.
    </div>
    <div class="w-full text-center mt-6">
      <Button
        class="px-8 block mx-auto hover:bg-primary-color-hover bg-primary-color py-2 text-white"
        @click="handleReportChannel"
        :class="{ 'bg-secondary-text-color': !isPickReason, 'pointer-events-none': !isPickReason }"
      >
        <div class="flex">
          <SpinIcon class="animate-spin h-5 w-5 mr-1" :class="{ hidden: !loading }" />
          <span class="font-bold" :class="{ 'opacity-70': !isPickReason }">Next</span>
        </div>
      </Button>
    </div>
  </Dialog>
</template>

<script setup>
import SpinIcon from '@/components/UI/SpinIcon.vue';
import CloseButton from '@/components/UI/CloseButton.vue';
import InputRadioButton from '@/components/InputRadioButton/InputRadioButton.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useReportUser } from '@/stores/reportuser';
import http from '@/utils/http';
import { ref } from 'vue';

const store = useReportUser();
const visible = ref(true);
const isPickReason = ref(false);
const loading = ref(false);
const listReasonReport = store.listReasonReport;

const handlePickReasonReport = (idReason, reason) => {
  isPickReason.value = true;
  store.createReasonReport(idReason, reason);
};

const handleReportChannel = async () => {
  loading.value = true;
  const dataToSend = {
    type_report_id: store.idReasonReport,
    reported_user_id: store.idChannelReported,
  };
  try {
    store.statusReport = '';
    await http.phpInstance.post(`reports`, dataToSend);
    store.statusReport = true;
  } catch (err) {
    store.statusReport = false;
  }
  store.nextStep();
};
</script>

<style scoped></style>
