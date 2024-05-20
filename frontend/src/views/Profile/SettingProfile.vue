<template>
  <form v-if="profileStore.profileData" @submit.prevent="onSubmit">
    <div class="text-sm">
      <p>Profile picture</p>
      <img :src="previewImage" alt="" class="w-[56px] h-[56px] object-cover rounded-[50%] my-2" />
      <div class="image-upload">
        <input type="file" id="fileInput" @change="handleFileChange" />
        <label for="fileInput" class="text-primary-color font-medium cursor-pointer">
          Upload profile picture
        </label>
      </div>
    </div>

    <!-- UserName  -->
    <div class="mt-4"><Input label="Username" name="username" type="text" /></div>
    <!-- Email  -->
    <div class="mt-4">
      <Input label="Email" name="email" type="text" isDisabled />
    </div>

    <!-- FullName  -->
    <div class="mt-4">
      <Input label="Full name" name="fullname" type="text" />
    </div>

    <!-- Password  -->
    <div class="mt-4 text-sm">
      <h2>Password</h2>
      <ChangePassword />
    </div>
    <!-- Gender  -->
    <div class="mt-4 text-sm">
      <label for="gender">Gender</label>
      <div class="flex flex-wrap gap-3 mt-2">
        <InputRadioButton name="gender" id="male" value="male" label="Male" />
        <InputRadioButton id="female" name="gender" value="female" label="Female" />
        <InputRadioButton name="gender" id="other" value="other" label="Rather not say" />
      </div>
    </div>

    <!-- Date of birth  -->
    <div class="mt-4">
      <label for="birthday" class="text-sm">Date of birth</label>
      <div class="flex gap-4">
        <Calendar
          v-model="formData.birthday"
          view="year"
          :maxDate="new Date()"
          dateFormat="yy"
          placeholder="YY"
          panelClass="min-w-[15rem]"
          class="mt-2 rounded-lg w-[76px] h-[40px] text-sm border-[1px] border-[#ccc] outline-none"
          inputClass="px-[4px]"
          iconDisplay="input"
          showIcon
        />
        <Calendar
          v-model="formData.birthday"
          view="month"
          :maxDate="new Date()"
          dateFormat="M"
          placeholder="MM"
          panelClass="min-w-[15rem]"
          class="mt-2 rounded-lg w-[74px] h-[40px] text-[15px] placeholder:ml-2 border-[1px] border-[#ccc] outline-none cursor-pointer"
          inputClass="px-[5px]"
          iconDisplay="input"
          showIcon
        />
        <Calendar
          v-model="formData.birthday"
          view="date"
          :maxDate="new Date()"
          dateFormat="dd"
          placeholder="DD"
          panelClass="min-w-[15rem]"
          inputClass="px-[5px]"
          class="mt-2 w-[74px] rounded-lg h-[40px] text-[15px] border-[1px] border-[#ccc] outline-none"
          iconDisplay="input"
          showIcon
        />
      </div>
    </div>

    <div class="flex gap-6">
      <!-- Country  -->
      <div class="mt-4">
        <InputSelectOption
          label="Country"
          v-model="formData.country"
          @handleChange="handleCountryChange"
        >
          <option selected="selected" disabled value="">Please select country</option>
          <option
            v-for="(country, index) in profileStore.optionCountry"
            :key="index"
            :value="country?.iso2"
          >
            {{ country?.name }}
          </option>
        </InputSelectOption>
      </div>
      <!-- State  -->
      <div class="mt-4">
        <InputSelectOption
          label="State"
          v-model="formData.state"
          @handleChange="handleStatesChange"
        >
          <option selected="selected" disabled value="">Please select state</option>
          <option
            v-for="(state, index) in profileStore?.optionState"
            :key="index"
            :value="state?.iso2"
          >
            {{ state?.name }}
          </option>
        </InputSelectOption>
      </div>
    </div>

    <!-- City  -->
    <div class="mt-4">
      <InputSelectOption label="City" v-model="formData.city">
        <option selected="selected" disabled value="">Please select city</option>
        <option v-for="(city, index) in profileStore?.optionCity" :key="index" :value="city?.iso2">
          {{ city?.name }}
        </option>
      </InputSelectOption>
    </div>

    <Button :isSubmitted="isSubmitted">Save settings</Button>
    <Dialog
      :draggable="false"
      v-model:visible="profileStore.settingProfileSuccess"
      modal
      :style="{ width: '25rem' }"
      class="p-4"
    >
      <template #header>
        <div class="font-bold font-sans -translate-y-2 text-[17px]">Save setting profile</div>
      </template>
      <span
        @click="profileStore.settingProfileSuccess = false"
        class="button--close absolute top-4 right-4 cursor-pointer"
      >
        <img src="@/assets/images/closebutton.png" alt="" />
      </span>
      <span class="p-text-secondary block mt-2 mb-4 text-[15px]"
        >Your profile has been successfully updated.</span
      >
      <div class="flex justify-center gap-2">
        <CustomButton
          @click="handleSuccessUpdateProfile"
          class="flex w-[238px] h-[40px] bg-primary-color text-white font-bold justify-center cursor-pointer"
          >Okay</CustomButton
        >
      </div>
    </Dialog>
  </form>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Dialog from 'primevue/dialog';
import CustomButton from 'primevue/button';
import { useProfileStore } from '../../stores/profile.js';
import Calendar from 'primevue/calendar';
import Input from '../../components/Input/Input.vue';
import InputRadioButton from '../../components/InputRadioButton/InputRadioButton.vue';
import InputSelectOption from '../../components/InputSelectOption/InputSelectOption.vue';
import ChangePassword from './ChangePassword.vue';
import Button from '../../components/Button/Button.vue';
import noAvatar from '../../assets/images/noAvatar.png';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const profileStore = useProfileStore();

const { handleSubmit, values, setFieldValue, setValues } = useForm({
  initialValues: {
    email: '',
    username: '',
    avatar_url: '',
    fullname: '',
    gender: '',
    birthday: '',
    country: '',
    state: '',
    city: '',
  },
  validationSchema: yup.object({
    username: yup
      .string()
      .required()
      .min(4, 'Username must be at least 4 characters')
      .max(25, 'Username must be at most 25 characters')
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^[a-zA-Z0-9]+$/,
        'The username can only contain letters and numbers.',
      ),
    fullname: yup
      .string()
      .required()
      .min(3, 'Fullname must be at least 4 characters')
      .max(25, 'Fullname must be at most 25 characters'),
  }),
});

const formData = ref({
  birthday: '',
  country: '',
  state: '',
  city: '',
});
const previewImage = ref();
const isSubmitted = ref(false);
const file = ref(null);

// Upload avatar_url
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 1 * 1024 * 1024; // 1MB

  if (selectedFile) {
    if (!allowedFormats.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please select an image with JPEG, JPG, or PNG format.');
      return;
    }
    if (selectedFile.size > maxSize) {
      toast.error('File size exceeds the limit of 1MB. Please select a smaller image.');
      return;
    }
    file.value = selectedFile;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
    setFieldValue('avatar_url', file.value);
  } else {
    toast.error('No file selected.');
    file.value = null;
    previewImage.value = null;
  }
};

// Set FormData
watch(
  () => [
    formData.value.country,
    formData.value.state,
    formData.value.city,
    formData.value.birthday,
  ],
  () => {
    setFieldValue('country', formData.value.country);
    setFieldValue('state', formData.value.state);
    setFieldValue('city', formData.value.city);
    if (formData.value.birthday instanceof Date && !isNaN(formData.value.birthday.getTime())) {
      setFieldValue(
        'birthday',
        `${formData.value.birthday.getFullYear()}-${(formData.value.birthday.getMonth() + 1).toString().padStart(2, '0')}-${formData.value.birthday.getDate().toString().padStart(2, '0')}`,
      );
    } else {
      setFieldValue('birthday', '');
    }
  },
);

watch(
  () => formData.value.country,
  () => {
    if (formData.value.country) {
      profileStore.loadStates(formData.value.country);
      profileStore?.loadCities(formData.value.country, formData.value.state);
    }
  },
);

// unDisable submited
watch(
  () => [
    values.username,
    values.fullname,
    values.birthday,
    values.country,
    values.state,
    values.city,
  ],
  ([username, fullname, birthday, country, state, city]) => {
    isSubmitted.value =
      username !== '' &&
      fullname !== '' &&
      birthday !== '' &&
      country !== '' &&
      state !== '' &&
      city !== '';
  },
);
// Handle Submitted
const onSubmit = handleSubmit((values) => {
  delete values.email;
  profileStore.patchProfile(values);
});

// Dynamic Location
const birthdayFromBe = ref();
const parsedDate = ref();
const year = ref();
const month = ref();
const day = ref();

onBeforeMount(async () => {
  await profileStore.getProfile();
  profileStore.loadCountries();
  setValues({
    avatar_url: profileStore.profileData?.avatar_url,
    email: profileStore.profileData?.email,
    username: profileStore?.profileData?.username || '',
    fullname: profileStore?.profileData?.fullname || '   ',
    gender: profileStore?.profileData?.gender || '',
  });

  formData.value.country = profileStore?.profileData?.country || '';
  formData.value.state = profileStore?.profileData?.state || '';
  formData.value.city = profileStore?.profileData?.city || '';

  birthdayFromBe.value = profileStore?.profileData?.birthday;
  parsedDate.value = new Date(birthdayFromBe.value);
  year.value = parsedDate.value.getFullYear();
  month.value = parsedDate.value.getMonth() + 1;
  day.value = parsedDate.value.getDate();

  if (formData.value.country) {
    formData.value.birthday = new Date(year.value, month.value - 1, day.value);
  }

  previewImage.value = profileStore.profileData?.avatar_url || noAvatar;
});

//Handle Change Country
const handleCountryChange = () => {
  if (formData.value.country) {
    profileStore?.loadStates(formData.value.country);
    profileStore?.loadCities(formData.value.country, formData.value.state);
  }
};

//Handle Change State
const handleStatesChange = () => {
  if (formData.value.state) {
    profileStore.loadCities(formData.value.country, formData.value.state);
  }
};

// Handle Success Profile
const handleSuccessUpdateProfile = () => {
  router.push('/');
  profileStore.settingProfileSuccess = false;
};
</script>

<style scoped>
.image-upload input[type='file'] {
  display: none;
}

.p-tabview-ink-bar {
  height: 3px;
}
</style>
