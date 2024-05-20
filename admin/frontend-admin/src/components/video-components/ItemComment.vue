<template>
  <div class="flex w-full justify-between items-center mb-4">
    <!-- Comment isNotRemoved -->
    <div class="w-full" v-if="props.item?.user?.ban?.is_permaban === 0">
      <div class="flex justify-between w-full items-center itemComment">
        <div class="flex">
          <div style="min-width: 40px; height: 40px">
            <img class="rounded-full w-10 h-full" :src="props.item?.user?.avatar_url" />
          </div>
          <div class="w-full ml-4">
            <div class="flex items-center">
              <div class="font-semibold mr-1">{{ props.item?.user?.username }}</div>
              <VerifiedBadge v-if="props.item?.user.is_verified" />
              <div class="text-sm opacity-70 ml-2">
                {{ formatDistanceToNow(new Date(props.item?.created_at * 1000)) }}
              </div>
            </div>
            <div class="">{{ props.item?.content }}</div>
            <div class="flex items-center mt-2">
              <LikeButton class="mr-1" />
              <span class="mr-4">{{ props.item?.interactionCount?.like_count }}</span>
              <DislikeButton class="mr-1.5" />
              <span class="">{{ props.item?.interactionCount?.dislike_count }}</span>
            </div>
          </div>
        </div>
        <div class="buttonDelete">
          <ButtonConfirm
            :id="props.item?.id"
            :typeComment="'Comment'"
            @reRenderComment="reRenderComment"
          />
        </div>
      </div>
      <div
        v-for="item in props.item?.reply_comments"
        :key="item.id"
        class="ml-14 mt-4 flex replyComment"
      >
        <div
          class="flex items-center justify-between w-full"
          v-if="item.user?.ban?.is_permaban === 0"
        >
          <div class="flex">
            <img
              class="rounded-full w-full h-full"
              style="width: 40px; height: 40px"
              :src="item.user?.avatar_url"
              alt="avatar"
            />
            <div class="w-full ml-4">
              <div class="flex items-center">
                <div class="font-semibold mr-1">{{ item.user?.username }}</div>
                <VerifiedBadge v-if="props.item?.user?.is_verified" />
                <div class="text-sm opacity-70 ml-2">
                  {{ formatDistanceToNow(new Date(props.item?.created_at * 1000)) }}
                </div>
              </div>
              <div class="">{{ item.content }}</div>
              <div class="flex items-center mt-2">
                <LikeButton class="mr-1" />
                <span class="mr-4">{{ item.interactionCount?.like_count }}</span>
                <DislikeButton class="mr-1" />
                <span class="">{{ item.interactionCount?.dislike_count }}</span>
              </div>
            </div>
          </div>
          <div class="replyItem">
            <ButtonConfirm
              :id="item.id"
              :typeComment="'Reply'"
              @reRenderComment="reRenderComment"
            />
          </div>
        </div>
        <div class="flex items-center justify-between w-full" v-if="item.user?.ban?.is_permaban">
          <div class="flex">
            <img
              class="rounded-full w-full h-full"
              style="width: 40px; height: 40px"
              src="@/assets/images/SuspendAvatarComment.png"
              alt="avatar"
            />
            <div class="w-full ml-4">
              <div class="flex items-center">
                <div class="font-semibold">Suspended MOVE Account</div>
                <div class="text-sm opacity-70 ml-2">
                  {{ formatDistanceToNow(new Date(props.item?.created_at * 1000)) }}
                </div>
              </div>
              <div class="opacity-80 italic">
                [This comment has been removed due to violation of community guideline]
              </div>
            </div>
          </div>
          <div class="buttonDelete">
            <ButtonConfirm
              :id="props.item?.id"
              :typeComment="'Comment'"
              @reRenderComment="reRenderComment"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Comment isRemoved -->
    <div
      class="flex justify-between w-full items-center"
      v-if="props.item.user?.ban?.is_permaban === 1"
    >
      <div class="flex">
        <img
          class="rounded-full w-full h-full"
          style="width: 40px; height: 40px"
          src="@/assets/images/SuspendAvatarComment.png"
          alt="avatar"
        />
        <div class="w-full ml-4">
          <div class="flex items-center">
            <div class="font-semibold">Suspended MOVE Account</div>
            <div class="text-sm opacity-70 ml-2">
              {{
                formatDistanceToNow(new Date(props.item?.created_at * 1000), { addSuffix: true })
              }}
            </div>
          </div>
          <div class="opacity-80 italic">
            [This comment has been removed due to violation of community guideline]
          </div>
        </div>
      </div>
      <div class="buttonDelete">
        <ButtonConfirm
          :id="props.item?.id"
          :typeComment="'Comment'"
          @reRenderComment="reRenderComment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import VerifiedBadge from '@/components/UI/VerifiedBadge.vue';
import ButtonConfirm from '@/components/video-components/ButtonConfirm.vue';
import DislikeButton from '../UI/DislikeButton.vue';
import LikeButton from '../UI/LikeButton.vue';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps({
  item: Object
});
const emit = defineEmits(['reRenderComment']);
const reRenderComment = () => {
  emit('reRenderComment');
};
</script>

<style scoped>
.buttonDelete {
  display: none;
}
.itemComment:hover .buttonDelete {
  display: block;
}
.replyComment:hover .replyItem {
  display: block;
}

.replyItem {
  display: none;
}
</style>
