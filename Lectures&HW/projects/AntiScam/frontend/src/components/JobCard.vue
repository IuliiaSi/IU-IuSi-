<template>
  <div class="job-card">
    <div class="job-card__header">
      <p class="job-card__name">{{ name }}</p>
      <ChipTag :label="chip" />
    </div>
    <p class="job-card__explanation">{{ explanation }}</p>
  </div>
</template>

<script setup lang="ts">
import ChipTag from './ChipTag.vue';

defineProps<{
  name: string;
  chip: string;
  explanation: string;
}>();
</script>

<style scoped>
.job-card {
  padding: 16px 18px;
  background: var(--surface-low);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.job-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.job-card__name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  flex: 1;
}

.job-card__explanation {
  font-size: 14px;
  line-height: 1.45;
  color: var(--text-secondary);
}
</style>
