<template>
<div>
    <div class="min-h-10 h-fit flex" :style="setHeightWithText">
        <img v-if="avatarUrl" :src="avatarUrl" class="w-10 h-10 object-cover rounded-[50%]" alt="image-avatar" />
        <img v-if="!avatarUrl" :src="avatarUrlDefault" class="w-10 h-10 object-cover rounded-[50%]"
            alt="image-avatar" />
        <textarea ref="commentInputRef" v-model.trim="commentInput" class="inputComment text-wrap w-full h-auto block" placeholder="Write a comment"
            @focus="handleFocusInput" :disabled="!allowTyping" :style="{ height: textareaHeight + 'px' }"  @input="resizeTextarea"></textarea>
    </div>
    <div v-if="isFocus" class="h-10 flex items-center justify-end">
        <span class="block mr-[35px] mt-3 text-primary-color cursor-pointer" @click="handleCancel">Cancel</span>
        <Button :isSubmitted="(commentInput && isSending)? true : false" :style="{ marginTop: '12px', width: '104px' }"
            @click="handleSendComment">Send</Button>
    </div>
</div>
</template>
<script setup>
import Button from '@/components/Button/Button.vue';
import { ref, onMounted } from 'vue';
import { useCommentStore } from '@/stores/comment';
import { useProfileStore } from '@/stores/profile';
import { useRoute } from 'vue-router';
import http from '@/utils/http';
import { useForgotPasswordStore } from '@/stores/forgotPassword';
import { getAccessTokenFromLS } from '@/utils/auth';
const route = useRoute();

const profileStore = useProfileStore();
const commentStore = useCommentStore()
const avatarUrl = ref('');
const avatarUrlDefault = ref('https://res.cloudinary.com/dezcltf7s/image/upload/v1712741483/c6e56503cfdd87da299f72dc416023d4_alifae.jpg')
const commentInput = ref('');
const allowTyping = ref(true);
const isFocus = ref(false);
const isAuth = getAccessTokenFromLS();
const isSending = ref(true);

const textareaHeight = ref(0);
const commentInputRef = ref(null);

const forgotPasswordStore = useForgotPasswordStore()
async function handleSendComment() {
    isSending.value = false;
    try {
        await http.phpInstance.post('/comments', {
            content: commentInput.value,
            video_id: route.params.videoId,
        });
        commentStore.handleGetComment(route.params.videoId);
    } catch (error) {
        console.error('Error sending comment:', error);
    } finally{
        handleCancel();
        isSending.value = true;
    }
}
function handleCancel(){
    resetInput();
}
function resetInput() {
    commentInput.value = '';
    isFocus.value = false;
    textareaHeight.value = 0;
    commentStore.handleCancelShowReplyInput();
}

function handleFocusInput() {
    if (isAuth) {
        allowTyping.value = true;
        commentStore.handleCancelShowReplyInput();
        isFocus.value = true;
    }
    else {
        forgotPasswordStore.goToLoginPage();
    }
};

onMounted(async () => {
    if (isAuth) {
        await profileStore.getProfile();
        avatarUrl.value = profileStore.profileData.avatar_url;
    }
});
const resizeTextarea = () => {
    if (commentInputRef.value) {
        const previousHeight = textareaHeight.value;
        textareaHeight.value = commentInputRef.value.scrollHeight;
            if (previousHeight !== textareaHeight.value) {
            setHeightWithText();
        }
    } else {
        textareaHeight.value = 0;
    }
};

const setHeightWithText = () => {
    const a = textareaHeight.value + 40;
    if(commentInput.value){
        return a + 'px'
    }else{
        return '0px'
    }
}
</script>
<style scoped>
.inputComment {
    width: 100%;
    min-height: 27px;
    height: auto;
    outline: none;
    margin: auto;
    margin-left: 12px;
    border-bottom: 2px solid #cccccc;
    resize: none;
    overflow: hidden;
    margin-bottom: 0;
    padding-bottom: 0;
}

input[type='text'] {
    padding-bottom: 6.5px;
}
</style>