<template>
  <span class="chip-tag" :class="`chip-tag--${variant}`">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
}>();

const variant = computed(() => {
  switch (props.label) {
    case 'По регламенту': return 'schedule';
    case 'По пробегу': return 'mileage';
    case 'Нужны признаки': return 'symptoms';
    case 'Нужно уточнить': return 'clarify';
    default: return 'default';
  }
});
</script>

<style scoped>
.chip-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.chip-tag--schedule {
  background: rgba(26, 127, 119, 0.15);
  color: var(--secondary);
}

.chip-tag--mileage {
  background: rgba(255, 152, 0, 0.12);
  color: #ffb74d;
}

.chip-tag--symptoms {
  background: rgba(239, 83, 80, 0.12);
  color: #ef9a9a;
}

.chip-tag--clarify {
  background: rgba(138, 154, 151, 0.15);
  color: var(--text-secondary);
}

.chip-tag--default {
  background: var(--outline-ghost);
  color: var(--text-secondary);
}
</style>
