import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAppStore } from './stores/app.store';
import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  const store = useAppStore(pinia);
  try {
    await store.initAuthFromSupabase();
  } catch (error) {
    console.warn('Failed to initialize Supabase auth session:', error);
  } finally {
    store.bindSupabaseAuthListener();
  }

  app.use(router);
  app.mount('#app');
}

void bootstrap();
