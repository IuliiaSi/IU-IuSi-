<template>
  <div class="screen manual-screen">
    <TopBar show-back @back="router.back()" />

    <div class="screen-content">
      <StepIndicator :label="copy.manual.step" />
      <h1 class="headline-lg manual__headline">{{ copy.manual.headline }}</h1>

      <SearchInput
        v-model="searchQuery"
        :placeholder="copy.manual.searchPlaceholder"
      />

      <div v-if="store.selectedJobCount > 0" class="manual__selected-badge">
        {{ copy.manual.selected }}: {{ store.selectedJobCount }}
      </div>

      <div v-if="store.customJobs.length > 0" class="manual__custom-list">
        <div
          v-for="job in store.customJobs"
          :key="'custom-' + job"
          class="manual__custom-chip"
        >
          <span>{{ job }}</span>
          <button class="manual__custom-remove" @click="store.removeCustomJob(job)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="manual__add-custom">
        <div class="manual__add-input-row">
          <input
            class="manual__add-input"
            type="text"
            :placeholder="copy.manual.customPlaceholder"
            v-model="customInput"
            @keydown.enter="addCustom"
          />
          <button
            class="manual__add-btn"
            :disabled="!customInput.trim()"
            @click="addCustom"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="filteredCategories.length === 0" class="manual__empty">
        Ничего не найдено
      </div>

      <div class="manual__categories">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="manual__category"
        >
          <h3 class="manual__category-name">{{ category.name }}</h3>
          <div class="manual__jobs">
            <button
              v-for="job in category.jobs"
              :key="job.name"
              class="manual__job"
              :class="{ 'manual__job--selected': isSelected(job.name) }"
              @click="store.toggleJob(job.name)"
            >
              <div class="manual__job-check">
                <svg v-if="isSelected(job.name)" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="manual__job-name">{{ job.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="manual__security">
        <label class="manual__robot-row">
          <input v-model="humanConfirmed" type="checkbox" class="manual__robot-checkbox" />
          <span class="manual__robot-label">Я не робот</span>
        </label>
        <p v-if="actionMessage" class="manual__action-message">{{ actionMessage }}</p>
      </div>
    </div>

    <BottomCTA
      :label="`${copy.manual.analyze} (${store.selectedJobCount})`"
      :disabled="store.selectedJobCount === 0 || submitting || isCooldownActive || !humanConfirmed"
      @click="onAnalyze"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import { jobCatalog } from '@/data/job-catalog';
import TopBar from '@/components/TopBar.vue';
import StepIndicator from '@/components/StepIndicator.vue';
import SearchInput from '@/components/SearchInput.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();
const store = useAppStore();
const searchQuery = ref('');
const customInput = ref('');
const humanConfirmed = ref(false);
const submitting = ref(false);
const actionMessage = ref('');
const cooldownMsLeft = ref(0);
let cooldownTimer: ReturnType<typeof setInterval> | null = null;

const filteredCategories = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return jobCatalog;

  return jobCatalog
    .map((cat) => ({
      ...cat,
      jobs: cat.jobs.filter((j) => j.name.toLowerCase().includes(q)),
    }))
    .filter((cat) => cat.jobs.length > 0);
});

const isCooldownActive = computed(() => cooldownMsLeft.value > 0);

function isSelected(name: string): boolean {
  return store.selectedJobs.includes(name);
}

function addCustom() {
  if (customInput.value.trim()) {
    store.addCustomJob(customInput.value.trim());
    customInput.value = '';
  }
}

function startCooldown() {
  cooldownMsLeft.value = 3000;
  if (cooldownTimer) {
    clearInterval(cooldownTimer);
  }
  cooldownTimer = setInterval(() => {
    cooldownMsLeft.value = Math.max(0, cooldownMsLeft.value - 250);
    if (cooldownMsLeft.value === 0 && cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 250);
}

function normalizeErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Не удалось выполнить действие';
  const maybeMessage = (data as { message?: string | string[] }).message;
  if (Array.isArray(maybeMessage) && maybeMessage.length > 0) {
    return maybeMessage[0];
  }
  if (typeof maybeMessage === 'string') {
    return maybeMessage;
  }
  return 'Не удалось выполнить действие';
}

async function onAnalyze() {
  if (store.selectedJobCount === 0 || submitting.value) return;

  if (!humanConfirmed.value) {
    actionMessage.value = 'Подтвердите, что вы не робот';
    return;
  }

  if (isCooldownActive.value) {
    actionMessage.value = 'Подождите немного';
    return;
  }

  submitting.value = true;
  actionMessage.value = '';

  try {
    const allJobs = store.allSelectedJobs;
    const response = await fetch('/api/analysis/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...store.authHeaders(),
      },
      body: JSON.stringify({
        jobs: allJobs,
        brand: store.car.brand,
        model: store.car.model,
        year: Number(store.car.year),
        mileage: Number(store.car.mileage),
        humanConfirmed: true,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      actionMessage.value = response.status === 429 ? 'Подождите немного' : normalizeErrorMessage(data);
      return;
    }

    store.setResult(data);
    await store.saveEntry({
      userInput: JSON.stringify({
        source: 'manual',
        car: store.car,
        jobs: allJobs,
      }),
      aiResponse: JSON.stringify(data),
    });

    startCooldown();
    router.push('/analysis');
  } catch {
    actionMessage.value = 'Сервер недоступен. Попробуйте позже';
  } finally {
    submitting.value = false;
  }
}

onUnmounted(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer);
    cooldownTimer = null;
  }
});
</script>

<style scoped>
.manual-screen {
  padding-bottom: 120px;
}

.manual__headline {
  margin-top: 12px;
  margin-bottom: 16px;
}

.manual__selected-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(26, 127, 119, 0.12);
  color: var(--secondary);
  font-size: 13px;
  font-weight: 600;
  margin-top: 12px;
}

.manual__custom-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.manual__custom-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--surface-high);
  font-size: 13px;
  color: var(--text-primary);
}

.manual__custom-remove {
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
}

.manual__custom-remove:active {
  color: var(--error);
}

.manual__add-custom {
  margin-top: 16px;
}

.manual__add-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.manual__add-input {
  flex: 1;
  padding: 12px 0;
  font-size: 15px;
  color: var(--text-primary);
  position: relative;
  border-bottom: 2px solid var(--outline-ghost);
  transition: border-color var(--duration-fast) var(--ease-out);
}

.manual__add-input:focus {
  border-color: var(--primary);
}

.manual__add-input::placeholder {
  color: var(--text-tertiary);
}

.manual__add-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: rgba(26, 127, 119, 0.15);
  color: var(--secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.manual__add-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.manual__add-btn:active:not(:disabled) {
  background: rgba(26, 127, 119, 0.25);
}

.manual__empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-tertiary);
  font-size: 15px;
}

.manual__categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.manual__security {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.manual__robot-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-size: 14px;
}

.manual__robot-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--secondary);
}

.manual__robot-label {
  user-select: none;
}

.manual__action-message {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.manual__category-name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}

.manual__jobs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.manual__job {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  text-align: left;
  transition: all var(--duration-fast) var(--ease-out);
  background: transparent;
}

.manual__job:active {
  background: var(--surface-low);
}

.manual__job--selected {
  background: rgba(26, 127, 119, 0.08);
}

.manual__job--selected:active {
  background: rgba(26, 127, 119, 0.12);
}

.manual__job-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--surface-high);
  color: transparent;
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.manual__job--selected .manual__job-check {
  background: var(--primary);
  color: var(--text-on-primary);
}

.manual__job-name {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.3;
}
</style>
