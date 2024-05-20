<template>
  <div>
    <div class="bg-primary-black-color h-[56px] flex justify-center items-center">
      <RouterLink to="/"
        ><img class="w-[111px] h-6" src="/src/assets/images/logo-white.png" alt="Logo"
      /></RouterLink>
    </div>
    <div class="w-full flex justify-center">
      <div class="w-[1200px] h-[700px] flex justify-center items-center">
        <div class="text-xl">
          <div class="flex justify-center text-9xl">404</div>
          <div class="mt-4">Oops! The page you are looking for does not exist.</div>
          <RouterLink to="/"
            ><div class="text-primary-color flex justify-center text-2xl mt-6">
              Go back to Home
            </div></RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped></style>
