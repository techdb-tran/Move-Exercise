<template>
  <div class="">
    <Button
      icon="pi pi-times"
      rounded
      outlined
      severity="danger"
      @click="handleDeleteComment($event, props.id)"
    />
    <ConfirmPopup group="headless">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="border-round p-3">
          <span>{{ message.message }}</span>
          <div class="flex align-items-center gap-2 mt-3">
            <Button label="Delete" @click="acceptCallback" size="small"></Button>
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
  <Toast />
</template>

<script setup>
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
import http from '@/api/http';
import { defineEmits } from 'vue';

const toast = useToast();
const emit = defineEmits(['reRenderComment']);
const confirm = useConfirm();
const props = defineProps({
  id: Number,
  typeComment: String
});

const handleDeleteComment = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: 'Delete this comment ?',
    accept: async () => {
      if (props.typeComment === 'Comment') {
        await http.nodeInstance.delete(`comment/${id}`);
      } else {
        await http.nodeInstance.delete(`reply-comment/${id}`);
      }
      toast.add({
        severity: 'success',
        summary: 'Comment Deleted',
        detail: 'Comment have been deleted',
        life: 3000
      });
      emit('reRenderComment');
    }
  });
};
</script>
