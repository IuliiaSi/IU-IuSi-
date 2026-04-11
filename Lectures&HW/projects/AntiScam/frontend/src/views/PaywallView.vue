<template>
  <div class="screen paywall-screen">
    <TopBar show-back @back="router.back()" />

    <div class="screen-content">
      <div class="paywall__hero">
        <div class="paywall__logo-ring">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <h1 class="headline-lg paywall__headline">{{ copy.paywall.headline }}</h1>

      <div class="paywall__benefits">
        <div
          v-for="(benefit, i) in copy.paywall.benefits"
          :key="i"
          class="paywall__benefit"
        >
          <div class="paywall__benefit-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="paywall__benefit-text">{{ benefit }}</span>
        </div>
      </div>
    </div>

    <BottomCTA
      :label="copy.paywall.cta"
      :secondary-label="copy.paywall.later"
      @click="onSubscribe"
      @secondary="onLater"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { productCopy as copy } from '@/data/product-copy';
import TopBar from '@/components/TopBar.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();

function onSubscribe() {
  // Mock subscription - in real app, this would trigger payment
  router.push('/result');
}

function onLater() {
  router.back();
}
</script>

<style scoped>
.paywall-screen {
  padding-bottom: 140px;
}

.paywall__hero {
  display: flex;
  justify-content: center;
  padding: 20px 0 32px;
}

.paywall__logo-ring {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(26, 127, 119, 0.2), rgba(36, 176, 165, 0.1));
  color: var(--secondary);
  box-shadow: 0 0 40px rgba(26, 127, 119, 0.2);
  animation: pulse-glow 3s ease-in-out infinite;
}

.paywall__headline {
  text-align: center;
  margin-bottom: 36px;
}

.paywall__benefits {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paywall__benefit {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: var(--surface-low);
  border-radius: var(--radius-md);
}

.paywall__benefit-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(26, 127, 119, 0.12);
  color: var(--secondary);
  flex-shrink: 0;
}

.paywall__benefit-text {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.4;
}
</style>
