import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAppStore } from './stores/app.store';
import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
const store = useAppStore(pinia);
store.hydrateAuthSession();
app.use(router);
app.mount('#app');
