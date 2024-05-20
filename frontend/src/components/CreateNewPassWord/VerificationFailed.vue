<template>
<div class="flex flex-col">
    <header class="w-full bg-black h-16">
        <RouterLink to="/"><img class="m-auto mt-5 cursor-pointer" src="../../assets/images/logo-white.png" alt="logo white"></RouterLink>
    </header>
    <Card class="password-verification-failed">
        <template #title>
            <h2 class="text-black text-base">Verification failed</h2>
            <p class="text-sm text-black font-normal mt-3">Your account verification has expired. Please verify your
                account again to enjoy full access on MOVE.</p>
            <p class="text-sm text-black font-normal mt-4"><span @click="handleResendLink"
                    class="text-primary-color underline cursor-pointer">Resend verification email</span> to
                    <strong>{{ emailValue }}</strong></p>
            <div class="flex justify-center w-full text-base"><Button :style="{ width: '235px' }" :isSubmitted="true" @click="backToHome">Back to
                    home</Button></div>
        </template>
    </Card>
</div>
</template>
<script setup>
import Card from 'primevue/card'
import Button from '../Button/Button.vue';
import { useForgotPasswordStore } from '@/stores/forgotPassword';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue'
const store = useForgotPasswordStore();
const emailValue = ref('')
const handleResendLink = () => {
    store.handleSubmitForm(atob(`${route.params.email}`));
}
const props = defineProps({
    token: String,
    email: String
});
const route = useRoute();
const router = useRouter();
emailValue.value = atob(`${route.params.email}`);
const backToHome = ()=>{
    router.push('/')
}
</script>
<style scoped>
.password-verification-failed {
    box-shadow: 0 2px 8px rgb(219, 210, 210);
    width: 568px;
    height: 245px;
    margin: auto;
    margin-top: 240px;
}
</style>