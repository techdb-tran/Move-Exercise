import { ref, onMounted, watch } from 'vue';
import { useElementVisibility } from '@vueuse/core';
import { toast } from 'vue3-toastify';

export default function useLoadMore(
  loadMoreElement,
  loadMoreIsShowing,
  videosRef,
  apiGetterFunction,
  pageSize,
  category,
  level,
  sortBy,
  sortOrder,
) {
  const targetIsVisible = useElementVisibility(loadMoreElement);

  const isLoadingVideos = ref(false);
  const loadPage = ref(1);

  const getVideos = async () => {
    isLoadingVideos.value = true;
    try {
      const response = await apiGetterFunction(
        loadPage.value,
        pageSize,
        category.value === 'All Categories' ? '' : category.value,
        level.value === 'all' ? '' : level.value,
        sortBy.value,
        sortOrder.value,
      );

      videosRef.value.push(...response.data.metadata.videos);
      if (response.data.metadata.videos.length < pageSize) {
        loadMoreIsShowing.value = false;
      }
      loadPage.value++;
    } catch (error) {
      toast.error(`Error loading videos: ${error.message}`);
    } finally {
      isLoadingVideos.value = false;
    }
  };

  const resetLoadMore = () => {
    loadPage.value = 1;
    videosRef.value = [];
    loadMoreIsShowing.value = true;
    getVideos();
  };

  onMounted(() => {
    getVideos();
  });

  watch(targetIsVisible, () => {
    if (targetIsVisible.value && !isLoadingVideos.value) {
      getVideos();
    }
  });

  return { resetLoadMore };
}
