<template>
<div class="flex flex-col">
    <header class="w-full bg-black h-16">
        <RouterLink to="/"><img class="m-auto mt-5 cursor-pointer" src="../../assets/images/logo-white.png" alt="logo white"></RouterLink>
    </header>
    <Card class="password-reset-successful">
        <template #title>
            <h3 class="text-base text-black">Password reset successful</h3>
            <p class="text-sm text-black font-normal">Good news! You are just few steps away to login to MOVE.
                Click on the button below to login.</p>
            <div class="flex justify-center w-full">
                <Button class="w-[238px] text-base" @click="gotoLogin" :isSubmitted="true">
                    Login
                </Button>
            </div>
        </template>
    </Card>
</div>
</template>
<script setup>
import Card from 'primevue/card'
import Button from '../Button/Button.vue'
import { useForgotPasswordStore } from '@/stores/forgotPassword';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useForgotPasswordStore();
const gotoLogin = () => {
    router.push('/');
    store.goToLoginPage()
}
</script>
<style scoped>
.password-reset-successful {
    box-shadow: 0 2px 8px rgb(219, 210, 210);
    width: 424px;
    height: 190px;
    margin: auto;
    margin-top: 240px;
}

</style>