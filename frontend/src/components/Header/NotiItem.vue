<template>
  <div
    class="block text-white bg-black overflow-x-hidden animation-duration-500 overflow-y-auto"
    style="width: 340px; max-height: 392px"
  >
    <div class="text-center font-bold py-4">Notifications</div>
    <div class="line--white" style="width: 100%"></div>
    <ul style="width: 340px" v-if="props?.listNoti?.length > 0">
      <li
        class="relative pb-8 pt-3 px-3 cursor-pointer"
        :class="{ 'bg-primary-text-color': !item.is_read }"
        v-for="(item, index) in props.listNoti"
        :key="item.id"
        @click="handleClickItemNoti(item)"
      >
        <div class="flex relative">
          <div class="item__avatar">
            <img :src="item.user.avatar_url" alt="" class="w-10 h-10 rounded-full" />
          </div>
          <div class="item__content text-xs ml-2">
            <p v-if="item.notification_type === 'comment'">
              <span class="font-bold">{{ item.user.username }}</span> has commented to your video.
            </p>
            <p v-if="item.notification_type === 'reply_comment'">
              <span class="font-bold">{{ item.user.username }}</span> has replied to your comment.
            </p>
            <p v-if="item.notification_type === 'follow'">
              <span class="font-bold">{{ item.user.username }}</span> has followed you.
            </p>
            <p class="absolute top-11">
              {{ formatDistanceToNow(new Date(item.updated_at), { addSuffix: true }) }}
            </p>
          </div>
        </div>
        <div
          class="line--white absolute bottom-0 mx-auto"
          v-if="index !== props.listNoti.length - 1"
        ></div>
      </li>
    </ul>
    <ul style="width: 340px; height: 80px" class="text-center" v-else>
      <li class="mt-12">No New Notifications</li>
    </ul>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'vue-router';

const emit = defineEmits(['closeNotiList']);
const props = defineProps({
  listNoti: Array,
});
const router = useRouter();

const handleClickItemNoti = (item) => {
  if (item.notification_type === 'follow') {
    router
      .push({
        path: `/channel/${item.user.id}`,
      })
      .then(() => {
        emit('closeNotiList');
      });
  } else if (item.notification_type === 'comment') {
    router
      .push({
        path: `/video/${item.notification_content_id.video_id}`,
        query: { cmt: item.notification_content_id.comment_id },
      })
      .then(() => {
        emit('closeNotiList');
      });
  } else {
    router
      .push({
        path: `/video/${item.notification_content_id.video_id}`,
        query: {
          cmt: item.notification_content_id.comment_id,
          rlcmt: item.notification_content_id.comment_reply_id,
        },
      })
      .then(() => {
        emit('closeNotiList');
      });
  }
};
</script>

<style scoped>
.line--white {
  width: calc(100% - 24px);
  height: 1px;
  background-color: #fff;
}
</style>
