<template>
  <div class="card flex justify-content-center">
    <Button
      label="Change Password"
      @click="popupHandler"
      class="underline text-primary-color mt-1 text-sm"
    />
    <Dialog
      :draggable="false"
      v-model:visible="storeProfile.visible"
      modal
      :style="{ width: '27rem' }"
      class="relative p-4"
    >
      <template #header>
        <div class="font-bold -translate-y-1 text-[16px]">Change Password</div>
      </template>
      <button @click="handleClosePopup" class="button--close absolute top-3 right-4">
        <img src="@/assets/images/closebutton.png" alt="" />
      </button>
      <span class="block font-normal mb-4 text-sm max-w-[380px]"
        >Please enter your old and new password. Make sure your password is alphanumeric with at
        least 8 characters.</span
      >
      <!-- Old Password  -->
      <form>
        <Input
          type="password"
          label="Old password"
          name="password"
          inputWidth="392px"
          placeholder="Enter old password"
        />
        <!-- New Password  -->
        <div class="my-4">
          <Input
            type="password"
            label="New password"
            name="password_new"
            inputWidth="392px"
            placeholder="Enter new password"
          />
        </div>
        <!-- Comfirm Password  -->
        <Input
          type="password"
          label="Confirm new password"
          name="password_new_confirmation"
          inputWidth="392px"
          placeholder="Confirm new password"
        />

        <div class="flex justify-center gap-2">
          <Button
            @click="onSubmit"
            class="flex w-[238px] mt-6 h-[40px] bg-primary-color text-white font-bold justify-center"
            >Confirm</Button
          >
        </div>
      </form>
    </Dialog>
  </div>
  <Dialog
    :draggable="false"
    v-model:visible="storeProfile.visibleSuccess"
    modal
    :style="{ width: '25rem' }"
    class="p-4"
  >
    <template #header>
      <div class="font-bold font-sans -translate-y-2 text-[16px]">Change Password</div>
    </template>
    <span
      @click="handleClosePopupSuccess"
      class="button--close absolute top-4 right-4 cursor-pointer"
    >
      <img src="@/assets/images/closebutton.png" alt="" />
    </span>
    <span class="p-text-secondary block mt-2 mb-4 text-[15px]"
      >Your password has been successfully updated.</span
    >
    <div class="flex justify-center gap-2">
      <Button
        @click="hanldeSuccessChangePassword"
        class="flex w-[238px] h-[40px] bg-primary-color text-white font-bold justify-center cursor-pointer"
        >Okay</Button
      >
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Input from '../../components/Input/Input.vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useProfileStore } from '../../stores/profile.js';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const storeProfile = useProfileStore();
const router = useRouter();

const { visibleSuccess } = storeToRefs(useProfileStore);

const { handleSubmit } = useForm({
  initialValues: {
    password: '',
    password_new: '',
    password_new_confirmation: '',
  },
  validationSchema: yup.object({
    password: yup
      .string()
      .required('Old password is required')
      .min(8, 'Old password must be at least 8 characters'),
    password_new: yup.string().when('password', {
      is: (val) => val && val.length > 0,
      then: () =>
        yup
          .string()
          .required('New password is required')
          .test(
            'no-leading-trailing-space',
            'New password cannot have leading or trailing spaces',
            (value) => {
              if (!value) return true;
              return value === value.trim();
            },
          )
          .min(8, 'New password must be at least 8 characters')
          .matches(/[a-z]/, 'New password must contain at least one lowercase letter')
          .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
          .matches(/[0-9]/, 'New password must contain at least one number')
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            'New password must contain at least one special character',
          )
          .notOneOf([yup.ref('password')], 'New password must be different from old password'),
      otherwise: () => yup.string().required('New password is required'),
    }),
    password_new_confirmation: yup.string().when('password_new', {
      is: (value) => value && value.length > 0,
      then: () =>
        yup
          .string()
          .required('Confirm new password is required')
          .oneOf(
            [yup.ref('password_new'), null],
            'Confirm new password must match the new password ',
          ),
      otherwise: () => yup.string().required('Confirm new password is required'),
    }),
  }),
});

const popupHandler = () => {
  storeProfile.visible = true;
};

const handleClosePopup = () => {
  storeProfile.visible = false;
};

const handleClosePopupSuccess = () => {
  visibleSuccess.value = false;
};

const onSubmit = handleSubmit((values) => {
  storeProfile.changePassword(values);
});

const hanldeSuccessChangePassword = () => {
  storeProfile.visibleSuccess = false;
  router.push('/');
};
</script>

<style>
.p-dialog-header {
  cursor: grab;
}

.p-dialog-header:active {
  cursor: grabbing;
}

.button--close {
  cursor: pointer;
}
</style>
