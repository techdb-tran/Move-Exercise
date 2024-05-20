import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLeftPanelStore = defineStore('leftPanel', () => {
    const isOpenSidebar = ref(true);
    const idUser = ref()


    return {
        isOpenSidebar,
        idUser,
    };
});
