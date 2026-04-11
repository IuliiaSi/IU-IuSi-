<template>
  <div class="top-bar">
    <button v-if="showBack" class="top-bar__back" @click="$emit('back')">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <span class="top-bar__brand">{{ brandName }}</span>
    <div class="top-bar__spacer" />
  </div>
</template>

<script setup lang="ts">
import { productCopy } from '@/data/product-copy';

defineProps<{
  showBack?: boolean;
}>();

defineEmits<{
  back: [];
}>();

const brandName = productCopy.brandName;
</script>

<style scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  padding-top: var(--safe-area-top);
  margin: 0 -20px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
}

.top-bar__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  transition: background var(--duration-fast) var(--ease-out);
  margin-left: -8px;
}

.top-bar__back:active {
  background: var(--outline-ghost);
}

.top-bar__brand {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
  margin-left: 4px;
}

.top-bar__spacer {
  flex: 1;
}
</style>
