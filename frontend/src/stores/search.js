import http from '@/utils/http';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const showPopupSearch = ref(false);
  const search = ref();
  const searchInstantData = ref();
  const searchResultData = ref();
  const noResult = ref(false);
  const titleSearchResult = '';

  //API search instant
  const getSearchInstantApi = async () => {
    const response = await http.nodeInstance.get(
      `/search?search_query=${encodeURIComponent(search.value)}`,
    );
    if (response.status === 200) {
      searchInstantData.value = response.data.metadata;
    }
  };

  //API search result
  const getSearchResultApi = async () => {
    try {
      const response = await http.nodeInstance.get(`/search/result?search_query=${search.value}`);
      if (response.status === 200) {
        searchResultData.value = response.data.metadata;
      }
      if (
        Array.isArray(searchInstantData.value?.categories) &&
        searchResultData.value?.categories?.length === 0 &&
        searchResultData.value?.videos?.length === 0 &&
        searchResultData.value?.users?.length === 0
      ) {
        noResult.value = true;
      } else {
        noResult.value = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    search,
    noResult,
    showPopupSearch,
    searchInstantData,
    searchResultData,
    titleSearchResult,
    getSearchInstantApi,
    getSearchResultApi,
  };
});
