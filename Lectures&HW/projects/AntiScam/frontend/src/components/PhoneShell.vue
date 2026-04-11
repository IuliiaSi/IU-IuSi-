<template>
  <div class="phone-shell">
    <div class="phone-shell__notch"></div>
    <div class="phone-shell__screen">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.phone-shell {
  width: 100%;
  max-width: 390px;
  height: 100vh;
  max-height: 844px;
  background-color: var(--bg);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.phone-shell__notch {
  display: none;
}

.phone-shell__screen {
  width: 100%;
  height: 100%;
  position: relative;
}

@media (min-width: 500px) {
  .phone-shell {
    border-radius: 44px;
    box-shadow: var(--shadow-elevated), 0 0 0 2px var(--surface-high);
  }

  .phone-shell__notch {
    display: block;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 28px;
    background-color: #000;
    border-radius: 14px;
    z-index: 100;
  }

  .phone-shell__screen {
    border-radius: 44px;
    overflow: hidden;
  }
}
</style>
