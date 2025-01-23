import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './styles/style.css';
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueApexCharts)
app.mount('#app');


