<template>
  <div class="priority-section">
    <div class="priority-section__header">
      <div class="priority-section__indicator" :class="`priority-section__indicator--${variant}`" />
      <div>
        <h3 class="priority-section__title">{{ group.name }}</h3>
        <p class="priority-section__description">{{ group.description }}</p>
      </div>
    </div>
    <div class="priority-section__items stagger-children">
      <JobCard
        v-for="item in group.items"
        :key="item.name"
        :name="item.name"
        :chip="item.chip"
        :explanation="item.explanation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PriorityGroup } from '@/stores/app.store';
import JobCard from './JobCard.vue';

const props = defineProps<{
  group: PriorityGroup;
}>();

const groupVariantMap: Record<string, string> = {
  'Обеспечение безопасности': 'safety',
  'Критические неисправности': 'critical',
  'Профилактическое обслуживание': 'preventive',
  'Несрочно': 'optional',
};

const variant = computed(() => groupVariantMap[props.group.name] || 'optional');
</script>

<style scoped>
.priority-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.priority-section__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 2px;
}

.priority-section__indicator {
  width: 4px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}

.priority-section__indicator--safety {
  background: linear-gradient(180deg, #ef5350, #ff7043);
}

.priority-section__indicator--critical {
  background: linear-gradient(180deg, #ff9800, #ffb74d);
}

.priority-section__indicator--preventive {
  background: linear-gradient(180deg, #1a7f77, #24b0a5);
}

.priority-section__indicator--optional {
  background: linear-gradient(180deg, #5e6d6a, #8a9a97);
}

.priority-section__title {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.priority-section__description {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.priority-section__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
