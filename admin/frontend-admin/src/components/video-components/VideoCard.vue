<script setup>
import StarRating from '../UI/StarRating.vue'
import Tag from '../UI/Tag.vue'
import VerifiedBadge from '../UI/VerifiedBadge.vue'
import ViewCount from '../UI/ViewCount.vue'
import formatView from '@/utils/formatView'
import VideoDuration from '@/components/UI/VideoDuration.vue'
import durationToHms from '@/utils/durationToHms.js'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'vue-router'
import StarRating from '../UI/StarRating.vue'
import Tag from '../UI/Tag.vue'
import VerifiedBadge from '../UI/VerifiedBadge.vue'
import ViewCount from '../UI/ViewCount.vue'
import formatView from '@/utils/formatView'
import VideoDuration from '@/components/UI/VideoDuration.vue'
import durationToHms from '@/utils/durationToHms.js'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  video: Object
})

const date = new Date(props.video.postedAt)
const videoClickHandler = () => {
  router.push({ name: 'video', params: { videoId: props.video.id } })
}
</script>

<template>
  <div class="videoCard" @click="videoClickHandler">
    <div class="imageDiv relative">
      <img :src="props.video.image" :alt="props.video.title" />
      <ViewCount class="videoInfo left-0">{{ formatView(props.video.views) }}</ViewCount>
      <VideoDuration class="videoInfo right-0">{{
        durationToHms(props.video.duration)
      }}</VideoDuration>
    </div>
    <div class="descDiv flex gap-2 justify-start mt-2">
      <div class="avatar w-9 h-9">
        <img :src="props.video.avatar" :alt="props.video.uploader" class="rounded-full" />
      </div>
      <div class="textDiv pt-1">
        <h3 class="font-bold mb-2">{{ props.video.title }}</h3>
        <div class="flex gap-2 items-center">
          <p class="paragraph">{{ props.video.uploader }}</p>
          <VerifiedBadge v-if="props.video.verified" class="mb-[0.15rem]" />
        </div>
        <p class="paragraph">
          {{ props.video.category }} <b>&#183;</b> Posted
          {{ formatDistanceToNow(date, { addSuffix: true }) }}
        </p>
        <div class="tagDiv flex gap-1 mt-2">
          <Tag>{{ props.video.tag1 }}</Tag>
          <Tag>{{ props.video.tag2 }}</Tag>
        </div>
      </div>
      <div class="ratingDiv">
        <StarRating class="pt-[0.35rem]">{{ props.video.rating }}</StarRating>
      </div>
    </div>
  </div>
</template>

<style scoped>
.imageDiv {
  aspect-ratio: 16 / 9;
  overflow: clip;
}

.imageDiv img {
  width: 100%;
  object-fit: cover;
}

.videoInfo {
  position: absolute;
  bottom: 0.25rem;
  transform: scale(85%);
}

.ratingDiv {
  margin-left: auto;
}

.videoCard {
  cursor: pointer;
}

.videoCard:hover {
  opacity: 0.8;
}
</style>
