<template>
<div>
    <div class="min-h-10 h-fit flex" :style="setHeightWithText">
        <img v-if="avatarUrl" :src="avatarUrl" class="w-10 h-10 object-cover rounded-[50%]" alt="image-avatar" />
        <img v-if="!avatarUrl" :src="avatarUrlDefault" class="w-10 h-10 object-cover rounded-[50%]" alt="image-avatar"/>
        <textarea ref="commentInputRef" v-model.trim="commentInput" class="inputComment text-wrap w-full h-auto block" placeholder="Write a comment"
            @focus="handleFocusInput" :style="{ height: textareaHeight + 'px' }"  @input="resizeTextarea"></textarea>
    </div>
    <div v-if="isFocus" class="h-10 flex items-center justify-end">
        <span class="block mr-[35px] text-primary-color cursor-pointer" @click="handleCancel">Cancel</span>
        <Button :isSubmitted="(commentInput && isSending)? true : false" :style="{ marginTop: `${textareaHeight > 25 ? '12px' : '0px'}`, width: '104px' }"
            @click="handleSendReplyComment">Send</Button>
    </div>
</div>
</template>
<script setup>
import Button from '@/components/Button/Button.vue';
import { onMounted, ref, watch } from 'vue';
import { useCommentStore } from '@/stores/comment';
import { useProfileStore } from '@/stores/profile';
import http from '@/utils/http';
import { useRoute } from 'vue-router';
import { getAccessTokenFromLS } from '@/utils/auth';


const profileStore = useProfileStore();
const avatarUrlDefault = ref('https://res.cloudinary.com/dezcltf7s/image/upload/v1712741483/c6e56503cfdd87da299f72dc416023d4_alifae.jpg')
const commentInput = ref('');
const route = useRoute();
const isAuth = getAccessTokenFromLS();
const avatarUrl = ref('')
const commentStore = useCommentStore()
const isFocus = ref(false);
const isSending = ref(true);
async function handleSendReplyComment() {
    isSending.value = false;
    try {
        await http.phpInstance.post('/replycoments', {
            comment_id: commentStore.replyCommentId,
            content: commentInput.value
        });
        resetInput();
        commentStore.handleGetComment(route.params.videoId);
    } catch (error) {
        console.error('Error sending comment:', error);
    }finally{
        isSending.value = true;
    }
}
function handleCancel(id) {
    resetInput(id);
    isFocus.value = false;
    textareaHeight.value = 0;
}
function resetInput(id) {
    commentInput.value = '';
    commentStore.handleCancelShowReplyInput(id)
}
function handleFocusInput(){
    isFocus.value = true;
}
onMounted(async () => {
    if(isAuth){
        await profileStore.getProfile();
        avatarUrl.value = profileStore.profileData.avatar_url;
    }
});
const textareaHeight = ref(0);
const commentInputRef = ref(null);
const resizeTextarea = () => {
    if (commentInputRef.value) {
        textareaHeight.value = commentInputRef.value.scrollHeight;
    }
};
watch(commentInput, ()=>{
    resizeTextarea();
})
const setHeightWithText = () => {
    const a = textareaHeight.value + 40;
    return a + 'px';
}
</script>
<style scoped>
.inputComment {
    min-height: 27px;
    height: auto;
    outline: none;
    margin: auto;
    margin-left: 12px;
    border-bottom: 2px solid #cccccc;
    resize: none;
    overflow: hidden;
}

input[type='text'] {
    padding-bottom: 6.5px;
}
</style>