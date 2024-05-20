import { createRouter, createWebHistory } from 'vue-router';
import ReportListPage from '@/views/report_list/ReportListPage.vue';
import UserListPage from '@/views/user_list/UserListPage.vue';
import AdminLayout from '@/layout/AdminLayout.vue';
import LoginAdmin from '@/views/login_admin/LoginAdmin.vue';
import { getAccessTokenFromLS } from '/src/utils/ls.js';
import VideoListPage from '@/views/video_list/VideoListPage.vue';
import CategoryList from '@/views/category_list/CategoryList.vue';
import Overview from '@/components/overview/Overview.vue';
import FeaturedVideo from '@/views/featured_video/FeaturedVideo.vue';
import PageNotFound from '@/views/page-not-found/PageNotFound.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin-login',
      component: LoginAdmin
    },
    {
      path: '/',
      name: 'admin-layout',
      component: AdminLayout,
      children: [
        {
          path: 'overview',
          name: 'overview',
          component: Overview,
          meta: { requiresAuth: true }
        },
        {
          path: 'report-list',
          name: 'report-list',
          component: ReportListPage,
          meta: { requiresAuth: true }
        },
        {
          path: 'user-list',
          name: 'user-list',
          component: UserListPage,
          meta: { requiresAuth: true }
        },
        {
          path: 'video-list',
          name: 'video-list',
          component: VideoListPage,
          meta: { requiresAuth: true }
        },
        {
          path: 'featured-video',
          name: 'featured-video',
          component: FeaturedVideo,
          meta: { requiresAuth: true }
        },
        {
          path: 'category-list',
          name: 'category-list',
          component: CategoryList,
          meta: { requiresAuth: true }
        }
      ]
    },
    { path: "/:pathMatch(.*)*", component: PageNotFound }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === '/' && getAccessTokenFromLS()) {
    next('/overview');
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!getAccessTokenFromLS()) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
