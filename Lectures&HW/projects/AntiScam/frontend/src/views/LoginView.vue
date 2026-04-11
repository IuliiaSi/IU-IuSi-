<template>
  <div class="screen">
    <TopBar show-back @back="router.back()" />

    <div class="screen-content">
      <h1 class="headline-lg login__headline">{{ copy.login.headline }}</h1>
      <p class="body-md login__subtitle">{{ copy.login.subtitle }}</p>

      <div class="login__form">
        <div v-if="!store.auth.codeSent" class="login__phone-section">
          <label class="login__label">Номер телефона</label>
          <div class="login__input-wrap" :class="{ 'login__input-wrap--focused': phoneFocused }">
            <input
              ref="phoneInput"
              class="login__input"
              type="tel"
              inputmode="numeric"
              :placeholder="copy.login.phonePlaceholder"
              :value="phoneFormat.formatted.value"
              @input="onPhoneInput"
              @focus="phoneFocused = true"
              @blur="phoneFocused = false"
            />
          </div>
          <BottomCTA
            :label="copy.login.sendCode"
            :disabled="!isPhoneReady"
            @click="onSendCode"
          />
        </div>

        <div v-else class="login__code-section">
          <label class="login__label">{{ copy.login.codeHint }}</label>
          <div class="login__code-inputs">
            <input
              v-for="i in 4"
              :key="i"
              :ref="el => codeRefs[i - 1] = el as HTMLInputElement"
              class="login__code-digit"
              :class="{ 'login__code-digit--filled': codeDigits[i - 1] }"
              type="text"
              inputmode="numeric"
              maxlength="1"
              @input="onCodeDigit($event, i - 1)"
              @keydown="onCodeKeydown($event, i - 1)"
              @focus="activeCodeIdx = i - 1"
              @blur="activeCodeIdx = -1"
            />
          </div>
          <button class="login__auto-insert" @click="autoInsertCode">
            {{ copy.login.autoInsert }}
          </button>
          <BottomCTA
            :label="copy.login.continue"
            :disabled="!isCodeComplete"
            @click="onVerify"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import { usePhoneFormat } from '@/composables/usePhoneFormat';
import TopBar from '@/components/TopBar.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();
const store = useAppStore();
const phoneFormat = usePhoneFormat(store.auth.phone);
const phoneFocused = ref(false);
const phoneInput = ref<HTMLInputElement | null>(null);

const codeDigits = ref<string[]>(['', '', '', '']);
const codeRefs = ref<(HTMLInputElement | null)[]>([null, null, null, null]);
const activeCodeIdx = ref(-1);

const isPhoneReady = computed(() => {
  const digits = phoneFormat.raw.value.replace(/\D/g, '');
  return digits.length >= 10;
});

const isCodeComplete = computed(() => codeDigits.value.every(d => d.length === 1));

function onPhoneInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  phoneFormat.setRaw(val);
  store.setPhone(phoneFormat.raw.value);
}

function onSendCode() {
  if (!isPhoneReady.value) return;
  store.sendCode();
  nextTick(() => codeRefs.value[0]?.focus());
}

function onCodeDigit(e: Event, idx: number) {
  const val = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  codeDigits.value[idx] = val.slice(-1);
  (e.target as HTMLInputElement).value = codeDigits.value[idx];

  if (val && idx < 3) {
    nextTick(() => codeRefs.value[idx + 1]?.focus());
  }
}

function onCodeKeydown(e: KeyboardEvent, idx: number) {
  if (e.key === 'Backspace' && !codeDigits.value[idx] && idx > 0) {
    codeDigits.value[idx - 1] = '';
    nextTick(() => codeRefs.value[idx - 1]?.focus());
  }
}

function autoInsertCode() {
  codeDigits.value = ['1', '2', '3', '4'];
  codeRefs.value.forEach((ref, i) => {
    if (ref) ref.value = codeDigits.value[i];
  });
}

function onVerify() {
  if (!isCodeComplete.value) return;
  store.setCode(codeDigits.value.join(''));
  if (store.verifyCode()) {
    router.push('/car');
  }
}
</script>

<style scoped>
.login__headline {
  margin-bottom: 8px;
}

.login__subtitle {
  color: var(--text-secondary);
  margin-bottom: 36px;
}

.login__form {
  display: flex;
  flex-direction: column;
}

.login__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
  display: block;
}

.login__input-wrap {
  position: relative;
  padding-bottom: 2px;
  margin-bottom: 24px;
}

.login__input-wrap::after {
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

.login__input-wrap--focused::after {
  background: var(--primary);
  box-shadow: 0 0 12px rgba(26, 127, 119, 0.3);
}

.login__input {
  width: 100%;
  font-size: 24px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text-primary);
  padding: 8px 0;
  letter-spacing: 0.02em;
}

.login__input::placeholder {
  color: var(--text-tertiary);
  font-weight: 400;
}

.login__code-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login__code-section .login__label {
  align-self: flex-start;
}

.login__code-inputs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-self: flex-start;
}

.login__code-digit {
  width: 56px;
  height: 64px;
  text-align: center;
  font-size: 28px;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-low);
  border-radius: var(--radius-md);
  caret-color: var(--secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.login__code-digit:focus {
  background: var(--surface-high);
  box-shadow: 0 0 0 1px rgba(26, 127, 119, 0.4), 0 0 16px rgba(26, 127, 119, 0.12);
}

.login__code-digit--filled {
  background: var(--surface-high);
}

.login__auto-insert {
  font-size: 14px;
  color: var(--secondary);
  padding: 8px 0;
  margin-bottom: 16px;
  align-self: flex-start;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.login__auto-insert:active {
  opacity: 0.7;
}
</style>
