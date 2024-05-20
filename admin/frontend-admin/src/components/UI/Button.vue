<template>
<button class="w-[230px] h-[40px] rounded-lg font-bold bg-[#13D0B4] flex justify-center items-center" 
    :class="{'bg-[#999999] text-[#ccc]': !props.isSubmitted,'bg-[#13D0B4] text-white': props.isSubmitted}" 
    :disabled="!isSubmitted" :style="{ width: props.width }">
    <slot></slot>
</button>
</template>

<script setup>
const props = defineProps({
    isSubmitted: Boolean,
    isDisabled: {
        type: Boolean,
        default: false,
    },
    width: {
        type: String,
        default: '230px',
    },
});
</script>

<style scoped></style>