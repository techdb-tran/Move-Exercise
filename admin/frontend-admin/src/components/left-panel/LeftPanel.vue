<template>
  <div
    class="w-60 fixed h-screen mt-14 pb-12 border-2 border-solid border-r-zinc-300 sidebar top-0 bg-primary-white-color overflow-scroll"
  >
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-bold text-base text-nowrap" v-show="isOpenSidebar">Dashboard</h4>
      </div>
      <div>
        <ul class="flex flex-col gap-3">
          <li
            v-for="item in dataLeftPanel"
            :key="item.index"
            :index="item.name"
            ref="itemList"
            class=""
          >
            <RouterLink
              :to="item.path"
              activeClass="bg-primary-black-color text-primary-color pl-3 text-base font-bold"
              class="flex items-center gap-2 text-base p-1 hover:text-primary-color hover:bg-primary-black-color hover:pl-3 duration-500 rounded-3xl hover:font-bold"
            >
              <i :class="item.icon"></i><span>{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const dataLeftPanel = [
  { index: 1, path: '/overview', icon: 'pi pi-chart-line', name: 'Overview' },
  { index: 2, path: '/user-list', icon: 'pi pi-users', name: 'User list' },
  { index: 3, path: '/report-list', icon: 'pi pi-flag-fill', name: 'Report list' },
  { index: 4, path: '/video-list', icon: 'pi pi-youtube', name: 'Video list' },
  { index: 5, path: '/category-list', icon: 'fa-solid fa-list', name: 'Category list' },
  { index: 6, path: '/featured-video', icon: 'pi pi-star-fill', name: 'Featured video' }
];

const itemList = ref([]);
let isOpenSidebar = ref(true);
</script>

<style scoped>
.sidebar {
  transition: 0.5s;
  z-index: 999;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 9px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 9px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

button:hover {
  background-color: var(--primary-color-hover);
}

.sidebar-container--signup-btn:hover {
  color: black;
  background-color: var(--primary-white-color);
}

.active {
  background-color: var(--primary-black-color);
  color: var(--primary-color);
  padding-left: 20px;
  font-weight: 700;
}
</style>
