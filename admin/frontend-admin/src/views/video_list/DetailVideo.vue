<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    :closeOnEscape="true"
    :draggable="false"
    modal
    :style="{ width: '80%',  }"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <span>VIDEO DETAILS</span>
        <button @click="handleCloseModal">
          <CloseButton />
        </button>
      </div>
    </template>
    <div class="w-full">
      <VideoPlayer v-if="detailVideo?.url" :videoUrl="detailVideo.url" class="w-full flex justify-center"/>
    </div>
    <div class="pt-1">
      <h3 class="font-bold text-xl my-3">{{ detailVideo?.title }}</h3>
      <div class="flex gap-2 items-center">
        <div style="min-width: 40px; height: 40px">
          <img
            :src="detailVideo?.user?.avatar_url"
            :alt="detailVideo?.user?.username"
            class="rounded-full w-10 h-full"
          />
        </div>
        <div>
          <div class="flex items-center">
            <p class="paragraph font-bold mr-1">{{ detailVideo?.user?.username }}</p>
            <VerifiedBadge v-if="detailVideo?.user?.is_verified" class="mb-[0.15rem]" />
          </div>
          <p class="paragraph opacity-80">{{ detailVideo?.user?.total_follower }} follower</p>
        </div>
      </div>
      <div class="flex gap-1 mt-2">
        <Tag>{{ detailVideo?.level }}</Tag>
        <Tag v-if="detailVideo?.duration === 'less_than_30_mins'"> < 30 mins</Tag>
        <Tag v-if="detailVideo?.duration === 'less_than_1_hour'"> < 1 hour</Tag>
        <Tag v-if="detailVideo?.duration === 'more'"> > 1 hour</Tag>
      </div>
    </div>
    <div class="my-8 font-bold">COMMENTS</div>
    <CommentVideo v-if="detailVideo?.comments.length > 0" :idVideo="props.idVideo"/>
    <div v-else>No comment!</div>
  </Dialog>
</template>

<script setup>
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue'
import Tag from 'primevue/tag'
import CloseButton from '@/components/UI/CloseButton.vue'
import CommentVideo from '@/views/video_list/CommentVideo.vue'
import VideoPlayer from '@/components/video-components/VideoPlayer.vue'
import { onMounted, ref, toRaw, watch } from 'vue'
import Dialog from 'primevue/dialog'
import http from '@/api/http'

const detailVideo = ref()
const props = defineProps({
  idVideo: Number
})
const visible = ref(true)
const emits = defineEmits(['closeModal'])
const handleCloseModal = () => {
  emits('closeModal')
}

const getDetailVideo = async () => {
  const res = await http.phpUserInstance.get(`/videos/${props.idVideo}`)
  detailVideo.value = res.data.data
}

watch(
  () => props.idVideo,
  () => {
    getDetailVideo()
  }
)

onMounted(() => {
  getDetailVideo()
})
</script>
