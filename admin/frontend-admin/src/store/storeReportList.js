import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReportListStore = defineStore('reportList', () => {
    const searchValue = ref()
    const isLoading = ref(true)
    return {
        searchValue,
        isLoading
    };
});
