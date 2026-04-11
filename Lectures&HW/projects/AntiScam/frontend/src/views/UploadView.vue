<template>
  <div class="screen">
    <TopBar show-back @back="onBack" />

    <div class="screen-content">
      <StepIndicator :label="copy.upload.step" />
      <h1 class="headline-lg upload__headline">{{ copy.upload.headline }}</h1>

      <div v-if="sim.phase.value === 'idle'" class="upload__dropzone" @click="triggerFileSelect">
        <input
          ref="fileInputRef"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          class="upload__file-input"
          @change="onFileSelected"
        />
        <div class="upload__dropzone-inner">
          <div class="upload__dropzone-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <polyline points="17,8 12,3 7,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <p class="upload__dropzone-text">{{ copy.upload.dropzone }}</p>
          <p class="upload__dropzone-formats">{{ copy.upload.formats }}</p>
        </div>
      </div>

      <div v-if="sim.phase.value === 'selected'" class="upload__selected">
        <div class="upload__file-card">
          <div class="upload__file-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="upload__file-name">{{ sim.fileName.value }}</span>
        </div>
        <BottomCTA label="Загрузить и проверить" @click="startUpload" />
      </div>

      <div v-if="sim.phase.value === 'uploading'" class="upload__progress-section">
        <div class="upload__file-card">
          <div class="upload__file-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="upload__file-name">{{ sim.fileName.value }}</span>
        </div>
        <div class="upload__progress-bar">
          <div class="upload__progress-fill" :style="{ width: sim.progress.value + '%' }" />
        </div>
        <p class="upload__status">{{ copy.upload.uploading }}</p>
      </div>

      <div v-if="sim.phase.value === 'analyzing'" class="upload__analyzing">
        <div class="upload__analyzing-icon">
          <div class="upload__spinner" />
        </div>
        <p class="upload__status upload__status--analyzing">{{ copy.upload.analyzing }}</p>
        <ShimmerLoader :lines="5" />
      </div>

      <div v-if="sim.phase.value === 'success'" class="upload__success">
        <div class="upload__success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="upload__success-text">{{ copy.upload.success }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import { mockUploadResult } from '@/data/mock-results';
import { useUploadSimulation } from '@/composables/useUploadSimulation';
import TopBar from '@/components/TopBar.vue';
import StepIndicator from '@/components/StepIndicator.vue';
import ShimmerLoader from '@/components/ShimmerLoader.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();
const store = useAppStore();
const sim = useUploadSimulation();
const fileInputRef = ref<HTMLInputElement | null>(null);

function triggerFileSelect() {
  fileInputRef.value?.click();
}

function onFileSelected(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    sim.selectFile(files[0].name);
  } else {
    sim.selectFile('Заказ-наряд_СТО.pdf');
  }
}

function startUpload() {
  sim.startUpload();
}

function onBack() {
  sim.reset();
  router.back();
}

watch(() => sim.phase.value, (phase) => {
  if (phase === 'success') {
    store.setResult(mockUploadResult);
    setTimeout(() => router.push('/result'), 800);
  }
});
</script>

<style scoped>
.upload__headline {
  margin-top: 12px;
  margin-bottom: 32px;
}

.upload__dropzone {
  cursor: pointer;
}

.upload__file-input {
  display: none;
}

.upload__dropzone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  border-radius: var(--radius-lg);
  background: var(--surface-low);
  transition: background var(--duration-fast) var(--ease-out);
}

.upload__dropzone:active .upload__dropzone-inner {
  background: var(--surface-high);
}

.upload__dropzone-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: rgba(26, 127, 119, 0.1);
  color: var(--secondary);
}

.upload__dropzone-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.upload__dropzone-formats {
  font-size: 13px;
  color: var(--text-tertiary);
}

.upload__file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: var(--surface-low);
  border-radius: var(--radius-md);
}

.upload__file-icon {
  color: var(--secondary);
}

.upload__file-name {
  font-size: 15px;
  color: var(--text-primary);
}

.upload__selected {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload__progress-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload__progress-bar {
  width: 100%;
  height: 4px;
  background: var(--surface-high);
  border-radius: 2px;
  overflow: hidden;
}

.upload__progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 2px;
  transition: width 100ms linear;
}

.upload__status {
  font-size: 15px;
  color: var(--text-secondary);
  text-align: center;
}

.upload__status--analyzing {
  color: var(--secondary);
}

.upload__analyzing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-top: 20px;
}

.upload__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid var(--outline-ghost);
  border-top-color: var(--secondary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload__analyzing-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 60px;
}

.upload__success-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.15);
  color: var(--success);
  animation: step-check 0.4s var(--ease-spring) forwards;
}

.upload__success-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}
</style>
