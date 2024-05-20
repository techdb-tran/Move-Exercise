<template>
  <div class="card overflow-scroll p-10">
    <div class="mb-10">
      <BlackBar><h1 class="text-4xl font-bold">Report List</h1></BlackBar>
    </div>
    <div v-if="reportListStore.isLoading">
      <div v-for="index in 15" :key="index">
        <Skeleton class="mt-3 w-full" height="3rem"></Skeleton>
      </div>
    </div>
    <DataTable
      ref="dt"
      :value="toRaw(reportList)?.data"
      stripedRows
      :rowHover="true"
      paginator
      :rows="15"
      tableStyle="min-width: 50rem"
      :loading="loadingTableData"
      :totalRecords="totalRow"
      :pageLinkSize="10"
      lazy
      @page="onPage($event)"
      v-if="!reportListStore.isLoading"
    >
      <template #header>
        <div class="flex justify-end">
          <IconField iconPosition="left">
            <InputIcon class="flex items-center">
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="reportListStore.valueSearch"
              placeholder="Keyword Search"
              @keyup="searchTable"
            />
          </IconField>
        </div>
      </template>
      <template #empty>No users found.</template>
      <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
      <Column field="reported_user.username" header="Channel Name" class="w-60">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <img
              :src="slotProps.data.reported_user.avatar_url"
              class="w-[50px] h-[50px] object-cover rounded-[50%] my-2"
            />
            <span class="truncate" v-tooltip.top="slotProps.data.reported_user.username">
              {{ slotProps.data.reported_user.username }}
            </span>
            <VerifiedBadgeIcon
              v-show="slotProps.data.reported_user.is_verified"
            ></VerifiedBadgeIcon>
          </div>
        </template>
      </Column>
      <Column field="type_report.title" header="Content" class="text-nowrap"></Column>
      <Column field="created_at" header="Time" class="text-nowrap">
        <template #body="slotProps">
          <div>
            {{ convertDate(slotProps.data.created_at) }}
          </div>
        </template>
      </Column>
      <Column field="user.username" header="Reporter">
        <template #body="slotProps">
          <div>
            {{ slotProps.data.user.username !== null ? slotProps.data.user.username : 'Null' }}
          </div>
        </template>
      </Column>
      <Column field="reported_user.ban.is_ban" header="Status Channel">
        <template #body="slotProps">
          <div>
            <Tag
              severity="danger"
              value="BAN"
              class="w-full"
              v-if="slotProps.data.reported_user.ban?.is_permaban === 1"
            ></Tag>
            <Tag
              severity="warning"
              value="SUSPEND"
              class="w-full"
              v-else-if="
                slotProps.data.reported_user.ban?.is_permaban === 0 &&
                compareDate(slotProps.data.reported_user.ban?.ban_expired_at)
              "
            ></Tag>
            <Tag value="ACTIVE" class="w-full" v-else></Tag>
          </div>
        </template>
      </Column>
      <Column field="status" header="Status Report" class="max-w-[10%] min-w-52">
        <template #body="slotProps">
          <select
            :id="slotProps.data.id"
            :key="slotProps.data.id"
            @change="updateStatus(slotProps.data.id)"
            class="border-solid border-2 w-full p-2"
            :value="slotProps.data.status"
          >
            <option value="Pending">Pending</option>
            <option value="UnderReview">Under review</option>
            <option value="Processing">Processing</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </template>
      </Column>
      <Column header="">
        <template #body="slotProps">
          <div class="flex justify-end">
            <Button
              icon="pi pi-user"
              outlined
              rounded
              class="mr-2"
              @click="detailUser(slotProps.data.reported_user.id)"
            />
            <!-- <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteReport(slotProps.data.id)"
            /> -->
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="deleteReportDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
      :closable="false"
    >
      <div class="confirmation-content pt-7 flex items-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete this report?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          :loading="loadingDelete"
          text
          @click="deleteReportDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          :loading="loadingDelete"
          text
          @click="deleteReport()"
        />
      </template>
    </Dialog>
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
import { ref, onMounted, toRaw } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import http from '@/api/http.js';
import VerifiedBadgeIcon from '@/assets/svg/VerifiedBadgeIcon.vue';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import BlackBar from '@/components/UI/BlackBar.vue';
import Skeleton from 'primevue/skeleton';
import { useReportListStore } from '@/store/storeReportList.js';

onMounted(() => {
  loadingTableData.value = true;
  reportListStore.isLoading = true;

  lazyParams.value = {
    first: 0,
    rows: 15,
    page: 0
  };

  loadLazyData();
});

const toast = useToast();
const reportList = ref();
const idDeleteReport = ref();
const loadingTableData = ref(true);
const totalRow = ref();
const dt = ref();
const lazyParams = ref({});
const first = ref(0);
const deleteReportDialog = ref(false);
const loadingDelete = ref(false);
const isOpenModal = ref(false);
const idDetailUser = ref('');
const dataTablePage = ref();
const reportListStore = useReportListStore();
let timeoutSearchTable;

const convertDate = (data) => {
  const date = new Date(data * 1000);
  const formattedDate = date.toLocaleString();
  return formattedDate;
};

//Handle search data table
const searchTable = () => {
  clearTimeout(timeoutSearchTable);
  timeoutSearchTable = setTimeout(() => {
    loadLazyData({ searchItem: reportListStore.valueSearch, page: dataTablePage.value });
  }, 500);
};

const compareDate = (data) => {
  const currentDate = new Date().getTime();
  if (data * 1000 >= currentDate) {
    return true;
  } else {
    return false;
  }
};

const updateStatus = (id) => {
  const status = document.getElementById(`${id}`);
  http.phpInstance
    .patch(`reports/${id}`, { status: status.value })
    .then(() => {
      loadLazyData({ page: toRaw(lazyParams.value).page + 1 });
      toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Update status report success',
        life: 3000
      });
    })
    .catch((error) => {
      console.log(error);
    });
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

// const confirmDeleteReport = (postIdToDelete) => {
//   idDeleteReport.value = postIdToDelete;
//   deleteReportDialog.value = true;
// };

const deleteReport = () => {
  loadingDelete.value = true;
  http.phpInstance
    .post('reports/delete', {
      ids: [idDeleteReport.value]
    })
    .then(function () {
      deleteReportDialog.value = false;
      loadingDelete.value = false;
      toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: 'Delete report success',
        life: 3000
      });
      loadLazyData({
        page: toRaw(lazyParams.value).page + 1,
        searchItem: reportListStore.valueSearch
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

const loadLazyData = (event) => {
  loadingTableData.value = true;
  lazyParams.value = { ...lazyParams.value, first: event?.first || first.value };
  http.phpInstance
    .get(
      `reports?page=${event?.page ? event.page : 1}
      &search=${event?.searchItem ? event.searchItem : ''}`
    )
    .then(function (response) {
      reportList.value = response.data.data;
      loadingTableData.value = false;
      totalRow.value = toRaw(toRaw(reportList).value).meta.total;
      reportListStore.isLoading = false;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const onPage = (event) => {
  lazyParams.value = event;
  loadLazyData({ page: event.page + 1 });
  dataTablePage.value = event.page + 1;
};
</script>
<style scoped></style>
