import http from '@/utils/http';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useVideoStore = defineStore('video', () => {
  const videosList = ref();
  const videoRemove = ref(false);
  const deleteVideoSuccessfully = ref(false);
  const editVideoData = ref();
  const totalVideo = ref();

  // Get Video Data
  const getVideoListApi = async (pageSize, page) => {
    try {
      const response = await http.nodeInstance.get(
        `/video/list?page_size=${pageSize}&page=${page}`,
      );
      if (response.status === 200) {
        totalVideo.value = response.data.metadata.totalVideo;
        videosList.value = response.data.metadata.videos;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Remove Video
  const removeVideoListApi = async (videoId) => {
    try {
      const response = await http.nodeInstance.post('video/list', {
        video_id: videoId,
      });
      if (response.status === 200) {
        videoRemove.value = false;
        deleteVideoSuccessfully.value = true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    videosList,
    videoRemove,
    deleteVideoSuccessfully,
    editVideoData,
    totalVideo,
    getVideoListApi,
    removeVideoListApi,
  };
});
