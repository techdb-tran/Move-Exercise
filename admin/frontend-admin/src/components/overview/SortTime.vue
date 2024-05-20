<template>
<div class="border-b-2">
    <div class="w-5/6 ml-auto mt-[90px] flex mb-4">
        <div class="flex items-center">
            <h1 class="font-bold">SHOW</h1>
            <Dropdown v-model="overviewStore.selectedTime" :options="overviewStore.times" optionLabel="name"
                placeholder="All time" class="w-full md:w-14rem ml-5" />
        </div>
        <div class="flex items-center ml-10">
            <h1 class="font-bold">SHOW CUSTOM DAY</h1>
            <div class="flex ml-5">
                <Calendar v-model="overviewStore.dateFrom" :maxDate="maxStartDate" :numberOfMonths="1" placeholder="Start day"
                    @dateClick="handleFromDateClick" />
                <Calendar v-model="overviewStore.dateTo" :minDate="minToDate" :numberOfMonths="1"
                    placeholder="End day" class="ml-2" />
            </div>
        </div>
        <Button class="ml-2 mt-[1px]" @click="handleShow"
            :isSubmitted="overviewStore.dateFromCurrent && overviewStore.dateToCurrent"
            :style="{ width: '80px' }">Show</Button>
    </div>
</div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import { computed } from 'vue';
import { useOverviewStore } from '@/store/storeOverview';
import Button from '../UI/Button.vue';

const overviewStore = useOverviewStore();

const handleFromDateClick = (date) => {
    const nextDay = new Date(date.getTime() + (24 * 60 * 60 * 1000));
    overviewStore.dateTo = nextDay;
};

const minToDate = computed(() => {
    if (overviewStore.dateFrom) {
        const nextDay = new Date(overviewStore.dateFrom.getTime() + (24 * 60 * 60 * 1000));
        console.log(nextDay);
        return nextDay;
    }
    return null;
});
const maxStartDate = computed(() => {
  if (overviewStore.dateTo) {
    return new Date(overviewStore.dateTo.getTime() - (24 * 60 * 60 * 1000));
  }
  return null;
});
const handleShow = () => {
    overviewStore.handleTimeShow();
};
</script>