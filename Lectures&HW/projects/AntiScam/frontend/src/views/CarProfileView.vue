<template>
  <div class="screen">
    <TopBar show-back @back="router.back()" />

    <div class="screen-content">
      <StepIndicator :label="copy.car.step" />

      <h1 class="headline-lg car__headline">{{ copy.car.headline }}</h1>
      <p class="body-md car__subtitle">{{ copy.car.subtitle }}</p>

      <div class="car__form">
        <div class="car__field">
          <label class="car__label">{{ copy.car.brandLabel }}</label>
          <div class="car__select-wrap" :class="{ 'car__select-wrap--open': brandOpen }">
            <button class="car__select-trigger" @click="brandOpen = !brandOpen">
              <span :class="{ 'car__placeholder': !store.car.brand }">
                {{ store.car.brand || 'Выберите марку' }}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :style="{ transform: brandOpen ? 'rotate(180deg)' : '' }">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="brandOpen" class="car__dropdown">
              <button
                v-for="brand in copy.car.brands"
                :key="brand"
                class="car__dropdown-item"
                :class="{ 'car__dropdown-item--selected': store.car.brand === brand }"
                @click="selectBrand(brand)"
              >
                {{ brand }}
              </button>
            </div>
          </div>
        </div>

        <div class="car__field">
          <label class="car__label">{{ copy.car.modelLabel }}</label>
          <div class="car__input-wrap" :class="{ 'car__input-wrap--focused': modelFocused }">
            <input
              class="car__input"
              type="text"
              placeholder="Например, Camry"
              :value="store.car.model"
              @input="store.setCar('model', ($event.target as HTMLInputElement).value)"
              @focus="modelFocused = true"
              @blur="modelFocused = false"
            />
          </div>
        </div>

        <div class="car__row">
          <div class="car__field car__field--half">
            <label class="car__label">{{ copy.car.yearLabel }}</label>
            <div class="car__input-wrap" :class="{ 'car__input-wrap--focused': yearFocused }">
              <input
                class="car__input"
                type="text"
                inputmode="numeric"
                placeholder="2018"
                maxlength="4"
                :value="store.car.year"
                @input="store.setCar('year', ($event.target as HTMLInputElement).value.replace(/\D/g, ''))"
                @focus="yearFocused = true"
                @blur="yearFocused = false"
              />
            </div>
          </div>

          <div class="car__field car__field--half">
            <label class="car__label">{{ copy.car.mileageLabel }}</label>
            <div class="car__input-wrap" :class="{ 'car__input-wrap--focused': mileageFocused }">
              <input
                class="car__input"
                type="text"
                inputmode="numeric"
                placeholder="85 000"
                :value="formattedMileage"
                @input="onMileageInput"
                @focus="mileageFocused = true"
                @blur="mileageFocused = false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomCTA
      :label="copy.car.continue"
      :disabled="!store.isCarValid"
      @click="onContinue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import TopBar from '@/components/TopBar.vue';
import StepIndicator from '@/components/StepIndicator.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();
const store = useAppStore();

const brandOpen = ref(false);
const modelFocused = ref(false);
const yearFocused = ref(false);
const mileageFocused = ref(false);

const formattedMileage = computed(() => {
  const num = parseInt(store.car.mileage);
  if (isNaN(num) || store.car.mileage === '') return '';
  return num.toLocaleString('ru-RU');
});

function selectBrand(brand: string) {
  store.setCar('brand', brand);
  brandOpen.value = false;
}

function onMileageInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  store.setCar('mileage', raw);
}

function onContinue() {
  if (store.isCarValid) {
    router.push('/method');
  }
}
</script>

<style scoped>
.car__headline {
  margin-top: 12px;
  margin-bottom: 8px;
}

.car__subtitle {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.car__form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.car__field {
  display: flex;
  flex-direction: column;
}

.car__row {
  display: flex;
  gap: 16px;
}

.car__field--half {
  flex: 1;
}

.car__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.car__input-wrap {
  position: relative;
  padding-bottom: 2px;
}

.car__input-wrap::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--outline-ghost);
  border-radius: 1px;
  transition: all var(--duration-fast) var(--ease-out);
}

.car__input-wrap--focused::after {
  background: var(--primary);
  box-shadow: 0 0 12px rgba(26, 127, 119, 0.3);
}

.car__input {
  width: 100%;
  font-size: 17px;
  color: var(--text-primary);
  padding: 10px 0;
}

.car__input::placeholder {
  color: var(--text-tertiary);
}

.car__select-wrap {
  position: relative;
}

.car__select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  padding-bottom: 12px;
  font-size: 17px;
  color: var(--text-primary);
  position: relative;
}

.car__select-trigger::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--outline-ghost);
  border-radius: 1px;
  transition: all var(--duration-fast) var(--ease-out);
}

.car__select-wrap--open .car__select-trigger::after {
  background: var(--primary);
}

.car__select-trigger svg {
  color: var(--text-tertiary);
  transition: transform var(--duration-fast) var(--ease-out);
}

.car__placeholder {
  color: var(--text-tertiary);
}

.car__dropdown {
  position: absolute;
  top: 100%;
  left: -16px;
  right: -16px;
  z-index: 30;
  max-height: 240px;
  overflow-y: auto;
  background: var(--surface-high);
  border-radius: var(--radius-md);
  padding: 6px;
  margin-top: 4px;
  box-shadow: var(--shadow-elevated);
}

.car__dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  font-size: 15px;
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) var(--ease-out);
}

.car__dropdown-item:active {
  background: var(--outline-ghost);
}

.car__dropdown-item--selected {
  color: var(--secondary);
  background: rgba(26, 127, 119, 0.1);
}
</style>
