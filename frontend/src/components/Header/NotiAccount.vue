<template>
  <div class="relative" v-on-click-outside="handleClickOutside">
    <div @click="handleToggleOpenNoti">
      <img src="@/assets/images/bell-icon.svg" alt="icon" class="relative cursor-pointer" />
      <div
        class="absolute bg-misc-orange-color cursor-pointer font-semibold w-6 h-5 rounded-full text-white justify-center text-xs flex items-center"
        style="right: -10px; top: -8px"
        v-if="numberNotiUnread > 0"
      >
        {{ numberNotiUnread < 100 ? numberNotiUnread : '99+' }}
      </div>
    </div>
    <Transition name="popup">
      <NotiItem
        class="absolute top-11 right-0 rounded"
        v-show="isShowNoti"
        :listNoti="listNoti"
        v-on:scroll="handleScroll"
        @closeNotiList="handleClickOutside"
      />
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import NotiItem from '@/components/Header/NotiItem.vue';
import http from '@/utils/http';

const isShowNoti = ref(false);
const numberNotiUnread = ref(0);
const listNoti = ref();
const pageNum = ref(1);

const handleToggleOpenNoti = async () => {
  const numberNotiNeedToRead = numberNotiUnread.value;
  isShowNoti.value = !isShowNoti.value;
  if (isShowNoti.value) {
    getListNoti();
    numberNotiUnread.value = 0;
    if (numberNotiNeedToRead)
      await http.nodeInstance(`notification/?page=1&page_size=${numberNotiNeedToRead}`);
  } else {
    pageNum.value = 1;
  }
};

const handleClickOutside = () => {
  isShowNoti.value = false;
};

const getListNoti = async () => {
  const res = await http.nodeInstance(`notification/?page=1&page_size=20`);
  listNoti.value = res.data.metadata;
  if (numberNotiUnread.value) {
    await http.nodeInstance(`notification/?page=1&page_size=${toRaw(numberNotiUnread.value)}`);
  }
  listNoti.value.forEach((notification) => {
    if (notification.notification_content_id !== null) {
      notification.notification_content_id = JSON.parse(
        JSON.parse(notification.notification_content_id),
      );
    }
  });
};

const handleLoadMoreNoti = async () => {
  const res = await http.nodeInstance(`notification/?page=${pageNum.value}&page_size=10`);
  listNoti.value = [...listNoti.value, ...res.data.metadata];
};

const getNumberNotiUnread = async () => {
  const res = await http.nodeInstance(`notification/count-unread`);
  numberNotiUnread.value = res.data.metadata;
};

const handleScroll = (event) => {
  const bottomOfWindow =
    event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
  if (bottomOfWindow) {
    pageNum.value++;
    handleLoadMoreNoti();
  }
};

onMounted(() => {
  getNumberNotiUnread();
  setInterval(getNumberNotiUnread, 30000);
});
</script>

<style scoped>
/* transition for popup account */
.popup-enter-active {
  transition: all 0.3s ease-in;
}

.popup-leave-active {
  transition: all 0.3s ease-out;
}

.popup-enter-from,
.popup-leave-to {
  transform: translateY(-2px);
  opacity: 0;
}

.popup-search-transition-enter-active,
.popup-search-transition-leave-active {
  transition: opacity 0.3s ease;
}

.popup-search-transition-enter-from,
.popup-search-transition-leave-to {
  opacity: 0;
}

/* transition for popup account */
</style>
