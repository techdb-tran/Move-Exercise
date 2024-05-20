<script setup>
import { ref, onMounted, computed } from 'vue';
import BlackBar from '../../components/UI/BlackBar.vue';
import formatView from '@/utils/formatView.js';
import VerifiedBadge from '../../components/UI/VerifiedBadge.vue';
import Tag from '@/components/UI/Tag.vue';
import StarRating from '@/components/UI/StarRating.vue';
import ViewCount from '@/components/UI/ViewCount.vue';
import { toast } from 'vue3-toastify';
import ChevronDownIcon from '@/components/UI/ChevronDownIcon.vue';
import { getFeaturedCarousel } from '@/apis/videos.api';
import { RouterLink } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
// import axios from 'axios';

const SLIDE_DELAY = 400;

const currentSlide = ref(3);
const slides = ref([]);
const leftBtn = ref(null);
const rightBtn = ref(null);
let transitionOn = ref(true);
let sliderInterval;

// compute clonedSlides array to implement infinite scholl, eg: [3, 4, 1, 2, 3, 4, 1, 2]
const clonedSlides = computed(() => {
  if (slides.value.length < 1) return [];
  const firstTwoItem = slides.value.slice(0, 2);
  const lastTwoItem = slides.value.slice(-2);
  const result = [...lastTwoItem, ...slides.value, ...firstTwoItem];
  return result;
});

// when there is only one featured slide, hide all buttons, disable next/prev slide function, only show 1 slide
const onlyOneSlide = computed(() => {
  if (slides.value.length === 1) {
    return true;
  } else {
    return false;
  }
});

const nextSlide = () => {
  if (onlyOneSlide.value) return;

  if (currentSlide.value === clonedSlides.value.length - 2) {
    currentSlide.value++;
    setTimeout(() => {
      transitionOn.value = false;
      currentSlide.value = 3;
    }, SLIDE_DELAY);
    setTimeout(() => {
      transitionOn.value = true;
    }, SLIDE_DELAY + 40);
  } else {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (onlyOneSlide.value) return;

  if (currentSlide.value === 3) {
    currentSlide.value--;
    setTimeout(() => {
      transitionOn.value = false;
      currentSlide.value = clonedSlides.value.length - 2;
    }, SLIDE_DELAY);
    setTimeout(() => {
      transitionOn.value = true;
    }, SLIDE_DELAY + 40);
  } else {
    currentSlide.value--;
  }
};

// on mounted, fecth data, and set interval to auto next slide

onMounted(async () => {
  sliderInterval = setInterval(() => {
    nextSlide();
  }, 5000);

  try {
    const response = await getFeaturedCarousel();

    slides.value = response.data.metadata;

    if (slides.value.length === 1) {
      clearInterval(sliderInterval);
    }
  } catch (error) {
    toast.error(`Error loading featured videos: ${error.message}`);
  }
});

// Left button handler
const leftBtnHandler = () => {
  leftBtn.value.disabled = true;
  clearInterval(sliderInterval);
  prevSlide();
  setTimeout(() => {
    leftBtn.value.disabled = false;
  }, SLIDE_DELAY + 50);
};

// Right button handler
const rightBtnHandler = () => {
  rightBtn.value.disabled = true;
  clearInterval(sliderInterval);
  nextSlide();
  setTimeout(() => {
    rightBtn.value.disabled = false;
  }, SLIDE_DELAY + 50);
};
</script>

<template>
  <BlackBar class="my-4" v-if="slides.length > 0">Featured</BlackBar>
  <section class="h-[315px] relative mt-12 mb-12" v-if="slides.length > 0">
    <!-- Button div -->
    <div class="btnDiv relative h-full w-[962px] m-auto">
      <button
        class="btn -left-4 pr-[0.1rem]"
        @click="leftBtnHandler"
        ref="leftBtn"
        v-if="!onlyOneSlide"
      >
        <ChevronDownIcon class="scale-[180%] rotate-90" />
      </button>
      <button
        class="btn -right-4 pl-[0.1rem]"
        @click="rightBtnHandler"
        ref="rightBtn"
        v-if="!onlyOneSlide"
      >
        <ChevronDownIcon class="scale-[180%] -rotate-90" />
      </button>
    </div>

    <!-- content -->
    <div
      :class="{
        slideCard: true,
        transition: transitionOn,
        z0: index === currentSlide || index + 2 === currentSlide,
        hideLeft: index + 1 < currentSlide,
        hidden: index + 1 < currentSlide && onlyOneSlide,
        hideRight: index + 1 > currentSlide,
      }"
      v-for="(slide, index) in clonedSlides"
      :key="`${slide.id}-${index}`"
    >
      <div
        :class="{
          overlay: true,
          overlayHide: index + 1 !== currentSlide,
        }"
      ></div>
      <RouterLink
        :to="{ name: 'video', params: { videoId: slide.video.id } }"
        class="slideCard--imageDiv cursor-pointer hover:opacity-80"
      >
        <img
          v-if="slide.video.thumbnail"
          :src="slide.video.thumbnail"
          :alt="slide.video.title"
          class="slideCard--image"
        />
        <img
          v-else
          src="@/assets/images/defaultThumbnail.png"
          :alt="slide.video.title"
          class="slideCard--image"
        />
      </RouterLink>
      <ViewCount class="viewCount absolute bottom-3 left-3">{{
        formatView(slide.video.count_view)
      }}</ViewCount>
      <div class="slide--textDiv w-[248px] h-[70%] my-auto px-6">
        <div class="flex gap-3">
          <RouterLink
            :to="{ name: 'channel', params: { userId: Number(slide.video.user.id) } }"
            class="avatarContainer rounded-full w-14 h-14 min-w-14 min-h-14 overflow-clip cursor-pointer hover:opacity-80"
          >
            <img
              :src="slide.video.user.avatar_url"
              :alt="slide.video.user.fullname"
              class="rounded-full min-h-full"
            />
            <!-- <img :src="slide.avatar_url" :alt="slide.uploader" class="rounded-full min-h-full" /> -->
          </RouterLink>
          <div class="slide--nameDiv">
            <div class="flex gap-2 max-w-[140px]">
              <RouterLink
                :to="{ name: 'channel', params: { userId: Number(slide.video.user.id) } }"
                class="cursor-pointer hover:underline hover:underline-offset-2 truncate"
              >
                {{ slide.video.user.username }}
              </RouterLink>
              <VerifiedBadge v-if="slide.video.user.is_verified" class="pt-1" />
            </div>

            <p class="paragraph truncate max-w-[140px]">{{ slide.video.Category?.name }}</p>
            <p class="paragraph line-clamp-2 max-w-[140px]">
              Posted
              {{ formatDistanceToNow(new Date(slide.video.created_at), { addSuffix: true }) }}
            </p>
            <StarRating class="mt-1">{{
              Math.ceil(slide.video.average_rates * 10) / 10
            }}</StarRating>
          </div>
        </div>
        <div class="slide--tagDiv mt-3 flex gap-1">
          <Tag>{{ slide.video.level }}</Tag>
          <Tag>{{ slide.video.duration }}</Tag>
        </div>
        <p class="slide--desc paragraph mt-4 line-clamp-3">{{ slide.video.title }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slideCard {
  width: 808px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.233);
  z-index: 2;
  background-color: white;
}

.transition {
  transition: transform 0.5s;
}

.hideLeft {
  z-index: -2;
  transform: translate(-62%, -50%) scale(0.85);
  box-shadow: none;
}

.hideRight {
  z-index: -2;
  transform: translate(-38%, -50%) scale(0.85);
  box-shadow: none;
}

.z0 {
  z-index: 0;
}

.hidden {
  display: none;
}

.overlayHide {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(138, 138, 138, 0.295);
  border-radius: 10px;
}

.btn {
  cursor: pointer;
  background: transparent;
  border: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.6rem;
  height: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  transition: all 0.3s;
}

.btn:hover {
  background-color: var(--tag-background);
}

.btn:enabled:active {
  background-color: var(--button-background-active);
}

.slideCard--imageDiv {
  height: 100%;
  width: 560px;
  border-radius: 10px 0 0 10px;
  overflow: clip;
  background-color: var(--primary-black-color);
  display: flex;
  justify-content: center;
}

.slideCard--image {
  min-height: 100%;
  max-width: 100%;
}
</style>
