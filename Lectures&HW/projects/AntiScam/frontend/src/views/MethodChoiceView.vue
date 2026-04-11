<template>
  <div class="screen">
    <TopBar show-back @back="router.back()" />

    <div class="screen-content">
      <StepIndicator :label="copy.method.step" />

      <h1 class="headline-lg method__headline">{{ copy.method.headline }}</h1>

      <div class="method__options">
        <button class="method__card method__card--primary" @click="onManual">
          <div class="method__card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="method__card-text">
            <span class="method__card-title">{{ copy.method.manual.title }}</span>
            <span class="method__card-subtitle">{{ copy.method.manual.subtitle }}</span>
          </div>
          <svg class="method__card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button class="method__card method__card--secondary" @click="onUpload">
          <div class="method__card-icon method__card-icon--secondary">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="17,8 12,3 7,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="method__card-text">
            <span class="method__card-title">{{ copy.method.upload.title }}</span>
            <span class="method__card-subtitle">{{ copy.method.upload.subtitle }}</span>
          </div>
          <svg class="method__card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button class="method__sample" @click="onSample">
          {{ copy.method.sample }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import { exampleResult } from '@/data/mock-results';
import TopBar from '@/components/TopBar.vue';
import StepIndicator from '@/components/StepIndicator.vue';

const router = useRouter();
const store = useAppStore();

function onManual() {
  store.setInputMethod('manual');
  router.push('/manual');
}

function onUpload() {
  store.setInputMethod('upload');
  router.push('/upload');
}

function onSample() {
  store.setInputMethod('sample');
  store.setResult(exampleResult);
  router.push('/result');
}
</script>

<style scoped>
.method__headline {
  margin-top: 12px;
  margin-bottom: 32px;
}

.method__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method__card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-lg);
  text-align: left;
  transition: all var(--duration-fast) var(--ease-out);
}

.method__card--primary {
  background: linear-gradient(135deg, rgba(26, 127, 119, 0.15), rgba(36, 176, 165, 0.08));
  box-shadow: var(--shadow-ambient);
}

.method__card--primary:active {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(26, 127, 119, 0.2);
}

.method__card--secondary {
  background: var(--surface-low);
}

.method__card--secondary:active {
  background: var(--surface-high);
}

.method__card-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: rgba(26, 127, 119, 0.15);
  color: var(--secondary);
}

.method__card-icon--secondary {
  background: var(--surface-high);
  color: var(--text-secondary);
}

.method__card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.method__card-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.method__card-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.35;
}

.method__card-arrow {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.method__sample {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  font-size: 15px;
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-out);
}

.method__sample:active {
  color: var(--secondary);
}

.method__sample svg {
  transition: transform var(--duration-fast) var(--ease-out);
}

.method__sample:active svg {
  transform: translateX(2px);
}
</style>
