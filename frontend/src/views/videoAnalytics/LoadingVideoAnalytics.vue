<template>
<div class="card">
  <div class="border-round border-1 surface-border p-4 surface-card">
    <div class="flex w-full mb-3">
      <Skeleton width="5rem" class="mb-2 mr-3"></Skeleton>
      <Skeleton width="15rem" class="mb-2 mr-3"></Skeleton>
      <Skeleton width="5rem" class="mb-2 mr-3"></Skeleton>
      <Skeleton width="5rem" class="mb-2 mr-3"></Skeleton>
      <Skeleton width="5rem" class="mb-2 mr-3"></Skeleton>
    </div>
    <Skeleton width="100%" height="400px"></Skeleton>
    <div class="flex w-full justify-between mt-3">
      <Skeleton width="4rem" height="2rem"></Skeleton>
      <Skeleton width="8rem" height="2rem"></Skeleton>
    </div>
  </div>
</div>
</template>
<script setup>
import Skeleton from 'primevue/skeleton';
</script>