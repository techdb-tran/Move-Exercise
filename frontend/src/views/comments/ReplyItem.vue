<template>
  <div
    class="replyItem mt-8 h-fit flex align-center w-auto"
    :ref="replyRef"
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
    <div class="ml-3 flex flex-col w-full">
      <div
        style="margin: -4px -24px -8px -8px"
        :class="{
          'bg-gray-100': props?.id.toString() === idReply,
          'rounded-lg': props?.id.toString() === idReply,
        }"
      >
        <div class="flex w-full px-2 pt-1">
          <div class="flex w-fit" v-if="!isSuspendAccount">
            <div class="cursor-pointer font-bold" @click="goToUserChannel(user.id)">
              {{ user.username }}
            </div>
            <VerifiedBadge class="ml-3.5 m-auto" v-if="user.is_verified" />
          </div>
          <div v-if="isSuspendAccount">
            <p class="font-bold">Suspended MOVE Account</p>
          </div>
          <p class="ml-[9.9px] text-primary-text-color">
            {{ formatDistanceToNow(new Date(createdAt), { addSuffix: true }) }}
          </p>
          <div v-show="isAuth && isActiveReply" class="ml-auto">
            <div class="relative ml-[-20px]" v-if="validUserDeleteReply">
              <Edit @click="handleShowActiveReply" />
              <div
                v-if="isShowActiveReply"
                class="absolute bg-white w-[100px] h-[36px] border-[1px] border-primary-color rounded-xl right-[50%] p-[8px]"
              >
                <div class="cursor-pointer flex" @click="handleShowModalRemove">
                  <Trash />
                  <h2 class="text-primary-color text-sm ml-[4px]">Delete</h2>
                </div>
              </div>
            </div>
            <div class="relative ml-[-20px]" v-if="!validUserDeleteReply && !isSuspendAccount">
              <Edit @click="handleShowActiveReply" />
              <div
                v-if="isShowActiveReply"
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
        <div
          class="contentReply max-w-[800px] h-fit whitespace-normal break-words px-2 pb-1"
          v-if="!isSuspendAccount"
        >
          <p>{{ content }}</p>
        </div>
        <div v-if="isSuspendAccount">
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
        </div>
      </div>
    </div>
  </div>
  <Dialog
    :draggable="false"
    v-model:visible="isReplyRemove"
    modal
    :style="{ width: '20rem' }"
    class="px-4"
  >
    <template #header>
      <div class="flex flex-col">
        <h1 class="text-lg font-bold mt-2">Delete Reply</h1>
        <p>Permanently delete your reply.</p>
        <div class="flex justify-center gap-10 items-center -translate-y-6">
          <p @click="handleCloseModalRemove" class="text-primary-color mt-10 px-2 cursor-pointer">
            Cancel
          </p>
          <div>
            <Button width="170px" :isSubmitted="true" @click="handleDeleteReply">Delete</Button>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import DislikeActive from '@/assets/svg/DislikeActive.vue';
import Dislike from '@/assets/svg/Dislike.vue';
import Like from '@/assets/svg/Like.vue';
import LikeActive from '@/assets/svg/LikeActive.vue';
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue';
import { formatDistanceToNow } from 'date-fns';
import http from '@/utils/http';
import { useRoute, useRouter } from 'vue-router';
import { useForgotPasswordStore } from '@/stores/forgotPassword';
import { useCommentStore } from '@/stores/comment';
import { getAccessTokenFromLS } from '@/utils/auth';
import { getUserInformationFromLS } from '@/utils/auth';
import { computed, onMounted, ref, nextTick, watch } from 'vue';

onMounted(() => {
  idReply.value = route.query.rlcmt;
  setTimeout(() => {
    nextTick(() => {
      if (route.query.rlcmt && reply.value) {
        const y = reply.value.getBoundingClientRect().top;
        window.scrollTo({ top: y - 200, behavior: 'smooth' });
      }
    });
  }, 1000);
});

const reply = ref();
const idReply = ref('');
import Edit from '@/assets/svg/Edit.vue';
import Trash from '@/assets/svg/Trash.vue';
import Dialog from 'primevue/dialog';
import Button from '@/components/Button/Button.vue';
import { useReportUser } from '@/stores/reportuser';
import { useAuthStore } from '@/stores/auth';
const route = useRoute();

watch(
  () => route.query.rlcmt,
  () => {
    window.scrollTo({ top: 0 });
    idReply.value = route.query.rlcmt;
    setTimeout(() => {
      nextTick(() => {
        if (route.query.rlcmt && reply.value) {
          const y = reply.value.getBoundingClientRect().top;
          window.scrollTo({ top: y - 200, behavior: 'smooth' });
        }
      });
    }, 1000);
  },
);
const forgotPasswordStore = useForgotPasswordStore();
const commentStore = useCommentStore();
const isAuth = getAccessTokenFromLS();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
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
  action: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

const replyRef = computed(() => {
  return props?.id.toString() === idReply.value ? 'reply' : '';
});

const isSuspendAccount = computed(() => {
  return props.user.ban && (props.user.ban.is_permaban || props.user.ban.ban_expired_at)
    ? true
    : false;
});
const router = useRouter();
const goToUserChannel = (id) => {
  router.push(`/channel/${id}`);
};
const handleLike = async (id) => {
  if (isAuth) {
    try {
      await http.phpInstance.put(`/likecomments/${id}`, {
        commentable_type: 'reply_comment',
        status: 'like',
      });
      commentStore.handleGetComment(route.params.videoId);
    } catch (error) {
      console.error('Error Like Reply:', error);
    }
  } else {
    forgotPasswordStore.goToLoginPage();
  }
};
const handleDislike = async (id) => {
  if (isAuth) {
    try {
      await http.phpInstance.put(`/likecomments/${id}`, {
        commentable_type: 'reply_comment',
        status: 'dislike',
      });
      commentStore.handleGetComment(route.params.videoId);
    } catch (error) {
      console.error('Error Dislike Reply:', error);
    }
  } else {
    forgotPasswordStore.goToLoginPage();
  }
};
const isShowActiveReply = ref(false);
const handleShowActiveReply = () => {
  isShowActiveReply.value = !isShowActiveReply.value;
};
const validUserDeleteReply = computed(() => {
  const { id } = getUserInformationFromLS();
  return id === props.user.id;
});
const isReplyRemove = ref(false);
const handleShowModalRemove = () => {
  isReplyRemove.value = true;
  isShowActiveReply.value = false;
};
const handleCloseModalRemove = () => {
  isReplyRemove.value = false;
};
const handleDeleteReply = async () => {
  try {
    await http.nodeInstance.delete(`/reply-comment/${props.id}`);
    commentStore.handleGetComment(route.params.videoId);
  } catch (error) {
    console.error(error);
  }
};
const storeReport = useReportUser();
const storeAuth = useAuthStore();
const handleReportChannel = (id) => {
  isShowActiveReply.value = false;
  if (isAuth) {
    storeReport.stepShow = 1;
    storeReport.idChannelReported = props.user.id;
  } else {
    storeAuth.showStep = 1;
  }
};
const isActiveReply = ref(false);
const handleMouseOver = () => {
  isActiveReply.value = true;
};
const handleMouseOut = () => {
  isActiveReply.value = false;
};
</script>
<style scoped>
.like-container,
.dislike-container {
  position: relative;
}

@media (max-width: 3000px) {
  .contentReply {
    max-width: 1200px;
  }
}

@media (max-width: 1900px) {
  .contentReply {
    max-width: 798px;
  }
}
</style>
