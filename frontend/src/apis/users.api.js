import http from '@/utils/http';

export const postFollowUser = (userId) => http.nodeInstance.post(`/follow/follow-user/${userId}`);
