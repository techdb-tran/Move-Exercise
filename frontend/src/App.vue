<script setup>
import { RouterView } from 'vue-router';
import LoginSignup from '@/views/login-signup/LoginSignup.vue';
import Suspended from '@/components/Suspended/Suspended.vue';
import PermaBan from '@/components/PermaBan/PermaBan.vue';
</script>

<template>
  <RouterView />

  <!-- import app to can turn on popup everywhere -->
  <LoginSignup />
  <Suspended />
  <PermaBan />
</template>
