<template>
  <div class="justify-between text-center">
    <div class="">
      <div class="">
        <img :src="props.item.avatar_url" alt="avatar" class="mx-auto w-14 h-14 rounded-full" />
      </div>
      <div class="mt-4">
        <div class="flex items-center justify-center">
          <div class="mb-0.5 font-medium">
            {{ props.item.username }}
            <span v-if="props.item.id.toString() === clientId" class="font-semibold">(You)</span>
          </div>
          <VerifiedBadge class="ml-1.5" v-if="props.item.is_verified" />
        </div>
        <div class="text-xs font-normal">{{ props.item.follow_count }} followers</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue';
import { getClientIdFromLS } from '@/utils/auth';

const clientId = getClientIdFromLS();
const props = defineProps({
  item: Object,
});
</script>

<style scoped>
.verified--defined {
  top: 24px;
  box-shadow: 0px 0px 5px 1px var(--secondary-text-color);
  position: absolute;
  width: 380px;
  background-color: var(--primary-white-color);
  display: none;
}

.verified:hover .verified--defined {
  display: block;
}
</style>
