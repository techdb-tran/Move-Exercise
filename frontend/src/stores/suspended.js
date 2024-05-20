import { defineStore } from "pinia";
import { ref } from 'vue'
export const useSuspendedStore = defineStore('suspended',()=>{
    const isSuspended = ref(false);
    const valueExpireBan = ref('');
    return {
        isSuspended,
        valueExpireBan
    };
})