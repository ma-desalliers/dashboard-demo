import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import './styles/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
