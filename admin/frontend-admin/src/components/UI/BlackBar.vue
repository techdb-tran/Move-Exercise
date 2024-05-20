<script setup></script>

<template>
  <div class="flex content-center items-center gap-8 justify z-0">
    <h2 class="title text-nowrap" v-if="$slots.default">
      <slot></slot>
    </h2>
    <div class="blackBar w-full bg-black h-2 relative content-center"></div>
  </div>
</template>

<style scoped>
.blackBar:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0.5rem;
  width: 5.8rem;
  height: 100%;
  background: repeating-linear-gradient(-45deg, black, black 0.5rem, white 0.5rem, white 1rem);
}
</style>
