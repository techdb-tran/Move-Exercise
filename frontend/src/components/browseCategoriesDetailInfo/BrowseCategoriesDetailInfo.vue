<template>
  <img
    :src="infoCategory && infoCategory.image_url"
    alt="category image"
    class="w-[15%] h-[208px]"
  />
  <div class="ml-6">
    <div class="font-bold text-2xl">{{ infoCategory && infoCategory.name }}</div>
    <div class="text-primary-text-color font-bold flex items-center">
      <span>{{ infoCategory && formatView(infoCategory.total_views) }} views</span
      ><span class="w-1 h-1 rounded-full inline-block bg-primary-text-color mx-2"></span
      ><span>{{ infoCategory && infoCategory.total_followers }} followers</span>
    </div>
    <div class="flex items-center mt-4">
      <button class="flex items-center" @click="toggleFollowCategory">
        <FollowingIcon v-if="followed" />
        <NotFollowingIcon v-else />
        <span class="text-primary-color font-bold ml-2">FOLLOW</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import FollowingIcon from '/src/components/UI/FollowingIcon.vue';
import NotFollowingIcon from '/src/components/UI/NotFollowingIcon.vue';
import formatView from '@/utils/formatView';
import http from '@/utils/http.js';
import { useAuthStore } from '/src/stores/auth.js';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const followed = ref(null);
const infoCategory = ref(null);
const route = useRoute();
const categoryId = ref(route.params.categoryId);

const toggleFollowCategory = async () => {
  try {
    const res = await http.nodeInstance.post(`/follow/category/${categoryId.value}`);
    if (res.data.metadata.isFollowed) {
      followed.value = true;
    } else {
      followed.value = false;
    }
    loadInfoCategory();
  } catch (error) {
    if (error.response.status === 400) {
      authStore.setStep(1);
      authStore.setShowComponent(true);
    } else {
      console.log(error);
    }
  }
};
const checkFollowCategory = async () => {
  if (authStore.loggedIn) {
    try {
      const res = await http.nodeInstance.get(`/follow/category/${categoryId.value}`);
      if (res.data.metadata.isFollowed) {
        followed.value = true;
      } else {
        followed.value = false;
      }
    } catch (error) {
      console.log(error);
    }
  }
};
const loadInfoCategory = async () => {
  try {
    const res = await http.nodeInstance.get(`/categories/${categoryId.value}`);
    infoCategory.value = res.data.metadata;
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  checkFollowCategory();
  loadInfoCategory();
});
</script>

<style scoped></style>
