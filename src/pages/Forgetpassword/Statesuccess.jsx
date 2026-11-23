import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ResetandState.css'
import { useI18n } from '../../i18n'
import logo from '../../assets/Logo.png'

const text = {
  en: {
    brand: 'Opream Web',
    tagline: 'Faculty Internship & Practicum Network',
    institutional: 'Institutional',
    env: 'Authorized Academic Environment',
    title: 'Forgot Password',
    subtitle: 'Enter your academic email to receive password reset instructions.',
    notice: 'Previous link expired or invalid?',
    emailLabel: 'Academic Email',
    emailPlaceholder: 'student.id@university.edu',
    submit: 'Send Reset Link',
    back: 'Back to Login',
    invalid: 'Please enter a valid email address.',
    modalTitle: 'Check Your Email',
    modalBody: 'If this email is registered, you will receive a reset link.',
    backToLoginBtn: 'Back to Login',
    goToResetBtn: 'Open Reset Password Screen',
  },
  ar: {
    brand: 'أوبريم ويب',
    tagline: 'شبكة التدريب الميداني لأعضاء هيئة التدريس',
    institutional: 'مؤسسي',
    env: 'بيئة أكاديمية معتمدة',
    title: 'نسيت كلمة المرور',
    subtitle: 'أدخل بريدك الأكاديمي لاستلام تعليمات إعادة تعيين كلمة المرور.',
    notice: 'الرابط السابق منتهي أو غير صالح؟',
    emailLabel: 'البريد الأكاديمي',
    emailPlaceholder: 'student.id@university.edu',
    submit: 'إرسال رابط إعادة التعيين',
    back: 'العودة لتسجيل الدخول',
    invalid: 'يرجى إدخال بريد إلكتروني صحيح.',
    modalTitle: 'تحقق من بريدك الإلكتروني',
    modalBody: 'إذا كان هذا البريد مسجلاً، فستصلك رسالة تحتوي على رابط إعادة التعيين.',
    backToLoginBtn: 'العودة لتسجيل الدخول',
    goToResetBtn: 'الانتقال إلى شاشة تعيين كلمة المرور',
  },
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const ShieldCheckIcon = () => (
  <svg {...svgProps} width="24" height="24">
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const ResetLockIcon = () => (
  <svg {...svgProps} width="28" height="28">
    <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
    <path d="M3 4v4.5h4.5" />
    <rect x="9.5" y="11" width="5" height="4.5" rx="1" />
    <path d="M10.5 11V9.8a1.5 1.5 0 0 1 3 0V11" />
  </svg>
)

const InfoIcon = () => (
  <svg {...svgProps} width="20" height="20">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.01" />
  </svg>
)

const MailIcon = () => (
  <svg {...svgProps} width="16" height="16">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
)

const BigMailIcon = () => (
  <svg {...svgProps} width="24" height="24">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg {...svgProps} width="18" height="18">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export default function Statesuccess() {
  const navigate = useNavigate()
  const { language, setLanguage } = useI18n()
  const lang = language === 'ar' ? 'ar' : 'en'

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSentModalOpen, setIsSentModalOpen] = useState(false)

  const t = text[lang]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t.invalid)
      return
    }

    setError('')
    // TODO: استدعاء API إرسال رابط الاستعادة هنا
    setIsSentModalOpen(true)
  }

  const handleGoToReset = () => {
    setIsSentModalOpen(false)
    navigate('/reset-password', {
      state: { email: email.trim() },
    })
  }

  return (
    <div className="forgot-page">
      <header className="forgot-header">
        <div className="brand">
          <div className="brand-logo">
            <img src={logo} alt="Opream Web" />
          </div>
          <span className="chip">{t.institutional}</span>
        </div>

        <div className="header-end">
          <span className="env-label"><ShieldCheckIcon />{t.env}</span>
          <div className="lang-switch">
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'ar' ? 'active' : ''}
              onClick={() => setLanguage('ar')}
            >
              العربية
            </button>
          </div>
        </div>
      </header>

      <main className="forgot-main">
        <form className="forgot-card" onSubmit={handleSubmit}>
          <div className="forgot-icon"><ResetLockIcon /></div>
          <h1>{t.title}</h1>
          <p className="forgot-subtitle">{t.subtitle}</p>

          <button
            type="button"
            className="notice notice-btn"
            onClick={() =>
              navigate('/reset-password', {
                state: { email: email.trim(), expired: true },
              })
            }
          >
            <InfoIcon />
            {t.notice}
          </button>

          <label htmlFor="email">{t.emailLabel}</label>
          <div className="field">
            <span className="field-icon"><MailIcon /></span>
            <input
              id="email"
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit">{t.submit}</button>
          <button type="button" className="back" onClick={() => navigate('/login')}>
            <ArrowLeftIcon />{t.back}
          </button>
        </form>
      </main>

      {isSentModalOpen && (
        <div className="email-modal-backdrop" role="dialog" aria-modal="true">
          <div className="email-modal-card">
            <div className="email-modal-icon">
              <BigMailIcon />
            </div>
            <h2>{t.modalTitle}</h2>
            <p className="email-modal-text">{t.modalBody}</p>

            <button
              type="button"
              className="email-modal-primary"
              onClick={() => navigate('/login')}
            >
              {t.backToLoginBtn}
            </button>

            <button
              type="button"
              className="email-modal-secondary"
              onClick={handleGoToReset}
            >
              {t.goToResetBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}