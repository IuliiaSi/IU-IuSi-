<template>
  <div class="screen result-screen">
    <TopBar :user-email="store.auth.email" show-logout @logout="onLogout" />

    <div class="screen-content">
      <h1 class="headline-lg result__headline">{{ copy.result.headline }}</h1>

      <div class="result__account">
        <span class="result__account-label">Вы вошли как</span>
        <strong class="result__account-email">{{ store.auth.email }}</strong>
      </div>

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

      <div class="result__entries">
        <h2 class="result__entries-title">Мои сохраненные entries</h2>
        <p v-if="!store.hasPaidAccess" class="result__entries-empty">
          История доступна только с подтвержденной оплатой.
        </p>
        <p v-else-if="store.entries.length === 0" class="result__entries-empty">
          Записей пока нет.
        </p>
        <div v-else class="result__entries-list">
          <article v-for="entry in store.entries" :key="entry.id" class="result__entry-card">
            <div class="result__entry-meta">
              {{ new Date(entry.created_at).toLocaleString('ru-RU') }}
            </div>
            <div class="result__entry-content">
              <p><strong>user_input:</strong> {{ entry.user_input }}</p>
              <p><strong>ai_response:</strong> {{ entry.ai_response }}</p>
            </div>
          </article>
        </div>
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import TopBar from '@/components/TopBar.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import PrioritySection from '@/components/PrioritySection.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();
const store = useAppStore();

onMounted(async () => {
  await store.fetchCurrentUser();
  await store.fetchAccessStatus();
  if (store.hasPaidAccess) {
    await store.fetchEntries();
  } else {
    store.setEntries([]);
  }
});

function onPaywall() {
  router.push('/paywall');
}

function onLater() {
  // Stay on result screen
}

async function onLogout() {
  await store.logout();
  router.push('/login');
}
</script>

<style scoped>
.result-screen {
  padding-bottom: 140px;
}

.result__headline {
  margin-bottom: 16px;
}

.result__account {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 14px;
}

.result__account-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.result__account-email {
  font-size: 14px;
  color: var(--text-primary);
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

.result__entries {
  margin-top: 24px;
}

.result__entries-title {
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.result__entries-empty {
  font-size: 14px;
  color: var(--text-tertiary);
}

.result__entries-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result__entry-card {
  background: var(--surface-low);
  border-radius: var(--radius-md);
  padding: 12px;
}

.result__entry-meta {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}

.result__entry-content {
  font-size: 13px;
  line-height: 1.45;
  color: var(--text-secondary);
  word-break: break-word;
}
</style>
