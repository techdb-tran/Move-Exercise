<template>
  <vueVimeoPlayer
    :video-url="props.videoUrl"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
    player-width="full"
    player-height="500"
    :options="{
      byline: false,
      title: false,
      vimeo_logo: false,
    }"
 />
</template>

<script setup>
const props = defineProps({
  videoUrl: String
});

import { vueVimeoPlayer } from 'vue-vimeo-player';
</script>
