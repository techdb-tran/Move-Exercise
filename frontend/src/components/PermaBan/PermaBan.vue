<template>
<CardModel>
    <Dialog v-model:visible="storesPermaBan.isPermaBan" modal header="Reset password" :draggable="false"
        class="relative p-4">
        <template #header>
            <div>
                <div class="flex justify-between">
                    <div class="font-bold absolute top-4 left-4">You have been permanently banned.</div>
                </div>
            </div>
        </template>
        <CloseButton @click="closeModal" class="cursor-pointer absolute top-4 right-4" />
        <div class="alert-content">
            <p class="text-sm mt-6">Your account has been permanently banned due to violation of our
                <span class="text-primary-color underline cursor-pointer" @click="goToCommunity">Community
                    Guideline.</span>
            </p>
            <div class="flex justify-center">
                <Button class="close-btn" @click="closeModal" :isSubmitted="true">Close</Button>
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
import CloseButton from '@/assets/svg/CloseButton.vue';
import CardModel from '../CardModel/CardModel.vue';
import { usePermaBanStore } from '@/stores/permaBan';
import { useRouter } from 'vue-router';
const visible = ref(false);
const router = useRouter()
const storesPermaBan = usePermaBanStore();

function closeModal() {
    storesPermaBan.isPermaBan = false;
}
function goToCommunity() {
    storesPermaBan.isPermaBan = false;
    router.push('/community-guidelines');
}
</script>

<style scoped>
.alert-content {
    width: 542px;
}

.close-btn {
    width: 200px;
    margin-top: 29px;
}
</style>