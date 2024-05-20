<script setup></script>

<template>
  <div class="dot-flashing"></div>
</template>

<style scoped>
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: var(--primary-color-hover);
  color: var(--primary-color-hover);
  animation: dot-flashing 0.5s infinite linear alternate;
  animation-delay: 0.25s;
}
.dot-flashing::before,
.dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}
.dot-flashing::before {
  left: -18px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: var(--primary-color-hover);
  color: var(--primary-color-hover);
  animation: dot-flashing 0.5s infinite alternate;
  animation-delay: 0s;
}
.dot-flashing::after {
  left: 18px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: var(--primary-color-hover);
  color: var(--primary-color-hover);
  animation: dot-flashing 0.5s infinite alternate;
  animation-delay: 0.5s;
}

@keyframes dot-flashing {
  0% {
    background-color: var(--primary-color-hover);
  }
  50%,
  100% {
    background-color: var(--primary-color);
  }
}
</style>
