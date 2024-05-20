import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '@/api/http';

export const useFeaturedVideoStore = defineStore('featuredVideo', () => {
    const isLoadingFeatureVideo = ref(true)
    const isLoadingTopVideo = ref(true)
    // Get categories data
    const addFeaturedVideo = async (id) => {
        try {
            await http.nodeInstance.post(`featured-carousel/add/${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFeaturedVideo = async (id) => {
        try {
            await http.nodeInstance.delete(`featured-carousel/remove/${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        isLoadingFeatureVideo,
        isLoadingTopVideo,
        addFeaturedVideo,
        removeFeaturedVideo
    };
});
