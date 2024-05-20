<script setup>
import StarRating from '../UI/StarRating.vue';
import Tag from '../UI/Tag.vue';
import VerifiedBadge from '../UI/VerifiedBadge.vue';
import ViewCount from '../UI/ViewCount.vue';
import formatView from '@/utils/formatView';
import VideoDuration from '@/components/UI/VideoDuration.vue';
import durationToHms from '@/utils/durationToHms.js';
import { formatDistanceToNow } from 'date-fns';
import { RouterLink } from 'vue-router';

const props = defineProps({
  video: Object,
});

const date = new Date(props.video?.created_at);
</script>

<template>
  <RouterLink
    :to="{ name: 'video', params: { videoId: props.video?.id } }"
    class="videoCard"
    v-if="props.video.title"
  >
    <div class="imageDiv relative">
      <img v-if="props.video.thumbnail" :src="props.video?.thumbnail" :alt="props.video?.title" />
      <img v-else src="@/assets/images/defaultThumbnail.png" :alt="props.video?.title" />
      <ViewCount class="videoInfo left-0">{{ formatView(props.video?.count_view) }}</ViewCount>
      <VideoDuration class="videoInfo right-0">{{
        durationToHms(props.video?.duration_time)
      }}</VideoDuration>
    </div>
    <div class="descDiv flex gap-2 justify-start mt-2">
      <div class="avatar w-9 h-9 rounded-full min-w-9 min-h-9 overflow-clip">
        <img
          :src="props.video?.user?.avatar_url"
          :alt="props.video?.user?.username"
          class="rounded-full min-h-full"
        />
      </div>
      <div class="textDiv pt-1">
        <h3 class="font-bold mb-2 line-clamp-2">{{ props.video?.title }}</h3>
        <div class="flex gap-2 items-center">
          <p class="paragraph">{{ props.video?.user?.username }}</p>
          <VerifiedBadge v-if="props.video?.user?.is_verified" class="mb-[0.15rem]" />
        </div>
        <p class="paragraph">
          {{ props.video?.category_name }} <b>&#183;</b> Posted
          {{ formatDistanceToNow(date, { addSuffix: true }) }}
        </p>
        <div class="tagDiv flex gap-1 mt-2">
          <Tag>{{ props.video?.level }}</Tag>
          <Tag>{{ props.video?.duration }}</Tag>
        </div>
      </div>
      <div class="ratingDiv">
        <StarRating class="pt-[0.35rem]">{{
          Math.ceil(props.video?.average_rates * 10) / 10
        }}</StarRating>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.imageDiv {
  aspect-ratio: 16 / 9;
  overflow: clip;
  display: flex;
  justify-content: center;
  background-color: var(--primary-black-color);
}

.imageDiv img {
  height: 100%;
  max-width: 100%;
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
