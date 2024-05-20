<template>
  <div class="card">
    <DataTable
      class="mx-10"
      paginator
      :rows="5"
      :rowHover="true"
      :value="dataCategoryList"
      :totalRecords="totalPages"
      :loading="loading"
      lazy
      @page="onPage"
      tableStyle="min-width: 50rem"
    >
      <Toast />
      <template #header>
        <div class="flex justify-between items-start gap-3 mt-8 mb-4">
          <div class="">
            <h1 class="text-4xl font-bold text-start text-primary-black-color">Category List</h1>
          </div>
          <div class="mb-4 flex items-center justify-end">
            <Button outlined severity="primary" class="mr-2 w-[180px]" @click="visible = true"
              ><i class="pi pi-plus mr-4"></i>Add category</Button
            >
            <Dialog
              v-model:visible="visible"
              :draggable="false"
              :closeOnEscape="false"
              :closable="false"
              modal
              header="Create category"
              :style="{ width: '25rem' }"
            >
              <template #header>
                <div class="relative w-full">
                  <button
                    class="w-6 h-6 absolute top-0 right-0 cursor-pointer"
                    @click="closePopupAddCategory"
                  >
                    <CancelIcon />
                  </button>
                  <div class="font-bold text-[16px] leading-[21px]" v-if="!idPost">
                    Add category
                  </div>
                  <div class="font-bold text-[16px] leading-[21px]" v-else>Edit category</div>
                </div>
              </template>
              <div class="flex align-items-center gap-3 mb-5">
                <label for="username" class="flex items-center font-semibold w-6rem">Name</label>
                <InputText v-model="name" id="username" class="flex-auto" autocomplete="off" />
              </div>
              <div class="flex align-items-center gap-3 mb-5">
                <label for="img" class="font-semibold w-6rem flex items-center">Image</label>
                <div class="image-upload flex items-center">
                  <input type="file" id="fileInput" @change="handleImageUpload" />
                  <label for="fileInput" class="text-primary-color cursor-pointer w-[215px]">
                    Click to upload category image for category
                  </label>
                </div>
                <img
                  :src="previewImage ? previewImage : '/src/assets/images/image_category.png'"
                  alt="image category"
                  class="w-[56px] h-[80px] object-contain my-2"
                />
              </div>
              <div class="flex align-items-center gap-3 mb-5">
                <label for="img" class="font-semibold w-6rem flex items-center">Show</label>
                <Dropdown
                  v-model="isShow"
                  @change="resultShow"
                  :options="optionShow"
                  optionLabel="name"
                  :placeholder="isShow ? 'Show' : 'Hide'"
                  class="w-full"
                />
              </div>
              <div class="flex justify-center gap-2">
                <Button
                  type="button"
                  label="Cancel"
                  severity="secondary"
                  @click="closePopupAddCategory"
                ></Button>
                <button
                  @click="submitForm"
                  type="button"
                  class="h-[42px] px-4 bg-primary-color text-white rounded-lg hover:opacity-70 flex items-center"
                >
                  <SpinnerLoading v-if="loadingButtonSave" />
                  Save
                </button>
              </div>
            </Dialog>

            <!-- search -->
            <label for="search" class="mx-4">Search</label>
            <div class="flex justify-between items-center">
              <IconField iconPosition="left">
                <InputIcon class="top-5">
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="search"
                  id="search"
                  placeholder="Search category name"
                  @input="searchCategoryName"
                />
              </IconField>
            </div>
          </div>
        </div>
      </template>
      <template #empty> Category list not found. </template>
      <Column field="name" header="Name" style="width: 25%">
        <template #body="slotProps">
          <div class="w-56 truncate">
            <span class="truncate">{{ slotProps.data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="image" header="Image" style="width: 15%">
        <template #body="slotProps">
          <div class="cursor-pointer text-center w-20 h-28">
            <img :src="slotProps.data.image_url" class="h-full w-full object-contain" />
          </div>
        </template>
      </Column>
      <Column field="is_show" header="Show" style="width: 20%">
        <template #body="slotProps">
          <div v-if="slotProps.data.is_show">Show</div>
          <div v-else>Hide</div>
        </template>
      </Column>
      <Column field="total_followers" header="Total Follower" style="width: 25%">
        <template #body="slotProps">
          <div v-if="slotProps.data.total_followers">
            {{ formatView(slotProps.data.total_followers) }}
          </div>
          <div v-else>0</div>
        </template>
      </Column>
      <Column field="total_views" header="Total Views" style="width: 25%">
        <template #body="slotProps">
          <div v-if="slotProps.data.total_views">{{ formatView(slotProps.data.total_views) }}</div>
          <div v-else>0</div>
        </template>
      </Column>
      <Column field="total_views" header="Edit" style="width: 25%">
        <template #body="slotProps">
          <Button
            icon="pi pi-pen-to-square"
            outlined
            rounded
            severity="primary"
            class="mr-2"
            @click="showPostEdit(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import http from '@/api/http.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import CancelIcon from '@/assets/svg/CancelIcon.vue';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import { formatView } from '@/utils/formatView.js';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import SpinnerLoading from '@/assets/svg/SpinnerLoading.vue';

const dataCategoryList = ref([]);
const search = ref('');
const visible = ref(false);
const name = ref();
const image = ref(null);
const previewImage = ref();
const isShow = ref(false);
const typeShow = ref(false);
const optionShow = ref([
  { name: 'Hide', code: 'false' },
  { name: 'Show', code: 'true' }
]);
const idPost = ref();
const page = ref(1);
const totalPages = ref();
let debounceTimeout = null;
const toast = useToast();
const loading = ref(false);
const loadingButtonSave = ref(false);

const resultShow = () => {
  typeShow.value = isShow.value.code;
};
const searchCategoryName = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(() => {
    getDataCategoryList();
  }, 500);
};
const getDataCategoryList = async () => {
  try {
    loading.value = true;
    const res = await http.nodeInstance.get(
      `category/all?page=${page.value}&limit=5&search=${search.value.trim()}`
    );
    totalPages.value = res.data.metadata.totalCategories;
    dataCategoryList.value = res.data.metadata.categories;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const onPage = (event) => {
  page.value = event.page + 1;
  getDataCategoryList();
};
const handleImageUpload = (event) => {
  const selectedFileImg = event.target.files[0];
  const formatFile = ['image/jpeg', 'image/jpg', 'image/png'];
  if (selectedFileImg) {
    if (!formatFile.includes(selectedFileImg.type)) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'The file is not in the correct format, only files in JPEG, JPG, or PNG format will be accepted.',
        life: 3000
      });
      return;
    }
    if (selectedFileImg.size > 1 * 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Limit image files to no more than 1mb, choose files with smaller capacity.',
        life: 3000
      });
      return;
    }
    image.value = selectedFileImg;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFileImg);
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No file selected.',
      life: 3000
    });
    image.value = null;
    previewImage.value = null;
  }
};
const submitForm = async () => {
  if (!name.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Category name cannot be blank.',
      life: 3000
    });
    return;
  }
  if (!idPost.value && !image.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Image file cannot be blank.',
      life: 3000
    });
    return;
  }
  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('is_show', typeShow.value);
  if (image.value) {
    formData.append('image_url', image.value);
  }
  try {
    loadingButtonSave.value = true;
    if (!idPost.value) {
      await http.nodeInstance.post(`category/add`, formData);
    } else {
      await http.nodeInstance.patch(`category/edit/${idPost.value}`, formData);
    }
    getDataCategoryList();
    toast.add({ severity: 'success', summary: 'Success', detail: 'Upload success.', life: 3000 });
    idPost.value = null;
    visible.value = false;
    name.value = '';
    image.value = null;
    previewImage.value = null;
    isShow.value = false;
    typeShow.value = false;
  } catch (error) {
    if (error.code === 400) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `${error.response.data.message}`,
        life: 3000
      });
      return;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `${error.response.data.message}`,
        life: 3000
      });
    }
  } finally {
    loadingButtonSave.value = false;
  }
};
const closePopupAddCategory = () => {
  idPost.value = null;
  visible.value = false;
  name.value = '';
  image.value = null;
  previewImage.value = null;
  isShow.value = false;
  typeShow.value = false;
};
const showPostEdit = async (id) => {
  visible.value = true;
  idPost.value = id;
  try {
    const res = await http.nodeInstance.get(`category/info/${id}`);
    name.value = res.data.metadata.name;
    isShow.value = res.data.metadata.is_show;
    previewImage.value = res.data.metadata.image_url;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getDataCategoryList();
});
</script>

<style scoped>
.image-upload input[type='file'] {
  display: none;
}
</style>
