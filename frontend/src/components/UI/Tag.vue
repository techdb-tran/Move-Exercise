<script setup>
import { useSlots } from 'vue';

const slots = useSlots();
let slotContent = slots.default()[0].children;

if (slotContent === 'less_than_30_mins') {
  slotContent = '< 30 mins';
} else if (slotContent === 'less_than_1_hour') {
  slotContent = '< 1 hour';
} else if (slotContent === 'more_than_1_hour') {
  slotContent = '> 1 hour';
}
</script>

<template>
  <span
    v-if="slotContent"
    class="py-[0.35rem] px-3 rounded-full bg-tag-background text-[10px] font-semibold min-w-16 inline-block text-center"
    >{{ slotContent }}
  </span>
</template>

<style scoped></style>
