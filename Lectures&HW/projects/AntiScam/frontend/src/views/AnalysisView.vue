<template>
  <div class="screen analysis-screen">
    <TopBar />

    <div class="screen-content">
      <div class="analysis__center">
        <h1 class="headline-lg analysis__headline">{{ copy.analysis.headline }}</h1>

        <div class="analysis__steps">
          <div
            v-for="(label, i) in sim.stepLabels"
            :key="i"
            class="analysis__step"
            :class="{
              'analysis__step--done': sim.currentStep.value > i,
              'analysis__step--active': sim.currentStep.value === i + 1 && !sim.isDone.value,
            }"
          >
            <div class="analysis__step-indicator">
              <div v-if="sim.currentStep.value > i" class="analysis__step-check step-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-else-if="sim.currentStep.value === i + 1 && !sim.isDone.value" class="analysis__step-spinner" />
              <div v-else class="analysis__step-dot" />
            </div>
            <span class="analysis__step-label">{{ label }}</span>
          </div>
        </div>

        <div v-if="!sim.isDone.value" class="analysis__shimmer-area">
          <ShimmerLoader :lines="6" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { productCopy as copy } from '@/data/product-copy';
import { useAnalysisSimulation } from '@/composables/useAnalysisSimulation';
import TopBar from '@/components/TopBar.vue';
import ShimmerLoader from '@/components/ShimmerLoader.vue';

const router = useRouter();
const sim = useAnalysisSimulation();

onMounted(() => {
  sim.start();
});

onUnmounted(() => {
  sim.reset();
});

watch(() => sim.isDone.value, (done) => {
  if (done) {
    setTimeout(() => router.push('/result'), 400);
  }
});
</script>

<style scoped>
.analysis-screen {
  padding-bottom: 40px;
}

.analysis__center {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
}

.analysis__headline {
  margin-bottom: 40px;
}

.analysis__steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.analysis__step {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0.3;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.analysis__step--done,
.analysis__step--active {
  opacity: 1;
}

.analysis__step-indicator {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.analysis__step-check {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.15);
  color: var(--success);
}

.analysis__step-spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--outline-ghost);
  border-top-color: var(--secondary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.analysis__step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--surface-high);
}

.analysis__step-label {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.3;
}

.analysis__step--done .analysis__step-label {
  color: var(--text-secondary);
}

.analysis__shimmer-area {
  padding-top: 8px;
}
</style>
