<template>
  <Dialog
    :visible="visible"
    :draggable="false"
    modal
    :style="{ width: '568px' }"
    class="p-4 relative"
  >
    <template #header>
      <div class="font-bold mb-1">First, let's create your username!</div>
    </template>
    <button class="cursor-pointer absolute top-4 right-4" @click="handleCloseModal">
      <CloseButton />
    </button>
    <span class="text-sm">
      This is the name people will know you by on MOVE. Username must be between 4 and 25
      characters. Don't worry, you can always update your username later.
    </span>
    <p class="mt-7 mb-1 text-sm">Suggested username</p>
    <InputText
      class="w-full p-2 border border-primary-color"
      placeholder="Enter your username"
      v-model="username"
      :class="{ invalid: valid !== 0 }"
      @input="handleValidateUsername"
    />
    <InlineMessage
      severity="secondary"
      class="mess--error w-full mt-2 text-center"
      v-if="valid > 0"
    >
      <span v-if="valid === 1"
        >The <span class="font-bold">{{ username }}</span> has been taken. Try another
        username</span
      >
      <span v-if="valid === 3">Username is a required field</span>
      <span v-if="valid === 4">Username must be at least 4 characters</span>
      <span v-if="valid === 5">Username must be at most 25 characters</span>
      <span v-if="valid === 2">The username can only contain letters and numbers</span>
    </InlineMessage>
    <div class="w-full text-center mt-6 create__control">
      <Button
        class="px-20 py-2 block mx-auto hover:bg-primary-color-hover bg-primary-color text-white"
        @click="handleCreateName"
        :class="{ disableButton: username.length === 0 || valid !== 0 }"
      >
        <span class="font-bold">Next</span>
      </Button>
      <Button
        label="Maybe later"
        text
        class="mt-4 text-primary-color text-sm"
        @click="store.nextStep"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, toRaw } from 'vue';
import CloseButton from '@/components/UI/CloseButton.vue';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useOnboardingStore } from '@/stores/onboarding';
import { removeStatusVerifiedLS, getClientIdFromLS } from '@/utils/auth';
import http from '@/utils/http';
import { useProfileStore } from '@/stores/profile.js';
import { setUserInformationToLs } from '@/utils/auth.js';

const store = useOnboardingStore();
const visible = ref(true);
const valid = ref(0);
const username = ref('');
const userId = getClientIdFromLS();
const pattern = /^[a-zA-Z0-9]+$/;
const handleValidateUsername = () => {
  if (username.value.length === 0) {
    valid.value = 3;
  } else if (!pattern.test(username.value)) {
    valid.value = 2;
  } else if (username.value.length < 4) {
    valid.value = 4;
  } else if (username.value.length > 24) {
    valid.value = 5;
  } else valid.value = 0;
};
const profileStore = useProfileStore();

const handleCreateName = async () => {
  try {
    await http.phpInstance.put(`users/${userId}`, {
      username: toRaw(username.value),
    });
    await profileStore.getProfile();
    setUserInformationToLs(profileStore.profileData);
    store.nextStep();
  } catch (err) {
    valid.value = 1;
  }
};

const handleCloseModal = () => {
  store.skipShow();
  removeStatusVerifiedLS();
};
</script>

<style scoped>
.mess--error {
  background-color: #ffeff1;
  border: #ff8092 1px solid;
}

.invalid {
  border: #ff8092 1px solid;
  outline: #ff8092;
}

.disableButton {
  pointer-events: none;
}
</style>
