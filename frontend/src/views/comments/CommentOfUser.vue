<template>
<div class="flex flex-col mb-[379px]">
    <CommentItem v-for="comment in commentStore.allComments" :key="comment.id"
     :id="comment.id"
     :action="comment.action"
     :content="comment.content"
     :createdAt = "comment.created_at*1000"
     :user="comment.user"
     :interactionCount="comment.interactionCount"
     :replyComments = "comment.reply_comments"
     />
</div>
</template>
<script setup>
import CommentItem from './CommentItem.vue';
import { onMounted} from 'vue';
import { useCommentStore } from '@/stores/comment';
import { useRoute } from 'vue-router';

const route = useRoute();
const commentStore = useCommentStore();
onMounted(()=>{
    commentStore.handleGetComment(route.params.videoId);
})
</script>