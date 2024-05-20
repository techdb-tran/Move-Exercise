<template>
  <Toast />
  <div class="card pt-8">
    <DataTable
      :first="first"
      :value="listVideoHidden.videos"
      :rowHover="true"
      :loading="loading"
      paginator
      :rows="10"
      @page="onPage"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="grid grid-cols-12 items-start gap-3">
          <div class="col-span-5">
            <h1 class="text-4xl font-bold text-start">List Video Hidden</h1>
          </div>
        </div>
      </template>
      <Column field="avatar" header="Videos" class="w-3/12">
        <template #body="slotProps">
          <div
            @click="handleOpenDetailVideo(slotProps.data.id)"
            class="cursor-pointer text-center w-32 h-20"
          >
            <img :src="slotProps.data.thumbnail" class="h-full w-full" />
          </div>
        </template>
      </Column>
      <Column header="Details" class="w-3/12">
        <template #body="slotProps">
          <div class="font-bold">{{ slotProps.data.title }}</div>
          <div v-for="item in slotProps.data.Category">
            <span class="font-light">{{ item }}</span>
          </div>
        </template>
      </Column>
      <Column header="Date posted" class="w-1/12">
        <template #body="slotProps">
          <div>
            {{ format(new Date(slotProps.data.created_at), 'dd/MM/yyyy HH:mm:ss') }}
          </div>
        </template>
      </Column>
      <Column field="user.username" header="Created by" headerClass="text-center" class="w-1/12">
      </Column>
      <Column field="count_view" header="Views" class="w-1/12 text-center"></Column>
      <Column field="count_comment" header="Comment" class="w-1/12 text-center">
        <template #body="slotProps">
          <div class="flex justify-center">
            {{ slotProps.data.count_comment ? slotProps.data.count_comment : 0 }}
          </div>
        </template>
      </Column>
      <Column header="Rating" class="w-1/12 text-center">
        <template #body="slotProps">
          <div class="flex justify-center">
            {{
              slotProps.data.average_rates ? parseFloat(slotProps.data.average_rates).toFixed(1) : 0
            }}
            <StarRating class="ml-1" />
          </div>
        </template>
      </Column>
      <Column class="w-1/12">
        <template #header>
          <div class="">Options</div>
        </template>
        <template #body="slotProps">
          <div class="flex">
            <Button
              icon="pi pi-eye-slash"
              outlined
              rounded
              severity="primary"
              class="mr-2"
              @click="handleUnhideVideo($event, slotProps.data.id)"
            />
            <ConfirmPopup group="unhide">
              <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="border-round p-3">
                  <span>{{ message.message }}</span>
                  <div class="flex align-items-center gap-2 mt-3">
                    <Button
                      label="Unhide"
                      @click="acceptCallback(slotProps.data.id)"
                      size="small"
                    ></Button>
                    <Button
                      label="Cancel"
                      outlined
                      @click="rejectCallback"
                      severity="secondary"
                      size="small"
                      text
                    ></Button>
                  </div>
                </div>
              </template>
            </ConfirmPopup>
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="handleDeteleVideo($event, slotProps.data.id)"
            />
            <ConfirmPopup group="headless">
              <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="border-round p-3">
                  <span>{{ message.message }}</span>
                  <div class="flex align-items-center gap-2 mt-3">
                    <Button
                      label="Delete"
                      @click="acceptCallback(slotProps.data.id)"
                      size="small"
                    ></Button>
                    <Button
                      label="Cancel"
                      outlined
                      @click="rejectCallback"
                      severity="secondary"
                      size="small"
                      text
                    ></Button>
                  </div>
                </div>
              </template>
            </ConfirmPopup>
          </div>
        </template>
      </Column>
    </DataTable>
    <DetailVideo v-if="isOpenDetail" @closeModal="handleCloseDetailVideo" :idVideo="idVideo" />
  </div>
</template>

<script setup>
import DetailVideo from '@/views/video_list/DetailVideo.vue';
import StarRating from '@/components/UI/StarRating.vue';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, defineEmits, watch } from 'vue';
import { format } from 'date-fns';
import http from '@/api/http';

const first = ref(0);
const confirm = useConfirm();
const pageNum = ref(1);
const toast = useToast();
const listVideoHidden = ref([]);
const isOpenDetail = ref(false);
const idVideo = ref();
const loading = ref(false);
const emit = defineEmits(['reRenderListVideo']);
const props = defineProps({
  idVideoHide: String
});
watch(
  () => props.idVideoHide,
  () => {
    getDataListVideo();
  }
);

const handleUnhideVideo = async (event, id) => {
  confirm.require({
    target: event.currentTarget,
    group: 'unhide',
    message: 'Unhide this video ?',
    accept: async () => {
      await http.nodeInstance.post(`/video/hide/${id}`);
      resetIndexPage()
      getDataListVideo();
      toast.add({
        severity: 'success',
        summary: 'Unhide Video',
        detail: 'Unhide video successfully',
        life: 3000
      });
      emit('reRenderListVideo');
    }
  });
};

const handleDeteleVideo = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: 'Delete this video ?',
    accept: async () => {
      await http.nodeInstance.post(`video/hide/${id}`);
      await http.nodeInstance.post(`/video/delete`, {
        video_id: [id]
      });
      resetIndexPage()
      getDataListVideo();
      toast.add({
        severity: 'success',
        summary: 'Delete Video',
        detail: 'Delete video successfully',
        life: 3000
      });
    }
  });
};

const onPage = () => {
  getDataListVideo();
};

const handleOpenDetailVideo = (id) => {
  isOpenDetail.value = true;
  idVideo.value = id;
};

const resetIndexPage = () => {
  first.value = 1;
  pageNum.value = 1;
};


const handleCloseDetailVideo = () => {
  isOpenDetail.value = false;
};

const getDataListVideo = async () => {
  try {
    loading.value = true;
    const res = await http.nodeInstance.get(`/video/list/?hide=true`);
    listVideoHidden.value = res.data.metadata;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getDataListVideo();
});
</script>
