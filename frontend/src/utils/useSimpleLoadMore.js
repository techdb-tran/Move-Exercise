import { ref, onMounted, watch } from 'vue';
import { useElementVisibility } from '@vueuse/core';
import { toast } from 'vue3-toastify';

const PAGE_SIZE = 6;

export default function useLoadMore(
  loadMoreElement,
  LoadMoreIsShowing,
  videosRef,
  apiGetterFunction,
) {
  const targetIsVisible = useElementVisibility(loadMoreElement);

  const isLoadingVideos = ref(false);
  const loadPage = ref(1);

  const getVideos = async () => {
    isLoadingVideos.value = true;
    try {
      const response = await apiGetterFunction(loadPage.value);
      videosRef.value.push(...response.data.metadata);
      if (response.data.metadata.length < PAGE_SIZE) {
        LoadMoreIsShowing.value = false;
      }
      loadPage.value++;
    } catch (error) {
      toast.error(`Error loading videos: ${error.message}`);
    } finally {
      isLoadingVideos.value = false;
    }
  };

  onMounted(() => {
    getVideos();
  });

  watch(targetIsVisible, () => {
    if (targetIsVisible.value && !isLoadingVideos.value) {
      getVideos();
    }
  });
}
