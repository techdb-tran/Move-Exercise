import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserListStore = defineStore('userList', () => {
    const urlExport = ref()
    const isLoading = ref(true)

    return {
        urlExport,
        isLoading
    };
});
