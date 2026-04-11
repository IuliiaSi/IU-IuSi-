<template>
  <div class="step-indicator">
    <span class="step-indicator__text">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
}

.step-indicator__text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-tertiary);
  letter-spacing: 0.01em;
}
</style>
