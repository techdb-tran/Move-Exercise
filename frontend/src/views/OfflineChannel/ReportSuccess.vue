<template>
    <Dialog :visible="store.statusReport" :draggable="false" modal :style="{ width: '604px' }" class="p-4 relative">
        <template #header class="">
            <div class="flex-grow font-bold text-2xl">
                Thank you for reporting
            </div>
        </template>
        <button class="cursor-pointer absolute top-4 right-4" @click="store.endShow">
            <img src="@/assets/images/closebutton.png" alt="">
        </button>
        <div class="mt-4 text-sm leading-6 opacity-70">
            You reported the comment for:
        </div>
        <div class="mb-6 mt-0.5 pb-0.5">
            {{ store.reasonReport }}
        </div>
        <div class="text-xs opacity-60">
            If we find this channel violated
            <router-link to="/community-guidelines" class="underline underline-offset-1">Community Guidelines</router-link>,
            the user will be banned for 30 days
        </div>
        <div class="w-full text-center mt-6">
            <Button class="px-7 block mx-auto hover:bg-primary-color-hover bg-primary-color py-2 text-white"
                @click="store.endShow">
                <span class="font-bold">Close</span>
            </Button>
        </div>
    </Dialog>
    <Dialog :visible="!store.statusReport" :draggable="false" modal :style="{ width: '604px' }" class="p-4 relative">
        <template #header class="">
            <div class="flex-grow font-bold text-2xl">
                Report channel failed!
            </div>
        </template>
        <button class="cursor-pointer absolute top-4 right-4" @click="store.endShow">
            <img src="@/assets/images/closebutton.png" alt="">
        </button>
        <div class="mb-6 pb-0.5 mt-4">
            You have reported this account before!
        </div>
        <div class="text-xs opacity-60">
            If we find this channel violated
            <router-link to="/community-guidelines" class="underline underline-offset-1">Community Guidelines</router-link>,
            the user will be banned for 30 days
        </div>
        <div class="w-full text-center mt-6">
            <Button class="px-7 block mx-auto hover:bg-primary-color-hover bg-primary-color py-2 text-white"
                @click="store.endShow">
                <span class="font-bold">Close</span>
            </Button>
        </div>
    </Dialog>
</template>

<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useReportUser } from '@/stores/reportuser';
const store = useReportUser()
</script>
