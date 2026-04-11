<template>
  <div class="search-input" :class="{ 'search-input--focused': isFocused }">
    <svg class="search-input__icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <input
      class="search-input__field"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <button
      v-if="modelValue"
      class="search-input__clear"
      @click="$emit('update:modelValue', '')"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();

const isFocused = ref(false);
</script>

<style scoped>
.search-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 48px;
  background: var(--surface-low);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.search-input--focused {
  background: var(--surface-high);
  box-shadow: 0 0 0 1px rgba(26, 127, 119, 0.3), 0 0 20px rgba(26, 127, 119, 0.08);
}

.search-input__icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-input__field {
  flex: 1;
  height: 100%;
  font-size: 15px;
  color: var(--text-primary);
}

.search-input__field::placeholder {
  color: var(--text-tertiary);
}

.search-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-out);
}

.search-input__clear:active {
  color: var(--text-primary);
}
</style>
