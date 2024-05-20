<template>
  <label class="text-[15px]" :for="labelId">{{ props.label }}</label>
  <br />
  <div class="select relative w-[260px]">
    <select
      :id="labelId"
      :value="modelValue"
      @change="handleChangeValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="border-[1px] border-[#ccc] w-full h-[40px] px-2 rounded-lg mt-2 outline-none cursor-pointer relative z-[2] bg-transparent"
    >
      <slot />
    </select>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5 text-primary-color absolute right-3 top-5 z-[1]"
    >
      <path
        fill-rule="evenodd"
        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['label', 'modelValue']);

const emit = defineEmits(['handleChange']);

const handleChangeValue = () => {
  emit('handleChange');
};

const labelId = ref(`select-${Math.random().toString(36).substring(2, 15)}`);
</script>
<style scoped>
select {
  appearance: none;
}
</style>
