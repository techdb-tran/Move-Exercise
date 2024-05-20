<template>
    <Dialog v-model:visible="visible" :draggable="false" modal :style="{ width: '568px' }" class="p-4 text-center relative">
        <template #header class>
            <div class="mx-auto">
                <img src="@/assets/images/logo.png" alt="" class="mt-0.5">
            </div>
        </template>
        <button class="cursor-pointer absolute top-4 right-4" @click="handleCloseModal">
            <CloseButton/>
        </button> 
        <span class="font-bold mt-3.5 block">Happy to have you on MOVE</span>
        <span class="block mb-8 mt-2 text-sm">
            We are very excited for you to be part of the largest
            fitness streaming platform. Let's get started by figuring out what you're into.</span>
        <Button class="w-44 bg-primary-color p-2 hover:bg-primary-color-hover text-white text-center" @click="store.nextStep">
            <span class="font-bold block mx-auto">Let's get started</span>
        </Button>
    </Dialog>
</template>

<script setup>
import CloseButton from '@/components/UI/CloseButton.vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { removeStatusVerifiedLS } from '@/utils/auth';
const store = useOnboardingStore()
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog'
const visible = ref(true);
const handleCloseModal = () => {
    store.skipShow()
    removeStatusVerifiedLS()
}
</script>

<style scoped></style>