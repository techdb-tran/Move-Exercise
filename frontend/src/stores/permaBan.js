import { defineStore } from "pinia";
import {ref} from 'vue'
export const usePermaBanStore = defineStore('permaBan',()=>{
    const isPermaBan = ref(false);
    return {
        isPermaBan
    }
});