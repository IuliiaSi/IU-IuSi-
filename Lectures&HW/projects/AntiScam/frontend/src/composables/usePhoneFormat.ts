import { ref, watch } from 'vue';

export function usePhoneFormat(initialValue = '') {
  const raw = ref(initialValue);
  const formatted = ref('');

  function format(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '';

    let result = '+7';
    const d = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits;

    if (d.length > 0) result += ' (' + d.slice(0, 3);
    if (d.length >= 3) result += ')';
    if (d.length > 3) result += ' ' + d.slice(3, 6);
    if (d.length > 6) result += '-' + d.slice(6, 8);
    if (d.length > 8) result += '-' + d.slice(8, 10);

    return result;
  }

  function setRaw(value: string) {
    raw.value = value.replace(/\D/g, '');
    formatted.value = format(raw.value);
  }

  watch(raw, (val) => {
    formatted.value = format(val);
  }, { immediate: true });

  return { raw, formatted, setRaw };
}
