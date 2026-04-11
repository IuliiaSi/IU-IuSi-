import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'welcome', component: () => import('@/views/WelcomeView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { transition: 'slide-left' } },
    { path: '/car', name: 'car', component: () => import('@/views/CarProfileView.vue'), meta: { transition: 'slide-left' } },
    { path: '/method', name: 'method', component: () => import('@/views/MethodChoiceView.vue'), meta: { transition: 'slide-left' } },
    { path: '/manual', name: 'manual', component: () => import('@/views/ManualInputView.vue'), meta: { transition: 'slide-left' } },
    { path: '/upload', name: 'upload', component: () => import('@/views/UploadView.vue'), meta: { transition: 'slide-left' } },
    { path: '/analysis', name: 'analysis', component: () => import('@/views/AnalysisView.vue'), meta: { transition: 'fade' } },
    { path: '/result', name: 'result', component: () => import('@/views/ResultView.vue'), meta: { transition: 'fade' } },
    { path: '/paywall', name: 'paywall', component: () => import('@/views/PaywallView.vue'), meta: { transition: 'slide-up' } },
  ],
});

export default router;
