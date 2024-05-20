<template>
<CardModel>
    <Dialog v-model:visible="storeSuspended.isSuspended" modal header="Reset password" :draggable="false"
        class="relative p-4">
        <template #header>
            <div>
                <div class="flex justify-between">
                    <div class="text-black font-bold absolute top-4 left-4">You have been suspended</div>
                </div>
            </div>
        </template>
        <CloseButton @click="closeModal" class="cursor-pointer absolute top-4 right-4">
        </CloseButton>
        <div class="alert-content">
            <p class="text-sm mt-6">Your account has been temporarily suspended due to violation of our <span
                    class="text-primary-color underline cursor-pointer" @click="gotoCommunity">Community
                    Guideline</span>. Your
                suspension will end on
                <strong>{{ storeSuspended.valueExpireBan }}</strong>
            </p>
            <div class="flex justify-center">
                <Button class="" @click="closeModal" :isSubmitted="true">Close</Button>
            </div>
            <div class="flex justify-center text-primary-color text-sm mt-4 cursor-pointer"><span>Contact us</span>
            </div>
        </div>
    </Dialog>
</CardModel>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog';
import Button from '../Button/Button.vue';
import CloseButton from '../../assets/svg/CloseButton.vue';
import CardModel from '../CardModel/CardModel.vue';
import { useSuspendedStore } from '@/stores/suspended';
import { useRouter } from 'vue-router';

const storeSuspended = useSuspendedStore();
const router = useRouter();
function closeModal() {
    storeSuspended.isSuspended = false;
}
function gotoCommunity() {
    storeSuspended.isSuspended = false;
    router.push('/community-guidelines');
}
</script>
<style scoped>
.alert-content {
    width: 538px;
}

.close-btn {
    width: 200px;
    margin-top: 29px;
}
</style>