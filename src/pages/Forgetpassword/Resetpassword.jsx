import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import './ResetandState.css'
import { useI18n } from '../../i18n'
import logo from '../../assets/Logo.png'

const text = {
  en: {
    brand: 'Opream Web',
    tagline: 'Faculty Internship & Practicum Network',
    institutional: 'Institutional',
    env: 'Authorized Academic Environment',
    expiredTitle: 'Link Expired or Invalid',
    expiredBody:
      'Please contact your college placement coordinator for a fresh activation link if this verification token is older than 60 Minutes.',
    badge: 'Student Account Activation & Password Setup',
    title: 'Set Your Academic Password',
    subtitle: 'Create your new password to activate your college-provisioned account.',
    provisionedId: 'Provisioned ID',
    defaultId: 'std-2024-91048@university.edu',
    verified: 'Verified',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter at least 8 characters',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    reqTitle: 'Password Requirements',
    reqLength: 'At least 8-50 characters',
    reqNumber: '1 number (0-9)',
    submit: 'Activate Account & Sign In',
    returnLogin: 'Return to Login',
    mismatch: 'Passwords do not match.',
    requirementsErr: 'Please meet all password requirements first.',
    show: 'Show',
    hide: 'Hide',
  },
  ar: {
    brand: 'أوبريم ويب',
    tagline: 'شبكة التدريب الميداني لأعضاء هيئة التدريس',
    institutional: 'مؤسسي',
    env: 'بيئة أكاديمية معتمدة',
    expiredTitle: 'الرابط منتهي الصلاحية أو غير صالح',
    expiredBody:
      'يرجى التواصل مع منسق التدريب بالكلية للحصول على رابط تفعيل جديد إذا مر أكثر من 60 دقيقة على رمز التحقق.',
    badge: 'تفعيل حساب الطالب وإعداد كلمة المرور',
    title: 'تعيين كلمة المرور الأكاديمية',
    subtitle: 'أنشئ كلمة مرور جديدة لتفعيل حسابك الجامعي المخصص.',
    provisionedId: 'المعرف المخصص',
    defaultId: 'std-2024-91048@university.edu',
    verified: 'تم التحقق',
    newPassword: 'كلمة المرور الجديدة',
    newPasswordPlaceholder: 'أدخل 8 أحرف على الأقل',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
    reqTitle: 'شروط كلمة المرور',
    reqLength: 'من 8 إلى 50 حرفاً على الأقل',
    reqNumber: 'رقم واحد على الأقل (0-9)',
    submit: 'تفعيل الحساب وتسجيل الدخول',
    returnLogin: 'العودة لتسجيل الدخول',
    mismatch: 'كلمتا المرور غير متطابقتين.',
    requirementsErr: 'يرجى استيفاء جميع شروط كلمة المرور أولاً.',
    show: 'إظهار',
    hide: 'إخفاء',
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

const WarningIcon = () => (
  <svg {...svgProps} width="20" height="20">
    <path d="M10.3 3.9 1.8 18.5a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)

const IdBadgeIcon = () => (
  <svg {...svgProps} width="20" height="20">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M6 16c.8-1.3 2-2 3-2s2.2.7 3 2M14 9h4M14 13h4" />
  </svg>
)

const LockIcon = () => (
  <svg {...svgProps} width="17" height="17">
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)

const EyeIcon = ({ open }) => (
  <svg {...svgProps} width="18" height="18">
    {open ? (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.9 17.9A10.9 10.9 0 0 1 12 19c-6.4 0-10-7-10-7a18.2 18.2 0 0 1 5.1-5.9" />
        <path d="M9.9 4.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.1 3.2" />
        <path d="M3 3l18 18" />
      </>
    )}
  </svg>
)

const ArrowLeftIcon = () => (
  <svg {...svgProps} width="18" height="18">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { language, setLanguage } = useI18n()
  const lang = language === 'ar' ? 'ar' : 'en'
  const t = text[lang]

  const state = location.state || {}
  const provisionedId =
    state.email || searchParams.get('email') || t.defaultId
  const isExpired = Boolean(state.expired || searchParams.get('expired') === 'true')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const hasValidLength = password.length >= 8 && password.length <= 50
  const hasNumber = /[0-9]/.test(password)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!hasValidLength || !hasNumber) {
      setError(t.requirementsErr)
      return
    }

    if (password !== confirmPassword) {
      setError(t.mismatch)
      return
    }

    setError('')
    // TODO: استدعاء API حفظ كلمة المرور الجديدة ثم التوجيه لصفحة الدخول
    navigate('/login')
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

      <main className="reset-main">
        {isExpired && (
          <div className="reset-alert" role="alert">
            <span className="reset-alert-icon"><WarningIcon /></span>
            <div>
              <div className="reset-alert-title">{t.expiredTitle}</div>
              <p className="reset-alert-body">{t.expiredBody}</p>
            </div>
          </div>
        )}

        <form className="reset-card" onSubmit={handleSubmit}>
          <div className="reset-badge">
            <ShieldCheckIcon />
            <span>{t.badge}</span>
          </div>

          <h1 className="reset-title">{t.title}</h1>
          <p className="reset-subtitle">{t.subtitle}</p>

          <div className="provisioned-box">
            <div className="provisioned-left">
              <span className="provisioned-icon"><IdBadgeIcon /></span>
              <div>
                <div className="provisioned-label">{t.provisionedId}</div>
                <div className="provisioned-value">{provisionedId}</div>
              </div>
            </div>
            <span className="verified-pill">{t.verified}</span>
          </div>

          <label htmlFor="new-password" className="reset-label">{t.newPassword}</label>
          <div className="reset-field">
            <span className="reset-field-icon"><LockIcon /></span>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t.newPasswordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-btn"
              aria-label={showPassword ? t.hide : t.show}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          <label htmlFor="confirm-password" className="reset-label">{t.confirmPassword}</label>
          <div className="reset-field">
            <span className="reset-field-icon"><LockIcon /></span>
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder={t.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-btn"
              aria-label={showConfirm ? t.hide : t.show}
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>

          <div className="requirements-box">
            <div className="requirements-title">{t.reqTitle}</div>
            <div className={`req-item ${hasValidLength ? 'met' : ''}`}>
              <span className="req-dot" />
              <span>{t.reqLength}</span>
            </div>
            <div className={`req-item ${hasNumber ? 'met' : ''}`}>
              <span className="req-dot" />
              <span>{t.reqNumber}</span>
            </div>
          </div>

          {error && <p className="reset-error">{error}</p>}

          <button type="submit" className="reset-submit">{t.submit}</button>

          <button type="button" className="reset-return" onClick={() => navigate('/login')}>
            <ArrowLeftIcon />
            <span>{t.returnLogin}</span>
          </button>
        </form>
      </main>
    </div>
  )
}