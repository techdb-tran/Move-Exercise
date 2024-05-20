import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
const url = import.meta.env.VITE_URL_SERVER_PHP;

export const useReportUser = defineStore('reportuser', () => {
  const stepShow = ref(0); //start in 1 to 4, end: 10
  const idChannelReported = ref('');
  //idReason for Post API - reason for render to user
  const reasonReport = ref('');
  const idReasonReport = ref('');
  const listReasonReport = ref([]);
  const nextStep = () => {
    stepShow.value++;
  };
  const endShow = () => {
    stepShow.value = 10;
  };
  const createIdChannelReported = (id) => {
    idChannelReported.value = id;
  };
  const createReasonReport = (idReason, reason) => {
    reasonReport.value = reason;
    idReasonReport.value = idReason;
  };
  const getReasonReport = async () => {
    const data = await axios.get(`${url}typereport`);
    listReasonReport.value = data.data.data;
  };
  (async () => {
    await getReasonReport();
  })();
  
  return {
    listReasonReport,
    stepShow,
    nextStep,
    endShow,
    idChannelReported,
    reasonReport,
    createIdChannelReported,
    createReasonReport,
    idReasonReport
  };
});