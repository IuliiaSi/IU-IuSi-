/**
 * Heuristics for Supabase Auth (GoTrue): HTTP 429, codes, and message text may differ
 * by endpoint/version. Use one place for rate-limit detection and user-facing text.
 */
export function isRateLimitedAuthError(error: unknown): boolean {
  if (error == null || typeof error !== 'object') {
    return false;
  }

  const e = error as {
    status?: number | string;
    message?: string;
    code?: string;
  };

  const s = Number(e.status);
  if (Number.isFinite(s) && s === 429) {
    return true;
  }

  const code = (e.code || '').toLowerCase();
  if (code === 'over_request_rate' || code === 'too_many_requests') {
    return true;
  }

  const msg = (e.message || '').toLowerCase();
  if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('429')) {
    return true;
  }
  if (msg.includes('email rate') || msg.includes('over_request')) {
    return true;
  }
  if (msg.includes('security purposes') && msg.includes('only request')) {
    return true;
  }

  return false;
}

export function mapSupabaseAuthError(error: {
  message: string;
  status?: number | string;
  code?: string;
}): string {
  if (isRateLimitedAuthError(error)) {
    return 'Сервер временно ограничил запросы. Подождите 1–2 минуты и попробуйте снова. Если письмо с подтверждением не приходит — проверьте папку «Спам».';
  }

  const code = (error.code || '').toLowerCase();
  if (code === 'user_already_exists' || code === 'email_address_not_available') {
    return 'Этот email уже зарегистрирован. Войдите с этим адресом.';
  }
  if (code === 'signup_disabled') {
    return 'Регистрация временно отключена. Обратитесь к администратору.';
  }
  if (code === 'invalid_credentials' || code === 'invalid_grant') {
    return 'Неверный email или пароль.';
  }
  if (code === 'email_not_confirmed') {
    return 'Подтвердите email по ссылке из письма, затем войдите.';
  }
  if (code === 'weak_password') {
    return 'Слишком слабый пароль. Усильте его (длина и сложность).';
  }
  if (code === 'validation_failed' || code === 'validation_error') {
    return error.message || 'Проверьте введённые данные.';
  }

  return error.message || 'Ошибка авторизации.';
}
