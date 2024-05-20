import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '@/utils/http';
export const useCommentStore = defineStore('comment', () => {
    const isSuspendedComment = ref(false);
    const isUnComment = ref(false);
    const replyCommentId = ref(null);
    const allComments = ref(null);
    const handleShowReplyInput = (id) => {
        replyCommentId.value = id;
    }
    const handleCancelShowReplyInput= (id)=>{
        replyCommentId.value = !id;
    }
    const handleGetComment = async (id)=>{
        try {
            const res = await http.phpInstance.get(`/videos/${id}`);
            isUnComment.value = res.data.data.is_comment===0 ? true : false;
            allComments.value = res.data.data.comments;
        } catch (error) {
            console.error(error)
        }
    }
    return {
        isSuspendedComment,
        replyCommentId,
        allComments,
        handleShowReplyInput,
        handleGetComment,
        handleCancelShowReplyInput,
        isUnComment
    };
});
