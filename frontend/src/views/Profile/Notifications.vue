<template>
  <form @submit.prevent="onSubmit">
    <div>
      <h2 class="font-bold text-sm mt-4">All notifications</h2>
      <p class="font-light mt-2 w-[680px] text-sm">
        Get notified on updates that are relevant to you! You may also receive additional emails for
        any updates on MOVE.
      </p>
      <div>
        <label for="all_notification"></label>
        <div class="flex gap-4 mt-4">
          <InputRadioButton name="all_notification" id="yes_all" :value="true" label="Yes" />
          <InputRadioButton name="all_notification" id="no_all" :value="false" label="No" />
        </div>
      </div>
    </div>
    <Transition>
      <div v-show="values.all_notification === true">
        <div class="mt-5">
          <h2 class="font-bold text-sm mt-4">Followers notification</h2>
          <p class="font-light mt-2 text-sm">Notify me when someone follows my channel</p>
          <div>
            <label for="follow_notifications"></label>
            <div class="flex gap-4 mt-4">
              <InputRadioButton
                name="follow_notifications"
                id="yes_follower"
                :value="true"
                label="Yes"
              />
              <InputRadioButton
                name="follow_notifications"
                id="no_follower"
                :value="false"
                label="No"
              />
            </div>
          </div>
        </div>
        <div class="mt-5"></div>
        <h2 class="font-bold text-sm mt-4">Comments notification</h2>
        <p class="font-light mt-2 text-sm">
          Notify me when someone comments or replies to my comment
        </p>
        <div>
          <label for="comment_notifications"></label>
          <div class="flex gap-4 mt-4">
            <InputRadioButton
              name="comment_notifications"
              id="yes_comment"
              :value="true"
              label="Yes"
            />
            <InputRadioButton
              name="comment_notifications"
              id="no_comment"
              :value="false"
              label="No"
            />
          </div>
        </div>
      </div>
    </Transition>
    <Button :isSubmitted="true">Save settings</Button>
    <Dialog
      :draggable="false"
      v-model:visible="settingNotificationSuccess"
      modal
      :style="{ width: '25rem' }"
      class="p-4"
    >
      <template #header>
        <div class="font-bold font-sans -translate-y-2 text-[17px]">Save setting profile</div>
      </template>
      <span
        @click="settingNotificationSuccess = false"
        class="button--close absolute top-4 right-4 cursor-pointer"
      >
        <img src="@/assets/images/closebutton.png" alt="" />
      </span>
      <span class="p-text-secondary block mt-2 mb-4 text-[15px]"
        >Your profile has been successfully updated.</span
      >
      <div class="flex justify-center gap-2">
        <CustomButton
          @click="hanldeSuccessSaveSetting"
          class="flex items-center rounded-sm w-[238px] h-[40px] bg-primary-color text-white font-bold justify-center cursor-pointer"
          >Okay</CustomButton
        >
      </div>
    </Dialog>
  </form>
</template>

<script setup>
import InputRadioButton from '../../components/InputRadioButton/InputRadioButton.vue';
import { useForm } from 'vee-validate';
import Button from '../../components/Button/Button.vue';
import { onBeforeMount, watch } from 'vue';
import { useProfileStore } from '../../stores/profile.js';
import { storeToRefs } from 'pinia';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';

const router = useRouter();
const profileStore = useProfileStore();
const { settingNotificationSuccess, notification } = storeToRefs(profileStore);

const { handleSubmit, values, setFieldValue, setValues } = useForm({
  initialValues: {
    all_notification: null,
    follow_notifications: null,
    comment_notifications: null,
  },
});

const onSubmit = handleSubmit((values) => {
  delete values.all_notification;
  profileStore.patchNotificationApi(values);
});

watch(
  () => values.all_notification,
  (newValue) => {
    if (newValue === false) {
      setFieldValue('follow_notifications', false);
      setFieldValue('comment_notifications', false);
    }
  },
);

onBeforeMount(async () => {
  await profileStore.getNotificationApi();
  setValues({
    follow_notifications: notification?.value?.follow_notifications,
    comment_notifications: notification?.value?.comment_notifications,
  });
  if (values.follow_notifications === false && values.comment_notifications === false) {
    setValues({ all_notification: false });
  }
  if (
    (values.follow_notifications === true && values.comment_notifications === false) ||
    (values.follow_notifications === true && values.comment_notifications === true) ||
    (values.follow_notifications === false && values.comment_notifications === true)
  ) {
    setValues({ all_notification: true });
  }
});

const hanldeSuccessSaveSetting = () => {
  settingNotificationSuccess.value = false;
  router.push('/');
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.8s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
