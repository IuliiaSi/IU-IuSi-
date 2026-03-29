const ctaButton = document.getElementById('ctaButton');
const formSection = document.getElementById('lead-form-section');
const leadForm = document.getElementById('leadForm');
const formMessage = document.getElementById('formMessage');

// ─── Step navigation ──────────────────────────────────────────────────────────
const formStep1 = document.getElementById('formStep1');
const formStep2 = document.getElementById('formStep2');
const nextStepBtn = document.getElementById('nextStepBtn');
const prevStepBtn = document.getElementById('prevStepBtn');
const stepDots = document.querySelectorAll('.step-dot');

function setStep(step) {
  if (step === 1) {
    formStep1.style.display = 'block';
    formStep2.style.display = 'none';
  } else {
    formStep1.style.display = 'none';
    formStep2.style.display = 'block';
  }
  stepDots.forEach((dot, i) => {
    dot.classList.toggle('active', i < step);
  });
}

nextStepBtn.addEventListener('click', () => {
  const brand = leadForm.elements['brand'].value.trim();
  const model = leadForm.elements['model'].value.trim();
  const year = leadForm.elements['year'].value.trim();
  const mileage = leadForm.elements['mileage'].value.trim();

  if (!brand || !model || !year || !mileage) {
    alert('Пожалуйста, заполните все поля автомобиля.');
    return;
  }

  setStep(2);
  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

prevStepBtn.addEventListener('click', () => {
  setStep(1);
  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

ctaButton.addEventListener('click', () => {
  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ─── Form submit ──────────────────────────────────────────────────────────────
leadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const brand = formData.get('brand')?.toString().trim();
  const model = formData.get('model')?.toString().trim();
  const year = Number(formData.get('year'));
  const mileage = Number(formData.get('mileage'));

  const currentYear = new Date().getFullYear();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !brand || !model || !year || !mileage) {
    showMessage('Пожалуйста, заполните все обязательные поля.', 'error');
    return;
  }

  if (!isEmailValid) {
    showMessage('Укажите корректный email.', 'error');
    return;
  }

  if (year < 1990 || year > currentYear) {
    showMessage(`Год выпуска должен быть в диапазоне 1990–${currentYear}.`, 'error');
    return;
  }

  if (mileage < 0) {
    showMessage('Пробег не может быть отрицательным.', 'error');
    return;
  }

  showMessage(
    `Спасибо, ${name}! Заявка по ${brand} ${model} принята. Мы подготовим предварительную проверку рекомендаций сервиса.`,
    'success'
  );

  leadForm.reset();
  setStep(1);
});

// ─── AI analysis ──────────────────────────────────────────────────────────────
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeBtnText = document.getElementById('analyzeBtnText');
const aiResultSection = document.getElementById('ai-result-section');
const aiResultCard = document.getElementById('aiResultCard');

const STORAGE_KEY = 'antiscam_last_analysis';

function saveToStorage(fields, result) {
  const entry = { fields, result, savedAt: new Date().toLocaleString('ru-RU') };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function restoreFields(fields) {
  Object.entries(fields).forEach(([name, value]) => {
    const el = leadForm.elements[name];
    if (el) el.value = value;
  });
  setStep(2);
}

function showSavedResult(entry) {
  const { fields, result, savedAt } = entry;
  const heading = `${fields.brand} ${fields.model}, ${fields.year} г., ${fields.mileage} км`;
  aiResultCard.innerHTML =
    `<div class="ai-result-meta">Сохранённый результат от ${savedAt} · <strong>${heading}</strong> · <button class="ai-clear-btn" id="clearResultBtn">Очистить</button></div>` +
    `<div class="ai-result-text">${result.replace(/\n/g, '<br>')}</div>`;
  aiResultSection.style.display = 'block';
  document.getElementById('clearResultBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    aiResultSection.style.display = 'none';
    leadForm.reset();
    setStep(1);
  });
}

const saved = loadFromStorage();
if (saved) {
  restoreFields(saved.fields);
  showSavedResult(saved);
}

analyzeBtn.addEventListener('click', async () => {
  const formData = new FormData(leadForm);
  const brand = formData.get('brand')?.toString().trim();
  const model = formData.get('model')?.toString().trim();
  const year = formData.get('year')?.toString().trim();
  const mileage = formData.get('mileage')?.toString().trim();
  const serviceList = formData.get('serviceList')?.toString().trim();

  if (!brand || !model || !year || !mileage) {
    showMessage('Заполните данные автомобиля (марка, модель, год, пробег) для анализа.', 'error');
    return;
  }

  if (!serviceList) {
    showMessage('Укажите список рекомендаций сервиса для анализа.', 'error');
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtnText.textContent = 'Анализирую...';
  showMessage('', '');
  aiResultSection.style.display = 'none';

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name')?.toString().trim(),
        brand, model, year, mileage, serviceList,
      }),
    });

    const data = await response.json();

    if (data.error) {
      showMessage(data.error, 'error');
    } else {
      const fields = { brand, model, year, mileage, serviceList };
      saveToStorage(fields, data.result);
      showSavedResult({ fields, result: data.result, savedAt: new Date().toLocaleString('ru-RU') });
      aiResultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    showMessage('Не удалось получить ответ от AI. Проверьте соединение.', 'error');
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtnText.textContent = 'Получить анализ от AI';
  }
});

// ─── Send estimate ────────────────────────────────────────────────────────────
const sendEstimateBtn = document.getElementById('sendEstimateBtn');

sendEstimateBtn.addEventListener('click', () => {
  const formData = new FormData(leadForm);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const brand = formData.get('brand')?.toString().trim();
  const model = formData.get('model')?.toString().trim();

  if (!name || !email || !brand || !model) {
    showMessage('Пожалуйста, заполните обязательные поля перед отправкой сметы.', 'error');
    return;
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isEmailValid) {
    showMessage('Укажите корректный email.', 'error');
    return;
  }

  showMessage(
    `Смета по ${brand} ${model} отправлена на ${email}. Ожидайте письмо в ближайшее время.`,
    'success'
  );

  leadForm.reset();
  setStep(1);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}
