import '@/assets/css/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primeicons/primeicons.css';
import App from './App.vue';
import router from './router';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import vueVimeoPlayer from 'vue-vimeo-player';
import 'vue3-toastify/dist/index.css';
import Tooltip from 'primevue/tooltip';


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.use(vueVimeoPlayer);
app.directive('tooltip', Tooltip);
app.mount('#app');
