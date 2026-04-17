<template>
  <div class="screen">
    <TopBar show-back @back="router.back()" />

    <div class="screen-content">
      <h1 class="headline-lg login__headline">{{ copy.login.headline }}</h1>
      <p class="body-md login__subtitle">{{ copy.login.subtitle }}</p>

      <div class="login__form">
        <div class="login__field">
          <label class="login__label">{{ copy.login.emailLabel }}</label>
          <div class="login__input-wrap" :class="{ 'login__input-wrap--focused': focusedField === 'email' }">
            <input
              v-model="email"
              class="login__input login__input--compact"
              type="email"
              autocomplete="email"
              :placeholder="copy.login.emailPlaceholder"
              @focus="focusedField = 'email'"
              @blur="focusedField = ''"
            />
          </div>
        </div>

        <div class="login__field">
          <label class="login__label">{{ copy.login.passwordLabel }}</label>
          <div class="login__input-wrap" :class="{ 'login__input-wrap--focused': focusedField === 'password' }">
            <input
              v-model="password"
              class="login__input login__input--compact"
              type="password"
              autocomplete="current-password"
              :placeholder="copy.login.passwordPlaceholder"
              @focus="focusedField = 'password'"
              @blur="focusedField = ''"
            />
          </div>
        </div>

        <div v-if="isRegisterMode" class="login__field">
          <label class="login__label">{{ copy.login.nameLabel }}</label>
          <div class="login__input-wrap" :class="{ 'login__input-wrap--focused': focusedField === 'name' }">
            <input
              v-model="name"
              class="login__input login__input--compact"
              type="text"
              autocomplete="name"
              :placeholder="copy.login.namePlaceholder"
              @focus="focusedField = 'name'"
              @blur="focusedField = ''"
            />
          </div>
        </div>

        <p v-if="errorMessage" class="login__message login__message--error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="login__message login__message--success">{{ successMessage }}</p>

        <BottomCTA
          :label="isRegisterMode ? copy.login.register : copy.login.login"
          :disabled="!isFormValid || submitting"
          @click="onSubmit"
        />

        <button class="login__switch-mode" :disabled="submitting" @click="toggleMode">
          {{ isRegisterMode ? copy.login.switchToLogin : copy.login.switchToRegister }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.store';
import { productCopy as copy } from '@/data/product-copy';
import TopBar from '@/components/TopBar.vue';
import BottomCTA from '@/components/BottomCTA.vue';

const router = useRouter();
const store = useAppStore();
const email = ref(store.auth.email);
const password = ref('');
const name = ref('');
const isRegisterMode = ref(false);
const submitting = ref(false);
const focusedField = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
const isPasswordValid = computed(() => password.value.length >= 6);
const isFormValid = computed(() => isEmailValid.value && isPasswordValid.value);

async function onSubmit() {
  if (!isFormValid.value || submitting.value) return;

  errorMessage.value = '';
  successMessage.value = '';
  submitting.value = true;

  try {
    const endpoint = isRegisterMode.value ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegisterMode.value
      ? { email: email.value.trim(), password: password.value, name: name.value.trim() || undefined }
      : { email: email.value.trim(), password: password.value };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = data.message || 'Ошибка авторизации.';
      return;
    }

    if (isRegisterMode.value) {
      successMessage.value = data.message || 'Регистрация успешна. Теперь выполните вход.';
      isRegisterMode.value = false;
      password.value = '';
      return;
    }

    const accessToken = data?.accessToken;
    const refreshToken = data?.refreshToken;

    if (!accessToken || !refreshToken) {
      errorMessage.value = 'Не удалось получить токены сессии.';
      return;
    }

    store.setAuthSession({
      email: email.value.trim(),
      accessToken,
      refreshToken,
    });

    router.push('/car');
  } catch (_error) {
    errorMessage.value = 'Сервер недоступен. Проверьте подключение и повторите.';
  } finally {
    submitting.value = false;
  }
}

function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value;
  errorMessage.value = '';
  successMessage.value = '';
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
  gap: 14px;
}

.login__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
  display: block;
}

.login__field {
  display: flex;
  flex-direction: column;
}

.login__input-wrap {
  position: relative;
  padding-bottom: 2px;
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

.login__input--compact {
  font-size: 18px;
  font-weight: 500;
}

.login__input::placeholder {
  color: var(--text-tertiary);
  font-weight: 400;
}

.login__message {
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

.login__message--error {
  color: #c53030;
}

.login__message--success {
  color: var(--secondary);
}

.login__switch-mode {
  font-size: 14px;
  color: var(--secondary);
  padding: 6px 0;
  text-align: center;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.login__switch-mode:active {
  opacity: 0.7;
}
</style>
