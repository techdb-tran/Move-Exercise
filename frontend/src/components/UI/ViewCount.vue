<script setup></script>

<template>
  <div
    class="viewCount flex gap-2 items-center text-white fill-white bg-black rounded-[0.22rem] px-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12">
      <path
        id="Path_567"
        data-name="Path 567"
        d="M595.7,189.37a9.669,9.669,0,0,0-9,6.07,9.708,9.708,0,0,0,18,0,9.669,9.669,0,0,0-9-6.07m0,10.11a4.045,4.045,0,1,1,4.09-4.05,4.038,4.038,0,0,1-4.09,4.05Zm0-6.47a2.425,2.425,0,1,0,2.45,2.42,2.418,2.418,0,0,0-2.45-2.42"
        transform="translate(-586.7 -189.37)"
      />
    </svg>
    <p class="font-semibold"><slot></slot></p>
  </div>
</template>

<style scoped></style>
