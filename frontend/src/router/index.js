import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home/Home.vue';
import Profile from '../views/Profile/Profile.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import StreamerLayout from '@/layouts/StreamerLayout.vue';
import OfflineChannel from '@/views/OfflineChannel/OfflineChannel.vue';
import ForgotPassWord from '@/components/ForgotPassWord/ForgotPassWord.vue';
import CreateNewPassWord from '@/components/CreateNewPassWord/CreateNewPassWord.vue';
import SuccessResetPassWord from '@/components/CreateNewPassWord/SuccessResetPassWord.vue';
import VerificationFailed from '@/components/CreateNewPassWord/VerificationFailed.vue';
import CommunityGuidelines from '@/components/CommunityGuidelines/CommunityGuidelines.vue';
import VideoDetail from '@/views/videoDetail/VideoDetail.vue';
import Suspended from '@/components/Suspended/Suspended.vue';
import PermaBan from '@/components/PermaBan/PermaBan.vue';
import Faq from '../views/faq/Faq.vue';
import VideoAnalytics from '@/views/videoAnalytics/VideoAnalytics.vue';
import StreamerOverview from '../views/Streamer/StreamerOverview.vue';
import Browse from '@/views/browse/Browse.vue';
import SearchResult from '@/views/searchs/SearchResult.vue';
import Videos from '@/views/videos/Videos.vue';
import { getAccessTokenFromLS } from '../utils/auth.js';
import VideoAnalyticsDetail from '@/views/videoAnalytics/VideoAnalyticsDetail.vue';
import BrowseCategoriesDetails from '@/views/browse/BrowseCategoriesDetails.vue';
import NotFound from '@/views/not_found/NotFound.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'userLayout',
      component: UserLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: 'profile',
          name: 'profile',
          component: Profile,
          meta: { requiresAuth: true },
        },
        {
          path: '/channel/:userId',
          name: 'channel',
          component: OfflineChannel,
          props: true,
        },
        {
          path: 'browse',
          name: 'browse',
          component: Browse,
        },
        {
          path: 'category/:categoryId',
          name: 'category',
          component: BrowseCategoriesDetails,
        },
        {
          path: 'video/:videoId',
          name: 'video',
          component: VideoDetail,
        },
        {
          path: '/search',
          name: 'search',
          component: SearchResult,
        },
      ],
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassWord,
    },
    {
      path: '/reset-password/:token/:email',
      name: 'reset-password',
      component: CreateNewPassWord,
      props: true,
    },
    {
      path: '/success-reset',
      name: 'success-reset',
      component: SuccessResetPassWord,
    },
    {
      path: '/verification-failed/:token/:email',
      name: 'verification-failed',
      component: VerificationFailed,
      props: true,
    },
    {
      path: '/community-guidelines',
      name: 'community-guidelines',
      component: CommunityGuidelines,
    },
    {
      path: '/faq',
      name: 'faq',
      component: Faq,
    },
    {
      path: '/streamer',
      name: 'streamerLayout',
      component: StreamerLayout,
      children: [
        {
          path: '',
          name: 'streamerOverview',
          component: StreamerOverview,
        },
        {
          path: 'videoAnalytics',
          name: 'streamerVideoAnalytics',
          component: VideoAnalytics,
        },
        {
          path: 'video-analytics-detail/:videoId',
          name: 'videoAnalyticsDetail',
          component: VideoAnalyticsDetail,
        },
        {
          path: 'videos',
          name: 'streamerVideos',
          component: Videos,
        },
        {
          path: 'channelSettings',
          name: 'streamerChannelSettings',
        },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
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
