import http from '@/utils/http';

export const getCategories = () => http.nodeInstance.get('/categories');

export const getFeaturedCarousel = () => http.nodeInstance.get('/featured-carousel');

export const getWatchAlsoVideos = (videoId) =>
  http.nodeInstance.get(`/video/watch-also/${videoId}`);

export const getTopVideos = (page, page_size, category, level, sort_by, sort_order) => {
  return http.nodeInstance.get(`/video/top-videos`, {
    params: {
      page,
      page_size,
      category,
      level,
      sort_by,
      sort_order,
    },
  });
};
export const getVideoAnalytics = (page, page_size, sort_by, sort_order, start_date, end_date)=>{
    return http.nodeInstance.get('/analytic/videos',{
      params:{
        page,
        page_size,
        sort_by,
        sort_order,
        start_date,
        end_date
      }
    })
}

export const getVideosYouMayLike = (page) =>
  http.nodeInstance.get('/video/video-you-may-like', { params: { page } });

export const getVideoDetail = (videoId) => http.phpInstance.get(`/videos/${videoId}`);

export const postFollowUser = (userId) => http.nodeInstance.post(`/follow/follow-user/${userId}`);

export const putRateVideo = (videoId, rateValue) =>
  http.phpInstance.put(`/rates/${videoId}`, {
    rate: rateValue,
  });

export const postCreateVideoView = (videoId, viewTime) =>
  http.phpInstance.post('/viewvideos', {
    video_id: videoId,
    time: viewTime,
  });

export const putUpdateVideoView = (viewId, viewTime) =>
  http.phpInstance.put(`/viewvideos/${viewId}`, {
    time: Number(viewTime),
  });
