<script setup>
import { vueVimeoPlayer } from 'vue-vimeo-player';
import Worker from '@/utils/countViewWorker?worker';
import { viewWorkerMsg } from '@/utils/countViewWorker';
import { postCreateVideoView } from '@/apis/videos.api';
import { toast } from 'vue3-toastify';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const BASE_URL_PHP = import.meta.env.VITE_URL_API_PHP;

const props = defineProps({
  video: Object,
});

const emit = defineEmits(['viewCounted']);

let worker = new Worker();
const viewTime = ref(0);
const viewId = ref(null);
const playerRef = ref(null);

// when view time passes 30s, create view entry
const createVideoView = async (data) => {
  // console.log(data);
  try {
    const response = await postCreateVideoView(props.video.id, data.viewTime);
    viewId.value = response.data.data.id;
    emit('viewCounted');
  } catch (error) {
    toast.error(`Error recording view count: ${error.message}`);
  }
};

worker.onmessage = function (e) {
  // Call API to backend to count view for this video
  if (e.data.message === viewWorkerMsg.VIEW_COUNTED) {
    createVideoView(e.data);
    viewTime.value = e.data.viewTime;

    // if received msg VIEW_TIME, then record current total view time
  } else if (e.data.message === viewWorkerMsg.VIEW_TIME) {
    viewTime.value = e.data.viewTime;
  }
};

const playingHandler = (event) => {
  worker.postMessage({
    message: viewWorkerMsg.START,
    duration: event.duration,
  });
};

const pauseHandler = () => {
  worker.postMessage({
    message: viewWorkerMsg.PAUSE,
  });
};

const endHandler = () => {
  worker.postMessage({
    message: viewWorkerMsg.END,
  });

  if (viewId.value) {
    fetchPutViewTime();
    viewId.value = null;
  }
};

// // Option 1: Call API every time viewTime is updated: more reliable but negatively impact server performance
// watch(viewTime, async () => {
//   if (!viewId.value) return;

//   try {
//     await putUpdateVideoView(viewId.value, viewTime.value);
//   } catch (error) {
//     toast.error(`Error recording view time: ${error.message}`);
//   }
// });

// Option 2: call API when user navigate to a different route, or when visibility changes: less reliable, but will call API less frequently
// Must use native Fetch API for the "keepalive" option as axios does not support this feature

const fetchPutViewTime = async () => {
  // console.log(`view time updated: ${viewTime.value}s`);
  try {
    await fetch(`${BASE_URL_PHP}viewvideos/${viewId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      keepalive: true,
      body: new URLSearchParams({
        time: viewTime.value,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

const visibilitychangeHandler = () => {
  if (document.hidden) {
    playerRef.value.pause();
    if (viewId.value) {
      fetchPutViewTime();
    }
  } else {
    playerRef.value.play();
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', visibilitychangeHandler);
});

onBeforeUnmount(() => {
  // kill count view worker on unmount
  worker.terminate();

  // remove document event listener
  document.removeEventListener('visibilitychange', visibilitychangeHandler);

  // Send API to update view time
  if (!viewId.value) return;
  fetchPutViewTime();

  // remove state value (not nessesary, but just in case)
  viewId.value = null;
  viewTime.value = 0;
});
</script>

<template>
  <div class="w-full max-h-[74vh]">
    <vueVimeoPlayer
      ref="playerRef"
      :video-url="video?.url"
      frameborder="0"
      class="vuePlayer"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      :options="{
        autoplay: true,
        byline: false,
        portrait: false,
        title: false,
        vimeo_logo: false,
        responsive: true,
        transparent: false,
      }"
      @playing="playingHandler($event)"
      @pause="pauseHandler()"
      @ended="endHandler()"
    />
  </div>
</template>

<style scoped>
:deep(.vuePlayer) {
  max-height: 74vh !important;
}

:deep(.vuePlayer > div:first-child) {
  max-height: 74vh !important;
  padding-top: 74vh !important;
}
</style>
