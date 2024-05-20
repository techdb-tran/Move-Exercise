<template>
  <Dialog :visible="visible" :draggable="false" modal :style="{ width: '800px' }" class="p-4 relative">
    <template #header class="">
      <div class="mx-auto font-bold mb-2">
        What are your interests
      </div>
    </template>
    <button class="cursor-pointer absolute top-4 right-4" @click="handleCloseModal">
      <CloseButton />
    </button>
    <span class="text-sm text-center block">
      Choose 1 or more category below. <br>This will help us to provide you with the most relevant content on MOVE</br>
    </span>
    <div class="grid grid-cols-6 gap-2 mt-8">
      <div v-for="(item) in listCategory" :key="item.id" @click="togglePickCategory(item.id)">
        <ItemCategory :item="item"/>
      </div>
    </div>
    <div class="w-full text-center mt-6">
      <Button class="w-52 block mx-auto hover:bg-primary-color-hover bg-primary-color py-2 text-white"
        @click="handleCreateCategory" :class="{ 'bg-secondary-text-color': !picked, 'pointer-events-none': !picked }">
        <span class="font-bold">
          {{ picked ? 'Continue' : 'Choose 1 more' }}
        </span>
      </Button>
    </div>
  </Dialog>
</template>

<script setup>
import CloseButton from '@/components/UI/CloseButton.vue';
import { useOnboardingStore } from '@/stores/onboarding';
import ItemCategory from '@/components/category/ItemCategory.vue'
import { ref, onMounted, toRaw } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { removeStatusVerifiedLS } from '@/utils/auth';
import http from '@/utils/http';

const store = useOnboardingStore()
const visible = ref(true);
const picked = ref(false);
const listCategory = ref();
const listPickCategory = ref([]);

const handleCloseModal = () => {
    store.skipShow()
    removeStatusVerifiedLS()
}

const togglePickCategory = (id) => {
  if (listPickCategory.value.length > 0) {
    //check if list empty or not
    let found = false;
    for (let i = 0; i < listPickCategory.value.length; i++) {
      //check if item is exist or not
      if (listPickCategory.value[i] === id) {
        listPickCategory.value.splice(i, 1);
        found = true;
        break;
      }
    }
    if (!found) {
      listPickCategory.value.push(id);
    }
  } else {
    listPickCategory.value.push(id);
  }
  console.log(listPickCategory.value);
  picked.value = listPickCategory.value.length > 0;
};

const handleCreateCategory = async () => {
  console.log(toRaw(listPickCategory.value));
  try {
    await http.nodeInstance.post(`categories/user-follow`, {
      cate_id: toRaw(listPickCategory.value)
    })
  }
  finally {
    store.nextStep()
  }
  
}

onMounted( async() => {
    const res = await http.nodeInstance.get(`/categories`)
    listCategory.value = res.data.metadata.slice(0,6) //get first 6 item for render

})
</script>

<style scoped></style>
