<template>
  <div class="welcome">
    <div class="welcome__hero">
      <div class="welcome__hero-overlay" />
      <div class="welcome__hero-content">
        <span class="welcome__brand">{{ copy.brandName }}</span>
      </div>
    </div>

    <div class="welcome__body">
      <h1 class="headline-xl welcome__headline">{{ copy.welcome.headline }}</h1>
      <p class="body-lg welcome__subheadline">{{ copy.welcome.subheadline }}</p>

      <div class="welcome__benefits stagger-children">
        <BenefitCard
          v-for="(benefit, i) in copy.welcome.benefits"
          :key="i"
          :title="benefit.title"
          :icon="benefit.icon"
        />
      </div>
    </div>

    <BottomCTA :label="copy.welcome.cta" @click="onStart" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { productCopy as copy } from '@/data/product-copy';
import BenefitCard from '@/components/BenefitCard.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();

function onStart() {
  router.push('/login');
}
</script>

<style scoped>
.welcome {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.welcome__hero {
  position: relative;
  width: 100%;
  height: 260px;
  background:
    linear-gradient(135deg, rgba(26, 127, 119, 0.2) 0%, rgba(18, 18, 18, 0.6) 50%),
    linear-gradient(to bottom right, #1a2a28, #121212);
  overflow: hidden;
}

.welcome__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 40%, rgba(26, 127, 119, 0.15), transparent 60%),
    radial-gradient(ellipse at 70% 60%, rgba(36, 176, 165, 0.08), transparent 50%);
}

.welcome__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, var(--bg) 100%);
}

.welcome__hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  height: 100%;
  padding: 0 24px 32px;
}

.welcome__brand {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--secondary);
  opacity: 0.8;
}

.welcome__body {
  flex: 1;
  padding: 8px 24px;
  padding-bottom: 120px;
}

.welcome__headline {
  margin-bottom: 12px;
}

.welcome__subheadline {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.welcome__benefits {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
