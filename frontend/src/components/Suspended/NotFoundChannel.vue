<template>
<div class="w-96 ml-[250px] mt-[261px] text-center">
    <h2 class="font-bold text-base">Channel not found!</h2>
    <p class="text-base">This account has been suspended due to a violation of
        our community guidelines</p>
    <Button :style="{ width: '200px', marginTop: '21px' }" class="mx-auto text-[15px]" :isSubmitted="true" @click="goToBrowseChannel">Browse channel</Button>
</div>
</template>
<script setup>
import Button from '../Button/Button.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const goToBrowseChannel = ()=>{
    router.push('/');
}
</script>