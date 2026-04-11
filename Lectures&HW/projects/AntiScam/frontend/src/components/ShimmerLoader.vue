<template>
  <div class="shimmer-loader">
    <div v-for="n in lines" :key="n" class="shimmer-line shimmer" :style="{ width: lineWidth(n) }" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  lines?: number;
}>(), {
  lines: 4,
});

function lineWidth(index: number): string {
  const widths = ['100%', '85%', '92%', '70%', '78%', '88%'];
  return widths[(index - 1) % widths.length];
}
</script>

<style scoped>
.shimmer-loader {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shimmer-line {
  height: 16px;
  border-radius: 8px;
}
</style>
