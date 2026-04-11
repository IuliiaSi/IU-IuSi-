export function useValidation() {
  const isPhoneValid = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 11;
  };

  const isCodeValid = (code: string): boolean => {
    return /^\d{4}$/.test(code);
  };

  const isYearValid = (year: string): boolean => {
    const y = parseInt(year);
    return y >= 1990 && y <= new Date().getFullYear();
  };

  const isMileageValid = (mileage: string): boolean => {
    const m = parseInt(mileage);
    return m > 0 && m < 1000000;
  };

  return { isPhoneValid, isCodeValid, isYearValid, isMileageValid };
}
