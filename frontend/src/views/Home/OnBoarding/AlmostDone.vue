<template>
    <Dialog v-model:visible="visible" :draggable="false" modal :style="{ width: '568px' }" class="p-4 text-center relative">
        <template #header>
            <div class="mx-auto font-bold mb-2">
                You are almost done!
            </div>
        </template>
        <button class="cursor-pointer absolute top-4 right-4" @click="handleCloseModal">
            <CloseButton />
        </button>
        <!-- Thay đổi nút đóng -->
        <span class="block text-sm">Complete your profile now</span>
        <Button class="w-52 bg-primary-color p-2 hover:bg-primary-color-hover text-white block mx-auto mt-6 mb-2"
            @click="handleRouteProfile">
            <span class="font-bold">Setup profile</span>
        </Button>
        <Button label="Skip for now" text class="mt-2 text-primary-color text-sm" @click="handleCloseModal" />
    </Dialog>
</template>

<script setup>
import CloseButton from '@/components/UI/CloseButton.vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog'
import router from '@/router';
import { removeStatusVerifiedLS } from '@/utils/auth';

const store = useOnboardingStore()
const visible = ref(true);
const handleRouteProfile = () => {
    store.endShow()
    removeStatusVerifiedLS()
    router.push('/profile')
}

const handleCloseModal = () => {
    store.skipShow()
    removeStatusVerifiedLS()
}
</script>

<style></style>