import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import http from '@/utils/http';

export const useFollowChannelStore = defineStore('followChannel', () => {
    const isLoadingFollowers = ref(true);
    const saveDataFollowed = ref([]);
    const isRender = ref(true);
    const dataFollowers = ref();
    const isShowBrowse = ref(false);
    const idUser = ref()
    const pageFollowed = ref(1);
    const isFollowing = ref()

    const getFollowData = async (page) => {
        console.log('1');
        isLoadingFollowers.value = true;
        try {
            const response = await http.nodeInstance.get(`/follow/followed-channels?page=${page}&page_size=18`);
            saveDataFollowed.value = [...toRaw(saveDataFollowed.value), ...response.data.metadata.data];
            isRender.value = true;
            dataFollowers.value = response.data.metadata.pagination.totalPages;
            isLoadingFollowers.value = false;
            if (saveDataFollowed.value.length === 0) {
                isShowBrowse.value = true;
            } else {
                isShowBrowse.value = false;
            }
        } catch (error) {
            console.error(error);
        }
    };

    const reloadFollower = async (page) => {
        console.log('2');
        try {
            const response = await http.nodeInstance.get(`/follow/followed-channels?page=${page}&page_size=18`);
            saveDataFollowed.value = [...response.data.metadata.data];
            dataFollowers.value = response.data.metadata.pagination.totalPages;
        } catch (error) {
            console.error(error);
        }

        if (saveDataFollowed.value.length === 0) {
            isShowBrowse.value = true;
        } else {
            isShowBrowse.value = false;
        }
    }


    return {
        isLoadingFollowers,
        saveDataFollowed,
        isRender,
        dataFollowers,
        isShowBrowse,
        idUser,
        pageFollowed,
        isFollowing,
        getFollowData,
        reloadFollower,
    };
});
