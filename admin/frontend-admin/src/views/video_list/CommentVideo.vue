<template>
  <div class="mx-auto">
    <div v-for="item in listComment" :key="item.id">
      <ItemComment :item="item" @reRenderComment="reRenderComment" />
    </div>
  </div>
</template>
<script setup>
import ItemComment from '@/components/video-components/ItemComment.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios'

const props = defineProps({
  idVideo: Number
})
const urlUserPHP = import.meta.env.VITE_URL_API_PHP_USER
const listComment = ref();
const getCommentVideo = async () => {
  const res = await axios.get(`${urlUserPHP}/videos/${props.idVideo}`);
  listComment.value = res.data.data.comments;
};

const reRenderComment = () => {
  getCommentVideo();
};

onMounted(() => {
  getCommentVideo()
})
</script>

<style>
.comment__avatar {
  margin-right: 12px;
}

.comment__content > .p-inputtext {
  border-radius: unset;
  box-shadow: unset;
  border-bottom: 1px solid #000;
}
</style>
