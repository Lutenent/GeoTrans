import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateToken, registerApi } from '../api/authApi';
import { useAuth } from '../auth/AuthContext';


/**
 * Экран регистрации в стиле GeoTransfer.
 * Шаг 1 — ввод инвайт‑токена.
 * Шаг 2 — логин, почта, пароль, повтор пароля.
 * Шаг 3 — успешная регистрация + 5 сек. таймер и редирект.
 */
export default function RegistrationForm() {
  const { login } = useAuth();
  const [step, setStep] = useState('invite'); // 'invite' | 'form' | 'success'
  const [invite, setInvite] = useState('');
  const [tokenStatus, setTokenStatus] = useState('idle'); // idle | checking | valid | invalid

  const [name, setName] = useState('');     // логин
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passRepeat, setPassRepeat] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();

  // таймер на 3‑м шаге: через 5 секунд отправляем на главную
  useEffect(() => {
    if (step !== 'success') return;

    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/', { replace: true }); // <<< если dashboard по другому пути — меняешь тут
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, navigate]);

  // ------------------------------
  // Проверка инвайт‑кода (шаг 1)
  // ------------------------------
  const checkInvite = async () => {
    if (!invite.trim()) {
      setTokenStatus('invalid');
      setError('Введите код приглашения');
      return;
    }

    setError('');
    setTokenStatus('checking');
    try {
      const ok = await validateToken(invite.trim());
      if (ok) {
        setTokenStatus('valid');
      } else {
        setTokenStatus('invalid');
        setError('Код приглашения не найден или уже использован');
      }
    } catch (e) {
      setTokenStatus('invalid');
      setError(e.message || 'Ошибка проверки кода приглашения');
    }
  };

  const goNext = () => {
    if (tokenStatus !== 'valid') {
      setError('Сначала подтвердите код приглашения');
      return;
    }
    setError('');
    setStep('form');
  };

  // ------------------------------
  // Регистрация пользователя (шаг 2)
  // ------------------------------
    const onRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (pass.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);
    try {
      // 1) сначала регистрируем пользователя
      await registerApi({ name, email, password: pass, token: invite });

      // 2) сразу авторизуем его теми же email/паролем
      const user = await login(email, pass);

      // 3) если логин успешен — ведём на главную
      if (user) {
        navigate('/', { replace: true });
      } else {
        // запасной вариант — если вдруг логин не вернул юзера
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };



  const currentStep = step === 'invite' ? 1 : step === 'form' ? 2 : 3;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05070b] text-zinc-100 flex items-center justify-center px-4">
      {/* красные полосы сверху и снизу */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] z-20 bg-gradient-to-r from-transparent via-[#e04646] to-transparent shadow-[0_0_20px_rgba(224,70,70,0.7)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] z-20 bg-gradient-to-r from-transparent via-[#e04646] to-transparent shadow-[0_0_20px_rgba(224,70,70,0.7)]" />

      {/* фон с анимацией — как в LoginForm */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="auth-grid absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03),_transparent_60%)]" />
        <div className="auth-blob absolute -top-40 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(224,70,70,0.22),_transparent_60%)] blur-3xl" />
        <div className="auth-blob auth-blob-slow absolute -bottom-40 -left-10 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(224,70,70,0.16),_transparent_60%)] blur-3xl" />
        <div className="auth-blob auth-blob-slower absolute -bottom-48 -right-16 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-xl">
        {/* Логотип — без рамки, крупнее */}
        <div className="flex flex-col items-center">
          <img
            src="/bull-logo.png"
            alt="GeoTransfer"
            className="h-20 w-20 object-contain drop-shadow-[0_0_35px_rgba(224,70,70,0.9)]"
          />
        </div>

        {/* Карточка регистрации */}
        <div className="w-full rounded-[32px] bg-[rgba(16,17,23,0.98)] border border-[rgba(255,255,255,0.08)] shadow-[0_32px_90px_rgba(0,0,0,0.9)] px-10 py-10 backdrop-blur-xl">
          {/* Шаги */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <StepCircle step={1} active={currentStep === 1} />
            <div className="h-px w-10 bg-[rgba(255,255,255,0.06)]" />
            <StepCircle step={2} active={currentStep === 2} />
            <div className="h-px w-10 bg-[rgba(255,255,255,0.06)]" />
            <StepCircle step={3} active={currentStep === 3} />
          </div>

          <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight">
            Регистрация в GeoTransfer
          </h1>
          <p className="mb-6 text-center text-xs text-zinc-400">
            Введите код приглашения и свои данные, чтобы получить доступ к кабинету.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Шаг 1: инвайт‑код */}
          {step === 'invite' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Код приглашения
                </label>
                <div className="relative flex items-center gap-2">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                    <TicketIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={invite}
                    onChange={(e) => {
                      setInvite(e.target.value);
                      setTokenStatus('idle');
                      setError('');
                    }}
                    placeholder="TKN-XXXXXX"
                    className="h-11 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,14,0.95)] px-3 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-0 transition focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
                  />

                  {/* Индикатор / кнопка проверки */}
                  {tokenStatus === 'idle' && (
                    <button
                      type="button"
                      onClick={checkInvite}
                      className="shrink-0 rounded-lg bg-[#e04646] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_26px_rgba(224,70,70,0.4)] transition hover:bg-[#eb5a5a]"
                    >
                      OK
                    </button>
                  )}

                  {tokenStatus === 'checking' && (
                    <div className="shrink-0 px-3 py-2 text-[11px] text-zinc-400 animate-pulse">
                      Проверка…
                    </div>
                  )}

                  {tokenStatus === 'valid' && (
                    <div className="shrink-0 px-3 py-2 text-sm font-bold text-emerald-400">
                      ✓
                    </div>
                  )}

                  {tokenStatus === 'invalid' && (
                    <div className="shrink-0 px-3 py-2 text-sm font-bold text-red-400">
                      ✕
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={tokenStatus !== 'valid'}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e04646] py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_18px_40px_rgba(224,70,70,0.45)] transition hover:bg-[#eb5a5a] hover:shadow-[0_22px_50px_rgba(224,70,70,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Продолжить
                {tokenStatus === 'valid' && <ArrowRightIcon className="h-4 w-4" />}
              </button>
            </div>
          )}

          {/* Шаг 2: данные пользователя */}
          {step === 'form' && (
            <form className="space-y-4" onSubmit={onRegister}>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Логин
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,14,0.95)] px-3 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-0 transition focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
                    placeholder="Ваш логин"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                    <MailIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,14,0.95)] px-3 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-0 transition focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Пароль
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                    <LockIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,14,0.95)] px-3 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-0 transition focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
                    placeholder="Минимум 6 символов"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Повтор пароля
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                    <LockIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={passRepeat}
                    onChange={(e) => setPassRepeat(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,14,0.95)] px-3 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-0 transition focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e04646] py-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_18px_40px_rgba(224,70,70,0.45)] transition hover:bg-[#eb5a5a] hover:shadow-[0_22px_50px_rgba(224,70,70,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Регистрируем…' : 'Завершить регистрацию'}
                {!loading && <ArrowRightIcon className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('invite');
                  setError('');
                }}
                className="w-full pt-1 text-center text-[11px] text-zinc-500 transition hover:text-zinc-300"
              >
                Назад к вводу кода
              </button>
            </form>
          )}

          {/* Шаг 3: успешная регистрация */}
          {step === 'success' && (
            <div className="pt-4 pb-2 flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <svg className="h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M8 12.5L10.5 15L16 9.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <p className="text-base font-semibold">
                  Регистрация успешно завершена
                </p>

                <p className="text-[11px] text-zinc-400 max-w-sm">
                  Ваша учётная запись активирована. Через{' '}
                  <span className="font-semibold text-zinc-200">{countdown}</span>{' '}
                  секунд вы будете перенаправлены на главную страницу.
                  <br />
                  Если этого не произошло, вы можете{' '}
                  <Link
                    to="/"
                    className="font-medium text-[#eb5a5a] hover:text-[#ff6666] transition"
                  >
                    перейти вручную
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}


          {/* Ссылка "Уже есть аккаунт?" — только когда не success */}
          {step !== 'success' && (
            <div className="mt-6 text-center text-xs text-zinc-500">
              Уже есть аккаунт?{' '}
              <Link
                to="/login"
                className="font-medium text-[#eb5a5a] transition hover:text-[#ff6666]"
              >
                Войти
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Кружок шага */
function StepCircle({ step, active }) {
  const base =
    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition';
  if (active) {
    return (
      <div
        className={`${base} border-[#e04646] bg-[rgba(224,70,70,0.12)] text-white shadow-[0_0_18px_rgba(224,70,70,0.65)]`}
      >
        {step}
      </div>
    );
  }

  return (
    <div
      className={`${base} border-[rgba(255,255,255,0.12)] bg-[rgba(20,21,29,0.95)] text-zinc-400`}
    >
      {step}
    </div>
  );
}

/** Иконка инвайт‑кода */
function TicketIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 6V18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="15" cy="10" r="1.1" fill="currentColor" />
      <circle cx="15" cy="14" r="1.1" fill="currentColor" />
    </svg>
  );
}

/** Иконка пользователя */
function UserIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 19C5.8 16.6 8.2 15 12 15C15.8 15 18.2 16.6 19 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Иконка конверта */
function MailIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 6L12 13L2 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Иконка замка */
function LockIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="10"
        width="16"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 10V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="1.3" fill="currentColor" />
    </svg>
  );
}

/** Иконка стрелки вправо */
function ArrowRightIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
