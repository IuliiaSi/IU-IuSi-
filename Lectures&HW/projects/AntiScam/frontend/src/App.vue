<template>
  <div class="app-desktop-wrapper">
    <PhoneShell>
      <router-view v-slot="{ Component, route }">
        <transition :name="(route.meta.transition as string) || 'slide-left'" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </PhoneShell>
  </div>
</template>

<script setup lang="ts">
import PhoneShell from './components/PhoneShell.vue';
</script>

<style scoped>
.app-desktop-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a0a0a;
  background-image: radial-gradient(circle, rgba(26, 127, 119, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>
