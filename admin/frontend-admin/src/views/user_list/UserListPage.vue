<template>
  <div class="card overflow-scroll p-10">
    <div class="mb-10">
      <BlackBar><h1 class="text-4xl font-bold">User List</h1></BlackBar>
    </div>
    <div v-if="userListStore.isLoading">
      <div v-for="index in 15" :key="index">
        <Skeleton class="mt-3 w-full" height="3rem"></Skeleton>
      </div>
    </div>
    <DataTable
      :value="userList"
      stripedRows
      paginator
      :rows="15"
      tableStyle="min-width: 50rem"
      
      :totalRecords="totalRow"
      :pageLinkSize="10"
      lazy
      @page="onPage($event)"
      v-model:filters="filters"
      :globalFilterFields="['country']"
      filterDisplay="menu"
      :rowsPerPageOptions="[5, 15, 30, 50]"
      :sortable="true"
      @sort="handleSort"
      removableSort
      v-if="!userListStore.isLoading"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            :disabled="userList?.length === 0"
            icon="pi pi-external-link"
            label="Export"
            @click="exportCSV($event)"
          />
          <IconField iconPosition="left">
            <InputIcon class="flex items-center">
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="valueSearch" placeholder="Keyword Search" @keyup="searchTable" />
          </IconField>
        </div>
      </template>
      <template #empty>No users found.</template>
      <Column field="" header="No.">
        <template #body="slotProps">
          <div class="flex justify-center">
            {{ slotProps.data.index }}
          </div>
        </template>
      </Column>
      <Column field="username" header="Channel Name" sortable style="width: 176px">
        <template #body="slotProps">
          <div class="flex items-center gap-2 w-44">
            <img
              :src="slotProps.data.avatar_url"
              class="w-[50px] h-[50px] object-cover rounded-[50%] my-2"
            />
            <span class="truncate" v-tooltip.top="slotProps.data.username">{{
              slotProps.data.username
            }}</span>
            <VerifiedBadgeIcon v-show="slotProps.data.is_verified" />
          </div>
        </template>
      </Column>
      <Column field="email" header="Email" sortable class="w-60">
        <template #body="slotProps">
          <div class="w-60 truncate">
            <span class="truncate" v-tooltip.top="slotProps.data.email">{{
              slotProps.data.email
            }}</span>
          </div>
        </template>
      </Column>
      <Column field="country" header="Country" :showFilterMatchModes="false">
        <template #body="slotProps">
          <div class="flex justify-center">
            <span class="text-nowrap">{{ convertCountry(slotProps.data.country) }}</span>
          </div>
        </template>
        <template #filter="">
          <Dropdown
            v-model="filterModel"
            :options="countries"
            optionLabel="name"
            placeholder="Select a Country"
            class="p-column-filter"
          />
        </template>
        <template #filterclear="{ filterCallback }">
          <Button
            type="button"
            @click="filterCallback(filterCountryTable('clear'))"
            severity="secondary"
            >Clear</Button
          >
        </template>
        <template #filterapply="{ filterCallback }">
          <Button
            type="button"
            @click="filterCallback(filterCountryTable('apply'))"
            severity="success"
            >Apply</Button
          >
        </template>
      </Column>
      <Column field="created_at" header="Registration Date" sortable class="text-nowrap">
        <template #body="slotProps">
          <div class="text-nowrap">
            {{ convertDate(slotProps.data.created_at) }}
          </div>
        </template>
      </Column>
      <Column field="status" header="Status Channel" sortable>
        <template #body="slotProps">
          <div>
            <Tag
              severity="info"
              value="INACTIVE"
              class="w-full"
              v-show="slotProps.data.status === 'not activated'"
            />
            <Tag
              severity="danger"
              value="BAN"
              class="w-full"
              v-show="slotProps.data.status === 'permaban'"
            />
            <Tag
              severity="warning"
              value="SUSPEND"
              class="w-full"
              v-show="slotProps.data.status === 'temporarily blocked'"
            />
            <Tag value="ACTIVE" class="w-full" v-show="slotProps.data.status === 'activated'" />
          </div>
        </template>
      </Column>
      <Column field="total_video" header="Videos" sortable>
        <template #body="slotProps">
          <div class="flex justify-center">
            {{ slotProps.data.total_video }}
          </div>
        </template>
      </Column>
      <Column field="total_view" header="Views">
        <template #body="slotProps">
          <div class="flex justify-center">
            {{ slotProps.data.total_view ? slotProps.data.total_view : '0' }}
          </div>
        </template>
      </Column>
      <Column field="total_follower" header="Followers" sortable>
        <template #body="slotProps">
          <div class="flex justify-center">
            {{ slotProps.data.total_followers }}
          </div>
        </template>
      </Column>
      <Column header="User detail">
        <template #body="slotProps">
          <div class="flex justify-end">
            <Button
              icon="pi pi-user"
              outlined
              rounded
              class="mr-2"
              @click="detailUser(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <DetailUser
    :id="idDetailUser"
    :lazyParams="lazyParams"
    :loadLazyData="loadLazyData"
    v-if="isOpenModal"
    @closeModal="closeModal"
    @toastDetail="toastSetDetail"
  />
  <Toast />
</template>

<script setup>
import DetailUser from '@/components/detailuser/DetailUser.vue';
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import http from '@/api/http.js';
import BlackBar from '@/components/UI/BlackBar.vue';
import VerifiedBadgeIcon from '@/assets/svg/VerifiedBadgeIcon.vue';
import { useUserListStore } from '@/store/storeUserList.js';
import Skeleton from 'primevue/skeleton';
const CURL_LOCATION = import.meta.env.VITE_URL_CURL_LOCATION;
const CKEY_LOCATION = import.meta.env.VITE_URL_CKEY_LOCATION;

const toast = useToast();
const userList = ref();
const loadingTableData = ref(true);
const totalRow = ref();
const lazyParams = ref({});
const first = ref(0);
const isOpenModal = ref(false);
const idDetailUser = ref('');
let timeoutSearchTable;
const valueSearch = ref();
const filterModel = ref();
const limitPaginator = ref(15);
const userListStore = useUserListStore();
const countries = ref([{ name: 'Unknown', code: 'unknown' }]);

const filters = ref({
  country: { value: null, matchMode: null }
});

onMounted(() => {
  loadingTableData.value = true;
  userListStore.isLoading = true;

  lazyParams.value = {
    first: 0,
    rows: 15,
    page: 0
  };

  loadLazyData();

  //Get countries Api
  var config = {
    cUrl: CURL_LOCATION,
    cKey: CKEY_LOCATION
  };

  fetch(config.cUrl, { headers: { 'X-CSCAPI-KEY': config.cKey } })
    .then((response) => response.text())
    .then((result) => {
      JSON.parse(result).map((country) => {
        countries.value = [...countries.value, { name: country.name, code: country.iso2 }];
      });
    })
    .catch((error) => console.log('error', error));
});

//Export Data table
const exportCSV = () => {
  http.nodeInstance
    .get(`users/export-users?${userListStore.urlExport ? userListStore.urlExport : ''}`, {
      responseType: 'blob'
    })
    .then(function (response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Convert country code to name
const convertCountry = (country) => {
  let countryName = '';
  countries.value.map((item) => {
    if (item.code === country) {
      countryName = item.name;
    }
  });
  return countryName;
};

// Convert to date
const convertDate = (data) => {
  const date = new Date(data);

  // Get day, month, year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  // Get hours and minutes
  let hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getMinutes()).padStart(2, '0');

  // Convert hours to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // "0" should be "12"

  // Combine date and time in the desired format
  const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;

  return formattedDate;
};

//Handle search data table
const searchTable = () => {
  clearTimeout(timeoutSearchTable);
  timeoutSearchTable = setTimeout(() => {
    if (
      filterModel.value?.code !== '' &&
      filterModel.value?.code &&
      valueSearch.value !== '' &&
      valueSearch.value &&
      valueSearch.value?.statusCode !== 0
    ) {
      loadLazyData(
        `${lazyParams.value.page + 1}&limit=${limitPaginator.value}&filter_country=${filterModel.value.code}&search=${valueSearch.value}`
      );
      userListStore.urlExport = `&filter_country=${filterModel.value.code}&search=${valueSearch.value}`;
    } else if (valueSearch.value !== '') {
      loadLazyData(
        `${lazyParams.value.page + 1}&limit=${limitPaginator.value}&search=${valueSearch.value}`
      );
      userListStore.urlExport = `&search=${valueSearch.value}`;
    } else {
      loadLazyData(lazyParams.value.page + 1);
      userListStore.urlExport = '';
    }
  }, 500);
};

//Handle filter data table
const filterCountryTable = (type) => {
  if (
    filterModel.value?.code !== '' &&
    filterModel.value?.code &&
    type === 'apply' &&
    valueSearch.value !== '' &&
    valueSearch.value
  ) {
    loadLazyData(
      `1&limit=${limitPaginator.value}&filter_country=${filterModel.value?.code}&search=${valueSearch.value}`
    );
    userListStore.urlExport = `&filter_country=${filterModel.value?.code}&search=${valueSearch.value}`;
  } else if (filterModel.value?.code !== '' && filterModel.value?.code && type === 'apply') {
    loadLazyData(`1&limit=${limitPaginator.value}&filter_country=${filterModel.value?.code}`);
    userListStore.urlExport = `&filter_country=${filterModel.value?.code}`;
  } else if (valueSearch.value !== '' && valueSearch.value) {
    loadLazyData(`1&limit=${limitPaginator.value}&search=${valueSearch.value}`);
    userListStore.urlExport = `&search=${valueSearch.value}`;
    filterModel.value = null;
  } else {
    loadLazyData(1);
    filterModel.value = null;
    userListStore.urlExport = '';
  }
};

const callSortAPI = (sortOrder, sortField) => {
  if (filterModel.value?.code && valueSearch.value) {
    if (!sortOrder && !sortField) {
      loadLazyData(
        `1&limit=${limitPaginator.value}&filter_country=${filterModel.value.code}&search=${valueSearch.value}`
      );
      userListStore.urlExport = `&filter_country=${filterModel.value.code}&search=${valueSearch.value}`;
    } else {
      loadLazyData(
        `1&limit=${limitPaginator.value}&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}&filter_country=${filterModel.value.code}&search=${valueSearch.value}`
      );
      userListStore.urlExport = `&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}&filter_country=${filterModel.value.code}&search=${valueSearch.value}`;
    }
  } else if (filterModel.value?.code) {
    if (!sortOrder && !sortField) {
      loadLazyData(`1&limit=${limitPaginator.value}&filter_country=${filterModel.value.code}`);
      userListStore.urlExport = `&filter_country=${filterModel.value.code}`;
    } else {
      loadLazyData(
        `1&limit=${limitPaginator.value}&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}&filter_country=${filterModel.value.code}`
      );
      userListStore.urlExport = `&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}&filter_country=${filterModel.value.code}`;
    }
  } else if (valueSearch.value) {
    if (!sortOrder && !sortField) {
      loadLazyData(`1&limit=${limitPaginator.value}&search=${valueSearch.value}`);
      userListStore.urlExport = `&search=${valueSearch.value}`;
    } else {
      loadLazyData(
        `1&limit=${limitPaginator.value}&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}&search=${valueSearch.value}`
      );
      userListStore.urlExport = `&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}&search=${valueSearch.value}`;
    }
  } else {
    if (!sortOrder && !sortField) {
      loadLazyData(`1&limit=${limitPaginator.value}`);
      userListStore.urlExport = '';
    } else {
      loadLazyData(
        `1&limit=${limitPaginator.value}&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}`
      );
      userListStore.urlExport = `&sort_by=${sortField}&sort_order=${sortOrder === 1 ? 'ASC' : 'DESC'}`;
    }
  }
};

const handleSort = (event) => {
  switch (event.sortField) {
    case 'username':
      callSortAPI(event.sortOrder, 'username');
      break;
    case 'email':
      callSortAPI(event.sortOrder, 'email');
      break;
    case 'created_at':
      callSortAPI(event.sortOrder, 'created_at');
      break;
    case 'status':
      callSortAPI(event.sortOrder, 'status');
      break;
    case 'total_video':
      callSortAPI(event.sortOrder, 'total_video');
      break;
    case 'total_follower':
      callSortAPI(event.sortOrder, 'total_followers');
      break;
    default:
      callSortAPI(null, null);
  }
};

const detailUser = (id) => {
  idDetailUser.value = id;
  isOpenModal.value = true;
};

const closeModal = () => {
  isOpenModal.value = false;
};

const toastSetDetail = () => {
  toast.add({
    severity: 'success',
    summary: 'Set user detail successfully!',
    detail: 'The user data have been updated',
    life: 3000
  });
};

const loadLazyData = (event) => {
  loadingTableData.value = true;
  lazyParams.value = { ...lazyParams.value, first: event?.first || first.value };
  http.nodeInstance
    .get(`users?page=${event ? event : 1}`)
    .then((response) => {
      userList.value = response.data.metadata.users;
      loadingTableData.value = false;
      totalRow.value = response.data.metadata.totalUsers;
      userListStore.isLoading = false;
    })
    .catch(function (error) {
      console.log(error);
    });
};

//Change Page
const onPage = (event) => {
  lazyParams.value = event;
  limitPaginator.value = event.rows;
  if (
    filterModel.value?.code !== '' &&
    filterModel.value?.code &&
    valueSearch.value !== '' &&
    valueSearch.value
  ) {
    loadLazyData(
      `${event.page + 1}&limit=${event.rows}&filter_country=${filterModel.value?.code}&search=${valueSearch.value}`
    );
  } else if (filterModel.value?.code !== '' && filterModel.value?.code) {
    loadLazyData(`${event.page + 1}&limit=${event.rows}&filter_country=${filterModel.value?.code}`);
  } else if (valueSearch.value !== '' && valueSearch.value) {
    loadLazyData(`${event.page + 1}&limit=${event.rows}&search=${valueSearch.value}`);
  } else {
    loadLazyData(`${event.page + 1}&limit=${event.rows}`);
  }
};
</script>
<style scoped></style>
