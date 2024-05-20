import './assets/css/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import Tooltip from 'primevue/tooltip';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/aura-light-green/theme.css';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
app.use(PrimeVue);
app.use(createPinia());
app.use(router);
app.directive('tooltip', Tooltip);

app.mount('#app');


