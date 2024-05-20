<template>
  <section>
    <div class="w-11/12 mt-[90px] ml-6">
      <RouterLink to="/streamer/videoAnalytics" class="flex items-center text-primary-color"
        ><ArrowBack></ArrowBack><span class="ml-4">Back to video analytics</span></RouterLink
      >
      <div class="flex justify-between items-center">
        <div class="text-primary-black-color font-bold text-2xl mt-4">In-depth analytics</div>
        <div class="flex items-center">
          <div class="font-bold text-xs mr-4">SHOW</div>
          <Dropdown
            v-model="selectedDay"
            :options="days"
            optionLabel="name"
            placeholder="Last 7 days"
            class="w-[154px] h-10"
            @change="selectShowDay"
          />
        </div>
      </div>
      <div class="flex gap-12 mt-2">
        <div class="basis-[30%]">
          <img
            :src="
              dataVideoAnalytic?.thumbnail
                ? dataVideoAnalytic?.thumbnail
                : '/src/assets/images/defaultThumbnail.png'
            "
            class="w-full h-[164px] 2xl:h-[260px]"
            alt="video image"
          />
          <div class="font-bold text-sm mt-2">
            {{ dataVideoAnalytic?.title }}
          </div>
          <div class="text-sm text-primary-text-color mb-8">
            {{ dataVideoAnalytic?.category_name }}
          </div>
          <div class="flex justify-between">
            <div class="text-sm text-primary-text-color">VIEWS</div>
            <div class="text-primary-black-color text-sm">
              {{ formatNumber(dataVideoAnalytic?.count_view) }}
            </div>
          </div>
          <div class="flex justify-between mt-3">
            <div class="text-sm text-primary-text-color">AVG. VIEW TIME</div>
            <div class="text-primary-black-color text-sm">
              {{ formatSecond(Math.floor(dataVideoAnalytic?.average_view_time)) }}
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <div class="text-sm text-primary-text-color">RATINGS</div>
            <div class="flex items-center">
              <div class="text-primary-black-color text-sm mr-2">
                {{ formatRating(dataVideoAnalytic?.average_rates) }}
              </div>
              <StartRate></StartRate>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <div class="text-sm text-primary-text-color">PUBLISHED ON</div>
            <div class="flex items-center">
              <div class="text-primary-black-color text-sm">
                {{ formatDateVideoAna(dataVideoAnalytic?.created_at) }}
              </div>
            </div>
          </div>
        </div>
        <div class="basis-[70%]">
          <div class="text-lg text-primary-black-color font-bold">Demographics</div>
          <TabView @tab-change="handleTabChange">
            <TabPanel
              :headerClass="selectedTab === 'Gender' ? 'browse-tabview-header-text-active' : ''"
              header="Gender"
            >
              <div class="grid grid-cols-3 gap-5">
                <div class="w-full h-[120px] rounded-xl shadow-overview px-4 pt-2">
                  <div class="text-primary-black-color font-bold text-sm mt-2">Male</div>
                  <div class="mt-2">
                    <span class="text-primary-black-color font-bold text-3xl mr-2">{{
                      formatNumber(dataDemographicsByGender?.male)
                    }}</span>
                    <span class="text-lg text-primary-text-color"
                      >({{
                        formatPercentNumberOfDetailAnalytics(
                          dataDemographicsByGender?.male_percentage,
                        )
                      }}%)</span
                    >
                  </div>
                </div>
                <div class="w-full h-[120px] rounded-xl shadow-overview px-4 pt-2">
                  <div class="text-primary-black-color font-bold text-sm mt-2">Female</div>
                  <div class="mt-2">
                    <span class="text-primary-black-color font-bold text-3xl mr-2">{{
                      formatNumber(dataDemographicsByGender?.female)
                    }}</span>
                    <span class="text-lg text-primary-text-color"
                      >({{
                        formatPercentNumberOfDetailAnalytics(
                          dataDemographicsByGender?.female_percentage,
                        )
                      }}%)</span
                    >
                  </div>
                </div>
                <div class="w-full h-[120px] rounded-xl shadow-overview px-4 pt-2">
                  <div class="text-primary-black-color font-bold text-sm mt-2">Rather not say</div>
                  <div class="mt-2">
                    <span class="text-primary-black-color font-bold text-3xl mr-2">{{
                      formatNumber(dataDemographicsByGender?.other)
                    }}</span>
                    <span class="text-lg text-primary-text-color"
                      >({{
                        formatPercentNumberOfDetailAnalytics(
                          dataDemographicsByGender?.other_percentage,
                        )
                      }}%)</span
                    >
                  </div>
                </div>
                <div class="w-full h-[120px] rounded-xl shadow-overview px-4 pt-2">
                  <div class="text-primary-black-color font-bold text-sm mt-2">Unknown</div>
                  <div class="mt-2">
                    <span class="text-primary-black-color font-bold text-3xl mr-2">{{
                      formatNumber(dataDemographicsByGender?.unknown)
                    }}</span>
                    <span class="text-lg text-primary-text-color"
                      >({{
                        formatPercentNumberOfDetailAnalytics(
                          dataDemographicsByGender?.unknown_percentage,
                        )
                      }}%)</span
                    >
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel
              header="Age"
              :headerClass="selectedTab === 'Age' ? 'browse-tabview-header-text-active' : ''"
            >
              <div class="mb-10">
                <ChartAge :propDataDemographicsByAge="dataDemographicsByAge" />
              </div>
            </TabPanel>
            <TabPanel
              header="Country"
              :headerClass="selectedTab === 'Country' ? 'browse-tabview-header-text-active' : ''"
            >
              <div class="w-[70%] shadow-overview rounded-lg">
                <div v-if="!dataDemographicsByCityOfCountry" class="p-6 mb-10">
                  <div class="font-bold text-primary-black-color">Most viewers by country</div>
                  <div v-for="(value, key, index) in dataDemographicsByCountry" :key="key" class="">
                    <div
                      class="flex justify-between mt-[18px]"
                      v-if="index + 1 < dataDemographicsByCountryObject.length"
                    >
                      <div>
                        <span class="w-[20px] mr-4 inline-block">{{ key }}</span
                        ><span
                          class="hover:text-primary-color hover:cursor-pointer hover:underline-offset-4 hover:underline"
                          @click="loadDataDemographicsByCityOfCountry(key)"
                          >{{ value?.country_name }}</span
                        >
                      </div>
                      <div>
                        <span class="font-bold text-primary-black-color">{{
                          formatNumber(value?.count)
                        }}</span
                        ><span class="ml-2"
                          >({{ formatPercentNumberOfDetailAnalytics(value?.percentage) }}%)</span
                        >
                      </div>
                    </div>
                    <div v-else class="flex justify-between mt-[18px]">
                      <div class="flex items-center">
                        <span class="mr-4"><Unknown class="w-[20px]"></Unknown></span>
                        <span>{{ key }}</span>
                      </div>
                      <div>
                        <span class="font-bold text-primary-black-color">{{
                          formatNumber(value?.count)
                        }}</span
                        ><span class="ml-2"
                          >({{ formatPercentNumberOfDetailAnalytics(value?.percentage) }}%)</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="p-6 mb-10">
                  <div class="font-bold text-primary-black-color">
                    <div
                      class="flex items-center cursor-pointer w-[170px]"
                      @click="clickToGetDataDemographicsByCityOfCountry"
                    >
                      <BackToCountries /><span class="ml-3 text-primary-color font-normal"
                        >Back to countries</span
                      >
                    </div>
                  </div>
                  <div class="font-bold text-primary-black-color my-4">
                    {{ dataDemographicsByCityOfCountry.country_name }} ({{
                      formatNumber(dataDemographicsByCityOfCountry.total_state)
                    }})
                  </div>
                  <div
                    v-for="(value, key) in dataDemographicsByCityOfCountry.state_data"
                    :key="key"
                    class="flex justify-between mt-[18px]"
                  >
                    <div>
                      <span class="mr-4 inline-block">{{ key }}</span>
                    </div>
                    <div>
                      <span class="font-bold text-primary-black-color">{{
                        formatNumber(value?.count)
                      }}</span
                      ><span class="ml-2"
                        >({{ formatPercentNumberOfDetailAnalytics(value?.percentage) }}%)</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import ArrowBack from '@/assets/svg/ArrowBack.vue';
import Dropdown from 'primevue/dropdown';
import { ref, onMounted } from 'vue';
import StartRate from '@/assets/svg/StartRate.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ChartAge from '@/components/chart/ChartAge.vue';
import Unknown from '@/assets/svg/Unknown.vue';
import http from '@/utils/http.js';
import { formatDateVideoAna, formatSecond, formatRating } from '@/utils/formatDate';
import { formatNumber, formatPercentNumberOfDetailAnalytics } from '@/utils/formatNumber.js';
import { useRoute } from 'vue-router';
import BackToCountries from '@/assets/svg/BackToCountries.vue';

const selectedDay = ref();
const days = ref([
  { name: 'All time', code: 0 },
  { name: 'Last 7 days', code: 7 },
  { name: 'Last 30 days', code: 30 },
  { name: 'Last 90 days', code: 90 },
  { name: '1 year ago', code: 365 },
]);
const dayActual = ref(7);
const selectedTab = ref('Gender');
const dataVideoAnalytic = ref([]);
const route = useRoute();
const id = ref(route.params.videoId);
const dataDemographicsByGender = ref();
const dataDemographicsByAge = ref();
const dataDemographicsByCountry = ref([]);
const dataDemographicsByCityOfCountry = ref();
const dataDemographicsByCountryObject = ref();
const countryCode = ref();

const selectShowDay = () => {
  dayActual.value = selectedDay.value.code;
  loadVideoAnalytic();
  loadDataDemographicsByGender();
  loadDataDemographicsByAge();
  loadDataDemographicsByCountry();
  if (dataDemographicsByCityOfCountry.value) {
    loadDataDemographicsByCityOfCountry();
  }
};
const handleTabChange = (event) => {
  if (event.index === 0) {
    selectedTab.value = 'Gender';
  } else if (event.index === 1) {
    selectedTab.value = 'Age';
  } else if (event.index === 2) {
    selectedTab.value = 'Country';
  }
};
const loadVideoAnalytic = async () => {
  try {
    const res = await http.nodeInstance.get(`/analytic/video/${id.value}`);
    dataVideoAnalytic.value = res.data.metadata;
  } catch (error) {
    console.log(error);
  }
};
const loadDataDemographicsByGender = async () => {
  try {
    const res = await http.nodeInstance.get(
      `/analytic/video-details-gender/${id.value}?days_ago=${dayActual.value}`,
    );
    dataDemographicsByGender.value = res.data.metadata;
  } catch (error) {
    console.log(error);
  }
};
const loadDataDemographicsByAge = async () => {
  try {
    const res = await http.nodeInstance.get(
      `/analytic/video-details-age/${id.value}?days_ago=${dayActual.value}`,
    );
    dataDemographicsByAge.value = res.data.metadata;
  } catch (error) {
    console.log(error);
  }
};
const loadDataDemographicsByCountry = async () => {
  try {
    const res = await http.nodeInstance.get(
      `/analytic/video-details-country/${id.value}?days_ago=${dayActual.value}`,
    );
    dataDemographicsByCountry.value = res.data.metadata;
    dataDemographicsByCountryObject.value = Object.keys(res.data.metadata);
  } catch (error) {
    console.log(error);
  }
};
const loadDataDemographicsByCityOfCountry = async (country_code) => {
  if (country_code) {
    countryCode.value = country_code;
  }
  try {
    const res = await http.nodeInstance.get(
      `/analytic/video-details-state/${id.value}?days_ago=${dayActual.value}&country_code=${countryCode.value}`,
    );
    if (res.data.metadata.country_name === null) {
      return;
    }
    dataDemographicsByCityOfCountry.value = res.data.metadata;
  } catch (error) {
    console.log(error);
  }
};
const clickToGetDataDemographicsByCityOfCountry = () => {
  dataDemographicsByCityOfCountry.value = null;
};

onMounted(() => {
  loadVideoAnalytic();
  loadDataDemographicsByGender();
  loadDataDemographicsByAge();
  loadDataDemographicsByCountry();
});
</script>

<style scoped>
:deep(.browse-tabview-header-text-active span) {
  color: #13d0b4;
}
:deep(li.p-tabview-ink-bar) {
  background-color: #13d0b4;
}
</style>
