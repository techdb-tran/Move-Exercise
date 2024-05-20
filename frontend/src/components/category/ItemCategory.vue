<template>
    <div class="h-full">
        <div class="relative" style="height: 205px" @click="toggleLikeCategory">
            <img :src="props.item.image_url" alt="" class="w-full h-full hover:cursor-pointer object-cover">
            <div class="w-full absolute top-0 category__bg--like h-full" :class="{ 'item--liked': liked }">
            </div>
            <img src="@/assets/images/heart.png" alt="" class="absolute category__heart"
                :class="{ 'item--liked': liked }">
        </div>
        <div class="font-bold mt-1 text-lg">{{ props.item.name }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    item: Object
})
import { ref } from 'vue'
const liked = ref(false)
const toggleLikeCategory = () => {
    liked.value = !liked.value
}

</script>

<style>
.category__bg--like {
    background-color: #13D0B4;
    opacity: 0.5;
    display: none
}

.category__heart {
    top: 40%;
    right: 40%;
    opacity: 1;
    display: none
}

.item--liked {
    display: block;

}
</style>
