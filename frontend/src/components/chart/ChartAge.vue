<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { computed } from 'vue';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartOptions = {
  responsive: true,
};
const dataProps = defineProps(['propDataDemographicsByAge']);
const chartData = computed(() => {
  const labels = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '64 above', 'Unknown'];
  const data = [
    dataProps?.propDataDemographicsByAge?.age_under_18,
    dataProps?.propDataDemographicsByAge?.age_18_24,
    dataProps?.propDataDemographicsByAge?.age_25_34,
    dataProps?.propDataDemographicsByAge?.age_35_44,
    dataProps?.propDataDemographicsByAge?.age_45_54,
    dataProps?.propDataDemographicsByAge?.age_55_64,
    dataProps?.propDataDemographicsByAge?.age_64_above,
    dataProps?.propDataDemographicsByAge?.unknown,
    0,
  ];
  const maxValue = Math.max(...data);
  const increaseMaxValue = Math.ceil(maxValue * 1.15);
  data[data.length - 1] = increaseMaxValue;
  return {
    labels,
    datasets: [{ data, label: 'People', backgroundColor: '#13D0B4', width: 10 }],
  };
});
</script>
