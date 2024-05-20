<template>
  <div
    class="absolute top-16 -left-10 w-[320px] h-[329px] shadow-overview rounded-lg z-20 bg-primary-white-color p-3 overflow-y-scroll"
    ref="popupInstant"
  >
    <!-- Categories search  -->
    <div>
      <div v-for="category in searchStore?.searchInstantData?.categories" :key="category?.id">
        <div
          @click="() => categoryClickHandler(category?.id)"
          class="flex justify-between items-center mb-3 cursor-pointer"
        >
          <div class="flex gap-2 items-center">
            <img :src="category.image_url" alt="" class="w-[36px] h-[52px] object-cover" />
            <h2 class="text-sm" v-html="highlightKeyword(category.name, searchStore.search)"></h2>
          </div>
          <div class="italic text-[12px]">Categories</div>
        </div>
        <!-- Separating strip -->
      </div>
      <div
        v-if="searchStore?.searchInstantData?.categories?.length >= 1"
        class="h-[1px] w-full bg-[#CCCCCC] my-[12px]"
      ></div>
    </div>

    <!-- Instructor search  -->
    <div class="mb-2">
      <div v-for="instructor in searchStore?.searchInstantData?.users" :key="instructor?.id">
        <div
          @click="() => channelClickHandler(instructor?.id)"
          class="flex justify-between items-center mb-3 cursor-pointer"
        >
          <div class="flex gap-2 items-center">
            <img
              :src="instructor?.avatar_url"
              alt=""
              class="w-[36px] h-[36px] object-cover rounded-[50%]"
            />
            <div class="flex gap-1 items-center">
              <p
                class="text-sm"
                v-html="highlightKeyword(instructor?.username, searchStore.search)"
              ></p>
              <div v-if="instructor?.count_follow >= 10" class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16.12"
                  height="16"
                  viewBox="0 0 16.12 16"
                >
                  <path
                    id="Path_645"
                    data-name="Path 645"
                    d="M400.607,194.577l-.429-.394a1.476,1.476,0,0,1-.257-1.869l.309-.5a.98.98,0,0,0-.669-1.483l-.574-.1a1.478,1.478,0,0,1-1.226-1.44l-.009-.583a.976.976,0,0,0-1.363-.883l-.531.223a1.484,1.484,0,0,1-1.809-.54l-.326-.48a.977.977,0,0,0-1.62-.009l-.326.48a1.492,1.492,0,0,1-1.817.523l-.531-.231a.979.979,0,0,0-1.371.866l-.017.583a1.484,1.484,0,0,1-1.243,1.423l-.574.094a.98.98,0,0,0-.686,1.474l.3.5a1.478,1.478,0,0,1-.283,1.869l-.429.386a.983.983,0,0,0,.223,1.612l.523.257a1.487,1.487,0,0,1,.771,1.723l-.154.557a.98.98,0,0,0,1.054,1.234l.574-.069a1.494,1.494,0,0,1,1.586,1.029l.171.557a.98.98,0,0,0,1.552.471l.446-.369a1.486,1.486,0,0,1,1.886.009l.446.369a.979.979,0,0,0,1.56-.446l.18-.549a1.487,1.487,0,0,1,1.594-1.011l.574.077a.979.979,0,0,0,1.072-1.217l-.146-.557a1.486,1.486,0,0,1,.8-1.714l.523-.249A.994.994,0,0,0,400.607,194.577Zm-3.437-1.526-5.083,5.083a.518.518,0,0,1-.72,0l-2.829-2.829a.869.869,0,0,1,0-1.234.9.9,0,0,1,1.243,0l1.946,1.946,4.2-4.2a.9.9,0,0,1,1.243,0A.869.869,0,0,1,397.169,193.051Z"
                    transform="translate(-384.801 -186.092)"
                    fill="#0ab5e7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <p v-if="instructor?.count_follow > 0" class="italic text-[12px]">Instructor</p>
          <p v-else class="italic text-[12px]">User</p>
        </div>
      </div>
      <!-- Separating strip -->
      <div
        v-if="searchStore?.searchInstantData?.users?.length >= 1"
        class="h-[1px] w-full bg-[#CCCCCC] my-[12px]"
      ></div>
    </div>

    <!-- Video search  -->
    <div>
      <div v-for="video in searchStore?.searchInstantData?.videos" :key="video?.id">
        <div
          @click="() => videoClickHandler(video?.id)"
          class="flex justify-between items-center mb-3 cursor-pointer"
        >
          <div class="flex gap-2 items-center">
            <img
              v-if="video.thumbnail"
              :src="video.thumbnail"
              alt=""
              class="w-[36px] h-[52px] object-cover"
            />
            <img
              v-else
              src="@/assets/images/defaultThumbnail.png"
              alt=""
              class="w-[36px] h-[52px] object-cover"
            />
            <h2 class="text-sm" v-html="highlightKeyword(video.title, searchStore.search)"></h2>
          </div>
          <div class="italic text-[12px]">Videos</div>
        </div>
      </div>
      <!-- Separating strip -->
      <div
        v-if="searchStore?.searchInstantData?.videos?.length >= 1"
        class="h-[1px] w-full bg-[#CCCCCC] my-[12px]"
      ></div>
    </div>

    <!-- Result search  -->
    <div @click="handleSearchResult" class="mt-5 ml-3 flex gap-[18px] cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18">
        <path
          id="Path_615"
          data-name="Path 615"
          d="M103.3,201.212l-3.379-3.379a7.613,7.613,0,0,0,1.243-4.186,7.7,7.7,0,1,0-7.7,7.7,7.613,7.613,0,0,0,4.186-1.243l3.379,3.379a1.6,1.6,0,0,0,2.268-2.268Zm-15.717-7.564a5.885,5.885,0,1,1,10.5,3.645l-.978.978a5.871,5.871,0,0,1-9.52-4.622Z"
          transform="translate(-85.77 -185.95)"
          fill="#13D0B4"
        />
      </svg>
      <div class="text-sm">
        All results for <span class="font-semibold">{{ searchStore.search }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '../../stores/search.js';
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchStore = useSearchStore();
const popupInstant = ref(null);

const handleClickOutside = (event) => {
  if (popupInstant.value && !popupInstant.value.contains(event.target)) {
    searchStore.showPopupSearch = false;
  }
};

document.addEventListener('click', handleClickOutside);
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Handle Search Result
const handleSearchResult = () => {
  searchStore.getSearchResultApi();
  searchStore.titleSearchResult = searchStore.search;
  router.push('/search');
};

// Handle Video Click
const videoClickHandler = (video) => {
  router.push({ name: 'video', params: { videoId: video } });
};

// Handle category Click
const categoryClickHandler = (category) => {
  router.push({ name: 'category', params: { categoryId: category } });
};

// Handle channels click
const channelClickHandler = (channel) => {
  router.push({ name: 'channel', params: { userId: channel } });
};

// Highlight keyword
const highlightKeyword = (text, keyword) => {
  const regex = new RegExp(keyword, 'gi');
  return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
};
</script>
<style scoped>
::-webkit-scrollbar-thumb {
  background: #fff;
  border-radius: 5px;
}
::-webkit-scrollbar {
  width: 4px;
}
</style>
