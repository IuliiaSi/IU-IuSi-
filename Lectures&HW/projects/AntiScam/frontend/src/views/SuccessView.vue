<template>
  <div class="screen success-screen">
    <TopBar show-back @back="router.back()" />

    <div class="screen-content">
      <div class="success__center">
        <div class="success__icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="headline-lg success__headline">Оплата почти завершена</h1>
        <p class="success__text">
          Завершите оплату в платежном окне. Доступ обновится только после подтверждения на сервере.
        </p>
      </div>
    </div>

    <BottomCTA label="Вернуться в приложение" @click="onBackToApp" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import TopBar from '@/components/TopBar.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();

function onBackToApp() {
  router.push('/result');
}
</script>

<style scoped>
.success-screen {
  padding-bottom: 140px;
}

.success__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
}

.success__icon-wrap {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 127, 119, 0.12);
  color: var(--secondary);
  margin-bottom: 20px;
}

.success__headline {
  margin-bottom: 10px;
}

.success__text {
  max-width: 320px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text-secondary);
}
</style>
