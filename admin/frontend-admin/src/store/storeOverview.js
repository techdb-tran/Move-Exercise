import { defineStore } from 'pinia';
import { computed, onMounted, ref, watchEffect } from 'vue';
import http from '@/api/http';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'vue3-toastify';

export const useOverviewStore = defineStore('overview-admin', () => {
  const selectedTime = ref();
  const chartData = ref({ label: [], dataset: [] });
  const chartOptions = ref({});

  const categories = ref([]);

  const dateFrom = ref();
  const dateTo = ref();

  const isLoading = ref(false);

  const handleGetData = async (startDate, endDate) => {
    try {
      isLoading.value = true;
      const res = await http.nodeInstance.get(
        `video/overview?startDate=${startDate}&endDate=${endDate}`
      );

      const titles = res.data.metadata.map((item) => item.title);
      const views = res.data.metadata.map((item) => item.count_view);

      setChartData(titles, views);
      isLoading.value = false;
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    // get categories chart data
    try {
      const response = await http.nodeInstance.get('/category/overview', {
        params: { startDate: startDate, endDate: endDate }
      });
      categories.value = response.data.metadata;
    } catch (error) {
      toast.error(`Error loading categories: ${error.message}`);
    }
  };
  const labelFormatter = (value) => {
    if (value.length > 14) {
      return value.substring(0, 14) + '...';
    }
    return value;
  };
  const setChartData = (titles, views) => {
    const formattedLabels = titles.map(title => labelFormatter(title));
    chartData.value = {
      labels: formattedLabels,
      datasets: [
        {
          label: '',
          data: views,
          fill: false,
          borderColor: '#13D0B4',
          tension: 0
        }
      ]
    };
  };

  const setChartOptions = () => {
    return {
      maintainAspectRatio: false,
      aspectRatio: 0,
      plugins: {
        legend: {
          display: false
        }
      }
    };
  };

  const initial = onMounted(() => {
    selectedTime.value = times.value[0];
    watchEffect(() => {
      handleGetData(timeCurrent.value.start_date, timeCurrent.value.end_date);
    });
  });

  const currentDate = new Date();
  const currentTimezoneOffsetInMinutes = currentDate.getTimezoneOffset();
  const convertedDate = new Date(currentDate.getTime() - (currentTimezoneOffsetInMinutes * 60000));
  const currentISODate = new Date(convertedDate.getTime() + (7 * 3600000)).toISOString();
  const last7Days = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last30Days = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const last90Days = new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const oneYearAgo = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate()
  ).toISOString();
  const times = ref([
    { name: 'Last 7 days', value: 'L7', start_date: last7Days, end_date: currentISODate },
    { name: 'Last 30 days', value: 'L30', start_date: last30Days, end_date: currentISODate },
    { name: 'Last 90 days', value: 'L90', start_date: last90Days, end_date: currentISODate },
    { name: '1 year ago', value: 'OY', start_date: oneYearAgo, end_date: currentISODate },
    { name: 'All time', value: 'AT', start_date: '2000-01-01 00:00:00', end_date: currentISODate }
  ]);
  const timeCurrent = computed(() => {
    return selectedTime.value;
  });
  const dateFromCurrent = computed(() => {
    return dateFrom.value;
  });
  const dateToCurrent = computed(() => {
    return dateTo.value;
  });
  const handleTimeShow = () => {
    if (dateFromCurrent.value && dateToCurrent.value) {
      handleGetData(formatDate(dateFromCurrent.value), formatDate(dateToCurrent.value));
    }
  };

  return {
    selectedTime,
    times,
    dateFrom,
    dateTo,
    handleGetData,
    chartOptions,
    chartData,
    setChartOptions,
    setChartData,
    isLoading,
    timeCurrent,
    initial,
    handleTimeShow,
    dateFromCurrent,
    dateToCurrent,
    categories
  };
});
