<template>
<div class="ml-4 mr-4 mt-10" v-if="!commentStore.isUnComment">
    <CommentInput />
    <CommentOfUser />
</div>
<div class="mt-10 text-center text-primary-text-color" v-else>
    This video turned off comments
</div>
<ReportModal v-if="reportStore.stepShow ===1"/>
<ReportSuccess v-if="reportStore.stepShow ===2"/>
</template>
<script setup>
import { useCommentStore } from '@/stores/comment';
import CommentInput from './CommentInput.vue';
import CommentOfUser from './CommentOfUser.vue';
import ReportModal from '../OfflineChannel/ReportModal.vue';
import ReportSuccess from '../OfflineChannel/ReportSuccess.vue';
import ForgotPassWord from '@/components/ForgotPassWord/ForgotPassWord.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useReportUser } from '@/stores/reportuser';
const commentStore = useCommentStore();
const reportStore = useReportUser()
const route = useRoute();
onMounted(async ()=>{
    await commentStore.handleGetComment(route.params.videoId);
})
</script>