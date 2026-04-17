import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/app.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'welcome', component: () => import('@/views/WelcomeView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { transition: 'slide-left' } },
    { path: '/car', name: 'car', component: () => import('@/views/CarProfileView.vue'), meta: { transition: 'slide-left', requiresAuth: true } },
    { path: '/method', name: 'method', component: () => import('@/views/MethodChoiceView.vue'), meta: { transition: 'slide-left', requiresAuth: true } },
    { path: '/manual', name: 'manual', component: () => import('@/views/ManualInputView.vue'), meta: { transition: 'slide-left', requiresAuth: true } },
    { path: '/upload', name: 'upload', component: () => import('@/views/UploadView.vue'), meta: { transition: 'slide-left', requiresAuth: true } },
    { path: '/analysis', name: 'analysis', component: () => import('@/views/AnalysisView.vue'), meta: { transition: 'fade', requiresAuth: true } },
    { path: '/result', name: 'result', component: () => import('@/views/ResultView.vue'), meta: { transition: 'fade', requiresAuth: true } },
    { path: '/paywall', name: 'paywall', component: () => import('@/views/PaywallView.vue'), meta: { transition: 'slide-up', requiresAuth: true } },
  ],
});

router.beforeEach(async (to) => {
  const store = useAppStore();

  if (!store.auth.accessToken) {
    store.hydrateAuthSession();
  }

  if (store.auth.accessToken && !store.auth.verified) {
    await store.fetchCurrentUser();
  }

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return '/login';
  }

  if (to.path === '/login' && store.isAuthenticated) {
    return '/car';
  }

  return true;
});

export default router;
