<template>
  <Dialog :visible="visible" class="w-6/12 relative" modal :closable="false">
    <template #header>
      <p class="font-bold text-2xl mb-4">User detail</p>
    </template>
    <span class="cursor-pointer absolute top-6 right-6" @click="handleCloseModal">
      <CloseButton />
    </span>
    <!-- Avatar -->
    <div class="grid grid-cols-10 items-center">
      <p class="col-span-3 font-semibold">Profile picture:</p>
      <img :src="detailUser.avatar_url" alt="avatar-user" class="rounded-full w-16 h-16" />
    </div>
    <!-- UserName  -->
    <div class="mt-4 grid grid-cols-10 items-center">
      <label for="username" class="block col-span-3 font-semibold">Username:</label>
      <p class="">{{ detailUser.username }}</p>
    </div>
    <!-- Email  -->
    <div class="mt-4 grid grid-cols-10 items-center">
      <label for="username" class="block col-span-3 font-semibold">Email:</label>
      <p class="col-span-7">
        <a href="mailto:Diana@gmail.com">{{ detailUser.email }}</a>
      </p>
    </div>
    <!-- FullName  -->
    <div class="mt-4 grid grid-cols-10 items-center">
      <label for="username" class="block col-span-3 font-semibold">Full Name:</label>
      <p class="col-span-7">{{ detailUser.fullname }}</p>
    </div>
    <!-- Gender -->
    <div class="mt-4 grid grid-cols-10 items-center">
      <label for="username" class="block col-span-3 font-semibold">Gender:</label>
      <p class="col-span-7">{{ detailUser.gender }}</p>
    </div>
    <!-- Birthday -->
    <div class="mt-4 grid grid-cols-10 items-center">
      <label for="username" class="block col-span-3 font-semibold">Date of birth:</label>
      <p class="col-span-7">{{ getDateWithoutHour(detailUser.birthday) }}</p>
    </div>
    <!-- Address -->
    <div class="mt-4 grid grid-cols-10 items-center">
      <label for="username" class="block col-span-3 font-semibold">Address:</label>
      <p class="col-span-7">
        {{ detailUser.country }} - {{ detailUser.city }} - {{ detailUser.state }}
      </p>
    </div>
    <!-- Sign-up Date -->
    <div class="mt-4 grid grid-cols-10 items-center">
      <label for="username" class="block col-span-3 font-semibold">Sign-up date:</label>
      <p class="col-span-7">{{ getFullDate(detailUser.created_at) }}</p>
    </div>
    <!-- Status -->
    <div class="mt-4 card justify-content-center grid grid-cols-10 items-center">
      <label for="" class="block col-span-3 font-semibold">Status:</label>
      <Dropdown
        v-model="statusUser"
        :options="statusUserOption"
        optionLabel="name"
        :placeholder="statusUser.name"
        class="col-span-3 font-semibold"
        @change="handleChangeStatus"
      />
      <div
        class="relative col-span-4 flex items-center"
        :class="{ hidden: statusUser.name !== 'Suspend' }"
      >
        <label for="" class="text-nowrap ml-2">Number of days:</label>
        <div class="">
          <InputText
            type="text"
            v-model="numberBanDay"
            class="w-full ml-2"
            :class="{
              'border-error-border-color': errorStatus !== 0,
              'outline-error-border-color': errorStatus !== 0
            }"
            @input="handleInputTime"
          />
        </div>
        <div class="absolute top-10 left-2 mt-1 w-full">
          <InlineMessage
            severity="secondary"
            class="bg-error-background-color border-error-border-color w-full px-0 py-2"
            :class="{ hidden: errorStatus === 0 }"
            required
          >
            <span class="text-sm" v-if="errorStatus === 3">Number of days is required</span>
            <span class="text-sm" v-if="errorStatus === 1">Only numbers are allowed.</span>
            <span class="text-sm" v-if="errorStatus === 2">Number must more than 0 </span>
            <span class="text-sm" v-if="errorStatus === 4">Number must less than 999999 </span>
          </InlineMessage>
        </div>
      </div>
    </div>
    <!-- DayToActive -->
    <div
      class="card justify-content-center grid grid-cols-10 items-center"
      :class="{ hidden: statusUser.name !== 'Suspend' }"
    >
      <div class="col-span-3"></div>
      <div class="col-span-3 text-sm" v-if="isUnban === false">
        The account will be active on
        <div class="font-semibold">
          {{ timeToUnban }}
        </div>
      </div>
    </div>
    <!-- IsVerified -->
    <div class="mt-4 card justify-content-center grid grid-cols-10 items-center">
      <label for="" class="block col-span-3 font-semibold">Verified Badge:</label>
      <div
        class="col-span-3"
        v-tooltip="
          totalViewOfUser < 10
            ? 'The total views of users must be more than 10 to be verified badge'
            : ''
        "
      >
        <Dropdown
          v-model="isVerified"
          class="w-full font-semibold"
          :options="verified"
          optionLabel="name"
          :placeholder="isVerified === 1 ? 'Verified' : 'Not verified'"
          :disabled="totalViewOfUser < 10"
        />
      </div>
    </div>
    <Button
      label="Save setting"
      class="mx-auto block mt-8"
      @click="handleUpdateUserDetail"
      :disabled="errorStatus !== 0"
    />
  </Dialog>
</template>

<script setup>
import { defineProps, onMounted, watch } from 'vue';
import InlineMessage from 'primevue/inlinemessage';
import CloseButton from '@/components/UI/CloseButton.vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { ref, toRaw } from 'vue';
import http from '@/api/http';
import { useUserListStore } from '@/store/storeUserList.js';
import { useReportListStore } from '@/store/storeReportList.js';

const props = defineProps({
  id: Number,
  lazyParams: Object,
  loadLazyData: Function
});
const emit = defineEmits(['closeModal', 'toastDetail']);
const totalViewOfUser = ref();
const statusUser = ref({});
const numberBanDay = ref('');
const isVerified = ref({});
const isUnban = ref('');
const timeToUnban = ref(null);
const userListStore = useUserListStore();
const reportListStore = useReportListStore();
const detailUser = ref([]);
const statusUserOption = ref([
  { name: 'Active', code: 'Active' },
  { name: 'Suspend', code: 'Suspend' },
  { name: 'Perma ban', code: 'Permaban' }
]);
const verified = ref([
  { name: 'Verified', code: 1 },
  { name: 'Not verified', code: 0 }
]);
const errorStatus = ref(0);
const visible = ref(true);

watch(
  () => props.id,
  () => {
    getDetailUser();
    getTotalViewOfUser();
  }
);

const getDetailUser = async () => {
  const data = await http.phpInstance.get(`/users/${props.id}`);
  detailUser.value = data.data.data;
  const banStatus = detailUser.value.ban.is_permaban;
  const timeBan = detailUser.value.ban.ban_expired_at;
  const timeUpdate = detailUser.value.ban.updated_at;
  numberBanDay.value = returnBanDays(timeBan, timeUpdate);
  returnStatusUser(banStatus, timeBan);
  returnDayToActive(timeBan);
  if (detailUser.value.is_verified === 1) {
    isVerified.value.name = 'Verified';
    isVerified.value.code = 1;
  } else {
    isVerified.value.name = 'Not verified';
    isVerified.value.code = 0;
  }
};

const getTotalViewOfUser = async () => {
  const data = await http.nodeInstance.get(`users/total-view/${props.id}`);
  totalViewOfUser.value = data.data.metadata ? data.data.metadata : 0;
};

const handleUpdateUserDetail = async () => {
  const dataChange = {
    status: toRaw(statusUser.value).code,
    expire_ban: toRaw(numberBanDay.value) ? toRaw(numberBanDay.value) : 0,
    is_verified: toRaw(isVerified.value).code
  };
  await http.phpInstance.put(`/users/${props.id}`, dataChange);
  emit('closeModal');
  emit('toastDetail');
  console.log(reportListStore.valueSearch);
  props.loadLazyData(
    userListStore.urlExport
      ? `1${userListStore.urlExport}`
      : { page: 1, searchItem: reportListStore.valueSearch }
  );
};

const handleChangeStatus = () => {
  errorStatus.value = 0;
};

const handleInputTime = () => {
  {
    if (numberBanDay.value.length === 0) errorStatus.value = 3;
    else if (/^0+$/.test(numberBanDay.value)) errorStatus.value = 2;
    else if (!/^[0-9]*$/.test(numberBanDay.value)) errorStatus.value = 1;
    else if (numberBanDay.value > 999999) errorStatus.value = 4;
    else errorStatus.value = 0;
  }
};

const handleCloseModal = () => {
  emit('closeModal');
};

const returnDayToActive = (time) => {
  const timeToDay = new Date().getTime() / 1000;
  if (time > timeToDay) {
    timeToUnban.value = getFullDate(time);
    isUnban.value = false;
  } else {
    timeToUnban.value = '';
    isUnban.value = true;
  }
};

const returnBanDays = (banTime) => {
  const timeToDay = new Date().getTime() / 1000;
  if (banTime < timeToDay) {
    return 1;
  } else {
    const differenceInMs = banTime - timeToDay;
    const millisecondsPerDay = 24 * 60 * 60;
    const differenceInDays = Math.round(differenceInMs / millisecondsPerDay);
    if (differenceInDays < 1) {
      return 1;
    } else return differenceInDays;
  }
};

const returnStatusUser = (banStatus, timeBan) => {
  const timeToDay = new Date().getTime() / 1000;
  if (banStatus === 0 && timeBan < timeToDay) {
    statusUser.value.name = 'Active';
    statusUser.value.code = 'Active';
  } else if (banStatus === 0 && timeBan > timeToDay) {
    statusUser.value.name = 'Suspend';
    statusUser.value.code = 'Suspend';
  } else {
    statusUser.value.name = 'Perma ban';
    statusUser.value.code = 'Permaban';
  }
};

const getFullDate = (dateNum) => {
  let date = new Date(dateNum * 1000);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let dateString = day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + second;
  return dateString;
};

const getDateWithoutHour = (dateNum) => {
  let date = new Date((dateNum - 25200) * 1000);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let dateString = day + '/' + month + '/' + year;
  return dateString;
};

onMounted(() => {
  getDetailUser();
  getTotalViewOfUser();
});
</script>

<style scoped></style>
