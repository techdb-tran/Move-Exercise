<template>
  <div
    class="mt-8 h-fit mt-15 flex align-center"
    :ref="commentRef"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
  >
    <div>
      <img
        v-if="!isSuspendAccount"
        :src="user.avatar_url"
        class="w-10 h-10 object-cover rounded-[50%]"
        alt="avt-reply-img"
      />
      <img
        v-else
        src="@/assets/images/defaultThumbnail.png"
        class="w-10 h-10 object-cover rounded-[50%]"
        alt="avt-reply-img"
      />
    </div>
    <div class="ml-3 h-fit flex flex-col w-full">
      <div
        style="margin: -4px -16px -8px -8px"
        :class="{
          'bg-gray-100': props?.id.toString() === idComment && !idReply,
          'rounded-lg': props?.id.toString() === idComment && !idReply,
        }"
      >
        <div class="flex w-full px-2 pt-1">
          <div v-if="!isSuspendAccount" class="flex w-fit">
            <div class="cursor-pointer font-bold" @click="goToUserChannel(user.id)">
              {{ user.username }}
            </div>
            <VerifiedBadge class="ml-3.5 m-auto" v-if="user.is_verified" />
          </div>
          <div v-if="isSuspendAccount">
            <p class="font-bold">Suspended MOVE Account</p>
          </div>
          <p class="ml-[9.9px] text-primary-text-color">
            {{
              formatDistanceToNow(new Date(props.createdAt), {
                addSuffix: true,
              })
            }}
          </p>
          <div v-show="isAuth && isActiveComment" class="ml-auto">
            <div class="relative" v-if="validUserDeleteComment">
              <Edit @click="handleShowActiveComment" />
              <div
                v-if="isShowActiveComment"
                class="absolute bg-white w-[100px] h-[36px] border-[1px] border-primary-color rounded-xl right-[50%] p-[8px]"
              >
                <div class="cursor-pointer flex" @click="handleShowModalRemove">
                  <Trash />
                  <h2 class="text-primary-color text-sm ml-[4px]">Delete</h2>
                </div>
              </div>
            </div>
            <div class="relative" v-if="!validUserDeleteComment && !isSuspendAccount">
              <Edit @click="handleShowActiveComment" />
              <div
                v-if="isShowActiveComment"
                class="absolute bg-white w-[100px] h-[36px] border-[1px] border-primary-color rounded-xl right-[50%] p-[8px]"
              >
                <div class="cursor-pointer flex" @click="handleReportChannel">
                  <i class="pi pi-flag text-primary-color"></i>
                  <h2 class="text-primary-color text-sm ml-[4px]">Report</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isSuspendAccount">
          <p class="contentComment max-w-[850px] h-fit whitespace-normal break-words px-2 pb-1">
            {{ content }}
          </p>
        </div>
        <div class="flex w-full" v-if="isSuspendAccount">
          <p><i>[This comment has been removed due to violation of community guideline]</i></p>
        </div>
      </div>
      <div v-if="!isSuspendAccount">
        <div class="w-fit flex h-[27.12px] mt-2">
          <div class="flex">
            <div class="like-container">
              <Like class="like-icon cursor-pointer" v-if="!action.like" @click="handleLike(id)" />
              <LikeActive
                class="like-active-icon cursor-pointer"
                v-if="action.like"
                @click="handleLike(id)"
              />
            </div>
            <p class="text-primary-color ml-[6.2px]">{{ interactionCount.like_count || '' }}</p>
          </div>
          <div class="mt-auto ml-[19.7px]">
            <div class="dislike-container">
              <Dislike
                class="dislike-icon cursor-pointer"
                v-if="!action.dislike"
                @click="handleDislike(id)"
              />
              <DislikeActive
                class="dislike-active-icon cursor-pointer"
                v-if="action.dislike"
                @click="handleDislike(id)"
              />
            </div>
          </div>
          <span
            v-if="true"
            class="text-primary-color ml-[16.5px] cursor-pointer"
            @click="handleShowReplyInput(id)"
          >
            Reply
          </span>
        </div>
        <ReplyCommentInput v-if="commentStore.replyCommentId === id" class="mt-2" />
        <div
          class="flex w-fit h-[17px] mt-2 items-center"
          v-if="replyComments.length < 13 && replyComments.length !== 0"
        >
          <span
            v-if="!isHideReply"
            class="text-primary-color font-bold cursor-pointer"
            @click="handleHideReply"
          >
            <DownArrow class="inline" /> Show
            {{ replyComments.length }}
            replies
          </span>
          <div>
            <span
              v-if="isHideReply"
              class="text-primary-color font-bold cursor-pointer"
              @click="handleHideReply"
            >
              <UpArrow class="inline" /> Hide {{ replyComments.length }}
              replies
            </span>
          </div>
        </div>
        <div class="flex w-fit h-[17px] mt-2 items-center" v-if="replyComments.length > 12">
          <span
            v-if="!isHideReply"
            class="text-primary-color font-bold cursor-pointer"
            @click="handleHideReply"
          >
            <DownArrow class="inline" /> Show
            {{ displayComment.length }}
            replies
          </span>
          <div>
            <span
              v-if="isHideReply"
              class="text-primary-color font-bold cursor-pointer"
              @click="handleHideReply"
            >
              <UpArrow class="inline" /> Hide {{ displayComment.length }}
              replies
            </span>
          </div>
        </div>
        <div v-if="isHideReply">
          <ReplyItem
            v-for="reply in displayComment"
            :key="reply.id"
            :id="reply.id"
            :content="reply.content"
            :user="reply.user"
            :interactionCount="reply.interactionCount"
            :createdAt="reply.created_at * 1000"
            :action="reply.action"
            :commentId="reply.comment_id"
          />
          <span
            v-if="replyComments.length - displayComment.length ? true : false"
            class="text-primary-color font-bold cursor-pointer"
            @click="handleShowMoreReply"
          >
            <DownArrow class="inline" /> Show more replies
          </span>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    :draggable="false"
    v-model:visible="isCommentRemove"
    modal
    :style="{ width: '20rem' }"
    class="px-4"
  >
    <template #header>
      <div class="flex flex-col">
        <h1 class="text-lg font-bold mt-2">Delete Comment</h1>
        <p>Permanently delete your comment.</p>
        <div class="flex justify-center gap-10 items-center -translate-y-6">
          <p @click="handleCloseModalRemove" class="text-primary-color mt-10 px-2 cursor-pointer">
            Cancel
          </p>
          <div @click="handleDeleteComment">
            <Button width="170px" :isSubmitted="true">Delete</Button>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import Dislike from '@/assets/svg/Dislike.vue';
import DislikeActive from '@/assets/svg/DislikeActive.vue';
import Like from '@/assets/svg/Like.vue';
import LikeActive from '@/assets/svg/LikeActive.vue';
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue';
import DownArrow from '@/assets/svg/DownArrow.vue';
import ReplyCommentInput from './ReplyCommentInput.vue';
import ReplyItem from './ReplyItem.vue';
import { useCommentStore } from '@/stores/comment';
import { formatDistanceToNow } from 'date-fns';
import { computed, onMounted, ref, nextTick, watch } from 'vue';
import http from '@/utils/http';
import { useRoute, useRouter } from 'vue-router';
import { useForgotPasswordStore } from '@/stores/forgotPassword';
import { getAccessTokenFromLS, getUserInformationFromLS } from '@/utils/auth';
import UpArrow from '@/assets/svg/UpArrow.vue';

onMounted(() => {
  idReply.value = route.query.rlcmt;
  idComment.value = route.query.cmt;
  setTimeout(() => {
    nextTick(() => {
      if (route.query.cmt && comment.value && !route.query.rlcmt) {
        const y = comment.value.getBoundingClientRect().top;
        window.scrollTo({ top: y - 200, behavior: 'smooth' });
      }
    });
  }, 1000);
  if (props?.id.toString() === idComment.value && route.query.rlcmt) isHideReply.value = true;
});

const idReply = ref(null);
const idComment = ref(null);
const comment = ref(null);

import Edit from '@/assets/svg/Edit.vue';
import Trash from '@/assets/svg/Trash.vue';
import Dialog from 'primevue/dialog';
import Button from '@/components/Button/Button.vue';
import { useReportUser } from '@/stores/reportuser';
import { useAuthStore } from '@/stores/auth';
const route = useRoute();

watch(
  () => route.query.cmt,
  () => {
    idReply.value = route.query.rlcmt;
    idComment.value = route.query.cmt;
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      nextTick(() => {
        if (route.query.cmt && comment.value && !route.query.rlcmt) {
          const y = comment.value.getBoundingClientRect().top;
          window.scrollTo({ top: y - 200, behavior: 'smooth' });
        }
      });
    }, 1000);
    if (props?.id.toString() === idComment.value && route.query.rlcmt) isHideReply.value = true;
  },
);

const commentStore = useCommentStore();
const isHideReply = ref(false);
const isAuth = getAccessTokenFromLS();
const forgotPasswordStore = useForgotPasswordStore();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  action: {
    type: Object,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  interactionCount: {
    type: Object,
    required: true,
  },
  replyComments: {
    type: Array,
    required: true,
  },
});
const showReplyCount = ref(12);
const displayComment = computed(() => {
  return props.replyComments.slice(0, showReplyCount.value);
});
const handleShowMoreReply = () => {
  showReplyCount.value += 12;
};
const router = useRouter();
const goToUserChannel = (id) => {
  router.push(`/channel/${id}`);
};
const handleLike = async (id) => {
  if (isAuth) {
    try {
      await http.phpInstance.put(`/likecomments/${id}`, {
        commentable_type: 'comment',
        status: 'like',
      });
      commentStore.handleGetComment(route.params.videoId);
    } catch (error) {
      console.error('Error Like Comment:', error);
    }
  } else {
    forgotPasswordStore.goToLoginPage();
  }
};
const handleDislike = async (id) => {
  if (isAuth) {
    try {
      await http.phpInstance.put(`/likecomments/${id}`, {
        commentable_type: 'comment',
        status: 'dislike',
      });
      commentStore.handleGetComment(route.params.videoId);
    } catch (error) {
      console.error('Error Dislike Comment:', error);
    }
  } else {
    forgotPasswordStore.goToLoginPage();
  }
};
const handleShowReplyInput = (id) => {
  if (isAuth) {
    commentStore.handleShowReplyInput(id);
  } else {
    forgotPasswordStore.goToLoginPage();
  }
};

const commentRef = computed(() => {
  return props?.id.toString() === idComment.value ? 'comment' : '';
});

const handleHideReply = () => {
  isHideReply.value = !isHideReply.value;
};

const isSuspendAccount = computed(() => {
  return props.user.ban && (props.user.ban.is_permaban || props.user.ban.ban_expired_at)
    ? true
    : false;
});

const handleDeleteComment = async () => {
  try {
    await http.nodeInstance.delete(`/comment/${props.id}`);
    commentStore.handleGetComment(route.params.videoId);
  } catch (error) {
    console.error(error);
  }
};

const isCommentRemove = ref(false);
const handleShowModalRemove = () => {
  isCommentRemove.value = true;
  isShowActiveComment.value = false;
};
const handleCloseModalRemove = () => {
  isCommentRemove.value = false;
};
const isShowActiveComment = ref(false);
const handleShowActiveComment = () => {
  isShowActiveComment.value = !isShowActiveComment.value;
};

const validUserDeleteComment = computed(() => {
  const { id } = getUserInformationFromLS();
  return id === props.user.id;
});
const storeReport = useReportUser();
const storeAuth = useAuthStore();
const handleReportChannel = () => {
  isShowActiveComment.value = false;
  if (isAuth) {
    storeReport.stepShow = 1;
    storeReport.idChannelReported = props.user.id;
  } else {
    storeAuth.showStep = 1;
  }
};

const isActiveComment = ref(false);
const handleMouseOut = () => {
  isActiveComment.value = false;
};
const handleMouseOver = () => {
  isActiveComment.value = true;
};
</script>
<style scoped>
.like-container,
.dislike-container {
  position: relative;
}

.like-active-icon {
  animation: like 0.5s;
}

.dislike-active-icon {
  animation: dislike 0.5s;
}

@keyframes like {
  0% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.5) rotate(-10deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes dislike {
  0% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.2) rotate(0deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
}

@media (max-width: 3000px) {
  .contentComment {
    max-width: 1200px;
  }
}

@media (max-width: 1900px) {
  .contentComment {
    max-width: 850px;
  }
}
</style>
