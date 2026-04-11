<template>
  <div class="bottom-cta">
    <button
      class="bottom-cta__button"
      :class="{ 'bottom-cta__button--disabled': disabled }"
      :disabled="disabled"
      @click="$emit('click')"
    >
      {{ label }}
    </button>
    <button
      v-if="secondaryLabel"
      class="bottom-cta__secondary"
      @click="$emit('secondary')"
    >
      {{ secondaryLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  secondaryLabel?: string;
  disabled?: boolean;
}>();

defineEmits<{
  click: [];
  secondary: [];
}>();
</script>

<style scoped>
.bottom-cta {
  position: sticky;
  bottom: 0;
  z-index: 50;
  padding: 16px 20px;
  padding-bottom: calc(16px + var(--safe-area-bottom));
  margin: auto -20px 0;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.bottom-cta__button {
  width: 100%;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--primary-gradient);
  color: var(--text-on-primary);
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: all var(--duration-fast) var(--ease-out);
  box-shadow: var(--shadow-ambient);
}

.bottom-cta__button:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(26, 127, 119, 0.25);
}

.bottom-cta__button--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.bottom-cta__secondary {
  font-size: 15px;
  color: var(--text-secondary);
  padding: 8px 16px;
  transition: color var(--duration-fast) var(--ease-out);
}

.bottom-cta__secondary:active {
  color: var(--secondary);
}
</style>
