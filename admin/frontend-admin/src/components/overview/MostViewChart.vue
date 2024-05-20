<template>
  <div class="mb-20">
    <h1 class="text-xl font-bold text-center text-primary-color-hover">
      Overview of videos with the most views
    </h1>
    <Chart
      type="line"
      :data="overviewStore.chartData"
      :options="overviewStore.chartOptions"
      class="h-[500px] w-5/6 m-auto mt-10"
    />
    <div class="p-10 mt-10 ml-4 h-96">
      <h1 class="text-xl font-bold text-center text-primary-color-hover">
        Total users tracked throughout time
      </h1>
      <Chart type="bar" :data="chartData" :options="chartOptions" class="mt-10" />
    </div>
  </div>
  <div v-if="overviewStore.isLoading">...Loading</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';
import { useOverviewStore } from '@/store/storeOverview';

onMounted(() => {
  handleGetDataChart();
  overviewStore.chartOptions = overviewStore.setChartOptions();
});

const overviewStore = useOverviewStore();

const handleGetDataChart = () => {
  overviewStore.initial;
};

//Bar Chart
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  return {
    labels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24'
    ],
    datasets: [
      {
        label: 'Hours',
        data: [
          540, 325, 202, 320, 410, 325, 702, 620, 440, 325, 702, 620, 540, 325, 902, 620, 540, 825,
          402, 320, 220, 340, 100, 290
        ],
        backgroundColor: ['#13d0b4'],
        borderWidth: 1,
        maintainAspectRatio: true
      }
    ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
};
</script>
