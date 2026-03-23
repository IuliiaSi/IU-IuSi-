const ctaButton = document.getElementById('ctaButton');
const formSection = document.getElementById('lead-form-section');
const leadForm = document.getElementById('leadForm');
const formMessage = document.getElementById('formMessage');

ctaButton.addEventListener('click', () => {
  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

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
});

const sendEstimateBtn = document.getElementById('sendEstimateBtn');

sendEstimateBtn.addEventListener('click', () => {
  const formData = new FormData(leadForm);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const brand = formData.get('brand')?.toString().trim();
  const model = formData.get('model')?.toString().trim();
  const serviceList = formData.get('serviceList')?.toString().trim();

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
});

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}
