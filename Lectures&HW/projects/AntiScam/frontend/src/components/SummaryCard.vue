<template>
  <div class="summary-card">
    <div class="summary-card__row">
      <span class="summary-card__label">{{ brand }} {{ model }}</span>
      <span class="summary-card__value">{{ year }} · {{ formattedMileage }} км</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  brand: string;
  model: string;
  year: string;
  mileage: string;
}>();

const formattedMileage = computed(() => {
  const num = parseInt(props.mileage);
  if (isNaN(num)) return props.mileage;
  return num.toLocaleString('ru-RU');
});
</script>

<style scoped>
.summary-card {
  padding: 18px 20px;
  background: var(--surface-low);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.summary-card__label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.summary-card__value {
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
