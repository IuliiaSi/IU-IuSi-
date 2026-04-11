<template>
  <div class="screen result-screen">
    <TopBar />

    <div class="screen-content">
      <h1 class="headline-lg result__headline">{{ copy.result.headline }}</h1>

      <SummaryCard
        :brand="store.car.brand"
        :model="store.car.model"
        :year="store.car.year"
        :mileage="store.car.mileage"
      />

      <p v-if="store.result" class="result__summary">
        {{ store.result.summary }}
      </p>

      <div v-if="store.result" class="result__groups">
        <PrioritySection
          v-for="(group, i) in store.result.groups"
          :key="group.name"
          :group="group"
          :style="{ animationDelay: `${i * 120}ms` }"
          class="result__group-enter"
        />
      </div>

      <div class="result__disclaimer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        <span>{{ copy.result.disclaimer }}</span>
      </div>
    </div>

    <BottomCTA
      :label="copy.result.cta"
      :secondary-label="copy.result.later"
      @click="onPaywall"
      @secondary="onLater"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import TopBar from '@/components/TopBar.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import PrioritySection from '@/components/PrioritySection.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();
const store = useAppStore();

function onPaywall() {
  router.push('/paywall');
}

function onLater() {
  // Stay on result screen
}
</script>

<style scoped>
.result-screen {
  padding-bottom: 140px;
}

.result__headline {
  margin-bottom: 16px;
}

.result__summary {
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-top: 16px;
  margin-bottom: 8px;
  padding: 14px 16px;
  background: var(--surface-low);
  border-radius: var(--radius-md);
}

.result__groups {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 24px;
}

.result__group-enter {
  opacity: 0;
  transform: translateY(20px);
  animation: result-group-in var(--duration-slow) var(--ease-out) forwards;
}

@keyframes result-group-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result__disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 32px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--surface-low);
  color: var(--text-tertiary);
  font-size: 13px;
  line-height: 1.4;
}

.result__disclaimer svg {
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
