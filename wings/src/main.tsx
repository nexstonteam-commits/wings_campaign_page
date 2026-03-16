import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './styles.css'

import logoSrc from './assets/Logo.webp'
import boySrc from './assets/man2.webp'
import offerSrc from './assets/offer.webp'
import tabSrc from './assets/tab.webp'
import footer1Src from './assets/footer1.webp'
import ad1Src from './assets/Ad1.webp'
import ad2Src from './assets/Ad2.webp'
import ad3Src from './assets/Ad3.webp'

type LeadForm = {
  studentName: string
  guardianName: string
  phone: string
  school: string
  standard: string
  place: string
  consent: boolean
}

type LeadRecord = LeadForm & {
  id: string
  submittedAt: string
}

type SiteConfig = {
  meta: {
    title: string
    description: string
    keywords: string
    ogTitle: string
    ogDescription: string
    ogImage: string
  }
  hero: {
    badge: string
    titleMain: string
    titleHighlight: string
    intro1: string
    intro2: string
    ctaText: string
  }
  features: [string, string, string, string]
  giveaway: {
    title: string
    text: string
    english: string
  }
  campaignTitle: string
  form: {
    urgencyText: string
    eyebrow: string
    title: string
    subtitle: string
    studentLabel: string
    studentPlaceholder: string
    guardianLabel: string
    guardianPlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    standardLabel: string
    standardPlaceholder: string
    standardOptions: [string, string]
    schoolLabel: string
    schoolPlaceholder: string
    placeLabel: string
    placePlaceholder: string
    consentText: string
    submitText: string
    submittingText: string
  }
  infoCards: [
    { icon: string; title: string; text: string },
    { icon: string; title: string; text: string },
    { icon: string; title: string; text: string },
    { icon: string; title: string; text: string }
  ]
  footerText: string
  images: {
    logo: string
    boy: string
    offer: string
    tab: string
    footer: string
    ads: [string, string, string]
  }
}

const STORAGE_KEY = 'wingscampus-leads'
const FAKE_COUNTER_KEY = 'wingscampus-fake-giveaway-count'
const ADMIN_AUTH_KEY = 'wingscampus-admin-auth'
const SITE_CONFIG_KEY = 'wingscampus-site-config'
const CP_AUTH_KEY = 'wingscampus-cp-auth'
const GIVEAWAY_LIMIT = 100
const FAKE_COUNTER_MAX = 86
const ADMIN_USER_ID = 'NIDHIN'
const ADMIN_PASSWORD = 'WINGS@2026'
const CP_USER_ID = 'ASWIN'
const CP_PASSWORD = 'WINGS@2026'

const DEFAULT_SITE_CONFIG: SiteConfig = {
  meta: {
    title: 'Wings Campus - NEET/JEE Foundation Course',
    description: 'Wings Campus Kodungallur: NEET/JEE foundation for Classes 7 and 8. Register now.',
    keywords: 'Wings Campus, NEET, JEE, foundation course, Kodungallur',
    ogTitle: 'Wings Campus Kodungallur',
    ogDescription: 'Strong early preparation for NEET/JEE starts from Classes 7 and 8.',
    ogImage: offerSrc,
  },
  hero: {
    badge: 'NEET / JEE Foundation Course',
    titleMain: 'Wings Campus',
    titleHighlight: 'Kodungallur',
    intro1: 'Strong early preparation for NEET/JEE starts from Classes 7 and 8.',
    intro2: 'Join Wings Campus Foundation Program with expert faculty, structured practice, and competitive exam focus.',
    ctaText: 'Register Now',
  },
  features: ['📚 Expert Faculty', '🎯 Exam-Oriented Training', '🏫 STATE & CBSE', '📝 Class 7 & 8'],
  giveaway: {
    title: 'Win a Brand-New Tablet',
    text: 'First 100 registrations will enter the lucky draw for a Tablet.',
    english: 'Register among the first 100 students and enter the giveaway.',
  },
  campaignTitle: 'Our Campaigns',
  form: {
    urgencyText: 'Only {spotsLeft} spots left for the Tablet Giveaway',
    eyebrow: 'Registration / രജിസ്ട്രേഷൻ',
    title: 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യൂ',
    subtitle: "Complete this short form to reserve your child's seat in Wings Campus Foundation Course.",
    studentLabel: 'Student Name / വിദ്യാർത്ഥിയുടെ പേര് *',
    studentPlaceholder: "Enter student's full name",
    guardianLabel: 'Guardian Name / രക്ഷിതാവിന്റെ പേര് *',
    guardianPlaceholder: "Enter guardian's name",
    phoneLabel: 'Phone / ഫോൺ *',
    phonePlaceholder: '10-digit number',
    standardLabel: 'Standard / ക്ലാസ് *',
    standardPlaceholder: 'Select',
    standardOptions: ['6th Standard', '7th Standard'],
    schoolLabel: 'School Name / സ്കൂളിന്റെ പേര് *',
    schoolPlaceholder: 'Enter school name',
    placeLabel: 'Place / സ്ഥലം *',
    placePlaceholder: 'Enter your place / town',
    consentText: 'I authorize Wings Campus to contact me regarding the Foundation Course and Tablet Giveaway.',
    submitText: 'Register Now / ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യൂ',
    submittingText: 'Submitting...',
  },
  infoCards: [
    { icon: '🎁', title: 'Tablet Giveaway', text: 'ആദ്യത്തെ 100 രജിസ്ട്രേഷനുകളിൽ നിന്ന് ഒരു lucky winner ന് ഒരു tablet.' },
    { icon: '🎓', title: 'Why Foundation Course?', text: 'Early preparation during school years builds stronger basics for NEET and JEE.' },
    { icon: '🏆', title: 'Wings Campus Advantage', text: 'Expert faculty, structured curriculum, and exam-focused methods in Kodungallur.' },
    { icon: '📍', title: 'Limited Seats', text: 'Batch size is limited for personal attention. Complete registration early to reserve your seat.' },
  ],
  footerText: '© 2026 Wings Campus - Kodungallur. All rights reserved.',
  images: {
    logo: logoSrc,
    boy: boySrc,
    offer: offerSrc,
    tab: tabSrc,
    footer: footer1Src,
    ads: [ad1Src, ad2Src, ad3Src],
  },
}

class DuplicatePhoneError extends Error {
  constructor() {
    super('PHONE_ALREADY_REGISTERED')
  }
}

const initialForm: LeadForm = {
  studentName: '',
  guardianName: '',
  phone: '',
  school: '',
  standard: '',
  place: '',
  consent: false,
}

function loadLeads(): LeadRecord[] {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return []
  try {
    return JSON.parse(saved) as LeadRecord[]
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function saveLeads(records: LeadRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function loadFakeCounter(): number {
  const saved = window.localStorage.getItem(FAKE_COUNTER_KEY)
  if (!saved) return 0
  const parsed = Number.parseInt(saved, 10)
  if (Number.isNaN(parsed)) return 0
  return Math.max(0, Math.min(FAKE_COUNTER_MAX, parsed))
}

function saveFakeCounter(value: number) {
  const safe = Math.max(0, Math.min(FAKE_COUNTER_MAX, value))
  window.localStorage.setItem(FAKE_COUNTER_KEY, String(safe))
}

function loadAdminAuth(): boolean {
  return window.localStorage.getItem(ADMIN_AUTH_KEY) === '1'
}

function saveAdminAuth(value: boolean) {
  window.localStorage.setItem(ADMIN_AUTH_KEY, value ? '1' : '0')
}

function loadCpAuth(): boolean {
  return window.localStorage.getItem(CP_AUTH_KEY) === '1'
}

function saveCpAuth(value: boolean) {
  window.localStorage.setItem(CP_AUTH_KEY, value ? '1' : '0')
}

function textOr(value: string | undefined | null, fallback: string): string {
  return value && value.trim() ? value : fallback
}

function decodeEntities(input: string): string {
  return input
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
}

function sanitizeClassText(input: string): string {
  return input
    .replace(/classes?\s*6\s*,\s*7\s*(?:,?\s*and)?\s*8/gi, 'Classes 6 and 7')
    .replace(/class\s*6\s*,\s*7\s*&\s*8/gi, 'Class 6 & 7')
    .replace(/class\s*8/gi, 'Class 7')
    .replace(/8th\s*standard/gi, '7th Standard')
}

function loadSiteConfig(): SiteConfig {
  const saved = window.localStorage.getItem(SITE_CONFIG_KEY)
  if (!saved) return DEFAULT_SITE_CONFIG
  try {
    const parsed = JSON.parse(saved) as Partial<SiteConfig>
    return {
      meta: {
        title: parsed.meta?.title ?? DEFAULT_SITE_CONFIG.meta.title,
        description: sanitizeClassText(parsed.meta?.description ?? DEFAULT_SITE_CONFIG.meta.description),
        keywords: parsed.meta?.keywords ?? DEFAULT_SITE_CONFIG.meta.keywords,
        ogTitle: parsed.meta?.ogTitle ?? DEFAULT_SITE_CONFIG.meta.ogTitle,
        ogDescription: sanitizeClassText(parsed.meta?.ogDescription ?? DEFAULT_SITE_CONFIG.meta.ogDescription),
        ogImage: parsed.meta?.ogImage ?? DEFAULT_SITE_CONFIG.meta.ogImage,
      },
      hero: {
        badge: parsed.hero?.badge ?? DEFAULT_SITE_CONFIG.hero.badge,
        titleMain: parsed.hero?.titleMain ?? DEFAULT_SITE_CONFIG.hero.titleMain,
        titleHighlight: parsed.hero?.titleHighlight ?? DEFAULT_SITE_CONFIG.hero.titleHighlight,
        intro1: sanitizeClassText(parsed.hero?.intro1 ?? DEFAULT_SITE_CONFIG.hero.intro1).replace(/Classes 6 and 7/gi, 'Classes 7 and 8'),
        intro2: parsed.hero?.intro2 ?? DEFAULT_SITE_CONFIG.hero.intro2,
        ctaText: parsed.hero?.ctaText ?? DEFAULT_SITE_CONFIG.hero.ctaText,
      },
      features: [
        sanitizeClassText(parsed.features?.[0] ?? DEFAULT_SITE_CONFIG.features[0]),
        sanitizeClassText(parsed.features?.[1] ?? DEFAULT_SITE_CONFIG.features[1]),
        sanitizeClassText(parsed.features?.[2] ?? DEFAULT_SITE_CONFIG.features[2]).replace(/Kodungallur Campus/gi, 'STATE & CBSE'),
        sanitizeClassText(parsed.features?.[3] ?? DEFAULT_SITE_CONFIG.features[3]).replace(/Class 6\s*&\s*7/gi, 'Class 7 & 8'),
      ],
      giveaway: {
        title: parsed.giveaway?.title ?? DEFAULT_SITE_CONFIG.giveaway.title,
        text: parsed.giveaway?.text ?? DEFAULT_SITE_CONFIG.giveaway.text,
        english: parsed.giveaway?.english ?? DEFAULT_SITE_CONFIG.giveaway.english,
      },
      campaignTitle: parsed.campaignTitle ?? DEFAULT_SITE_CONFIG.campaignTitle,
      form: {
        urgencyText: parsed.form?.urgencyText ?? DEFAULT_SITE_CONFIG.form.urgencyText,
        eyebrow: parsed.form?.eyebrow ?? DEFAULT_SITE_CONFIG.form.eyebrow,
        title: parsed.form?.title ?? DEFAULT_SITE_CONFIG.form.title,
        subtitle: decodeEntities(parsed.form?.subtitle ?? DEFAULT_SITE_CONFIG.form.subtitle),
        studentLabel: parsed.form?.studentLabel ?? DEFAULT_SITE_CONFIG.form.studentLabel,
        studentPlaceholder: parsed.form?.studentPlaceholder ?? DEFAULT_SITE_CONFIG.form.studentPlaceholder,
        guardianLabel: parsed.form?.guardianLabel ?? DEFAULT_SITE_CONFIG.form.guardianLabel,
        guardianPlaceholder: parsed.form?.guardianPlaceholder ?? DEFAULT_SITE_CONFIG.form.guardianPlaceholder,
        phoneLabel: parsed.form?.phoneLabel ?? DEFAULT_SITE_CONFIG.form.phoneLabel,
        phonePlaceholder: parsed.form?.phonePlaceholder ?? DEFAULT_SITE_CONFIG.form.phonePlaceholder,
        standardLabel: parsed.form?.standardLabel ?? DEFAULT_SITE_CONFIG.form.standardLabel,
        standardPlaceholder: parsed.form?.standardPlaceholder ?? DEFAULT_SITE_CONFIG.form.standardPlaceholder,
        standardOptions: [
          sanitizeClassText(parsed.form?.standardOptions?.[0] ?? DEFAULT_SITE_CONFIG.form.standardOptions[0]),
          sanitizeClassText(parsed.form?.standardOptions?.[1] ?? DEFAULT_SITE_CONFIG.form.standardOptions[1]),
        ],
        schoolLabel: parsed.form?.schoolLabel ?? DEFAULT_SITE_CONFIG.form.schoolLabel,
        schoolPlaceholder: parsed.form?.schoolPlaceholder ?? DEFAULT_SITE_CONFIG.form.schoolPlaceholder,
        placeLabel: parsed.form?.placeLabel ?? DEFAULT_SITE_CONFIG.form.placeLabel,
        placePlaceholder: parsed.form?.placePlaceholder ?? DEFAULT_SITE_CONFIG.form.placePlaceholder,
        consentText: parsed.form?.consentText ?? DEFAULT_SITE_CONFIG.form.consentText,
        submitText: parsed.form?.submitText ?? DEFAULT_SITE_CONFIG.form.submitText,
        submittingText: parsed.form?.submittingText ?? DEFAULT_SITE_CONFIG.form.submittingText,
      },
      infoCards: [
        {
          icon: parsed.infoCards?.[0]?.icon ?? DEFAULT_SITE_CONFIG.infoCards[0].icon,
          title: parsed.infoCards?.[0]?.title ?? DEFAULT_SITE_CONFIG.infoCards[0].title,
          text: parsed.infoCards?.[0]?.text ?? DEFAULT_SITE_CONFIG.infoCards[0].text,
        },
        {
          icon: parsed.infoCards?.[1]?.icon ?? DEFAULT_SITE_CONFIG.infoCards[1].icon,
          title: parsed.infoCards?.[1]?.title ?? DEFAULT_SITE_CONFIG.infoCards[1].title,
          text: parsed.infoCards?.[1]?.text ?? DEFAULT_SITE_CONFIG.infoCards[1].text,
        },
        {
          icon: parsed.infoCards?.[2]?.icon ?? DEFAULT_SITE_CONFIG.infoCards[2].icon,
          title: parsed.infoCards?.[2]?.title ?? DEFAULT_SITE_CONFIG.infoCards[2].title,
          text: parsed.infoCards?.[2]?.text ?? DEFAULT_SITE_CONFIG.infoCards[2].text,
        },
        {
          icon: parsed.infoCards?.[3]?.icon ?? DEFAULT_SITE_CONFIG.infoCards[3].icon,
          title: parsed.infoCards?.[3]?.title ?? DEFAULT_SITE_CONFIG.infoCards[3].title,
          text: parsed.infoCards?.[3]?.text ?? DEFAULT_SITE_CONFIG.infoCards[3].text,
        },
      ],
      footerText: parsed.footerText ?? DEFAULT_SITE_CONFIG.footerText,
      images: {
        logo: parsed.images?.logo ?? DEFAULT_SITE_CONFIG.images.logo,
        boy: parsed.images?.boy ?? DEFAULT_SITE_CONFIG.images.boy,
        offer: parsed.images?.offer ?? DEFAULT_SITE_CONFIG.images.offer,
        tab: parsed.images?.tab ?? DEFAULT_SITE_CONFIG.images.tab,
        footer: parsed.images?.footer ?? DEFAULT_SITE_CONFIG.images.footer,
        ads: [
          parsed.images?.ads?.[0] ?? DEFAULT_SITE_CONFIG.images.ads[0],
          parsed.images?.ads?.[1] ?? DEFAULT_SITE_CONFIG.images.ads[1],
          parsed.images?.ads?.[2] ?? DEFAULT_SITE_CONFIG.images.ads[2],
        ],
      },
    }
  } catch {
    window.localStorage.removeItem(SITE_CONFIG_KEY)
    return DEFAULT_SITE_CONFIG
  }
}

function saveSiteConfig(config: SiteConfig) {
  window.localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config))
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function applyMeta(config: SiteConfig) {
  document.title = textOr(config.meta.title, DEFAULT_SITE_CONFIG.meta.title)
  upsertMetaTag('name', 'description', textOr(config.meta.description, DEFAULT_SITE_CONFIG.meta.description))
  upsertMetaTag('name', 'keywords', textOr(config.meta.keywords, DEFAULT_SITE_CONFIG.meta.keywords))
  upsertMetaTag('property', 'og:title', textOr(config.meta.ogTitle, DEFAULT_SITE_CONFIG.meta.ogTitle))
  upsertMetaTag('property', 'og:description', textOr(config.meta.ogDescription, DEFAULT_SITE_CONFIG.meta.ogDescription))
  upsertMetaTag('property', 'og:image', textOr(config.meta.ogImage, DEFAULT_SITE_CONFIG.meta.ogImage))
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2)
  }
  return digits
}

function exportLeadsAsExcel(records: LeadRecord[]) {
  if (!records.length) return false

  const header = ['ID', 'Student Name', 'Guardian Name', 'Phone', 'School', 'Standard', 'Place', 'Consent', 'Submitted At']
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const rows = records.map((r) => [r.id, r.studentName, r.guardianName, r.phone, r.school, r.standard, r.place, r.consent ? 'Yes' : 'No', r.submittedAt])

  let xml = '<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n'
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n'
  xml += '<Worksheet ss:Name="Student Leads"><Table>\n'
  xml += '<Row>' + header.map((h) => `<Cell><Data ss:Type="String">${esc(h)}</Data></Cell>`).join('') + '</Row>\n'
  for (const row of rows) {
    xml += '<Row>' + row.map((c) => `<Cell><Data ss:Type="String">${esc(String(c))}</Data></Cell>`).join('') + '</Row>\n'
  }
  xml += '</Table></Worksheet></Workbook>'

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'student-leads.xls'
  a.click()
  URL.revokeObjectURL(url)
  return true
}

function App() {
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [booting, setBooting] = useState(true)
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => loadAdminAuth())
  const [isCpAuthed, setIsCpAuthed] = useState<boolean>(() => loadCpAuth())
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => loadSiteConfig())

  useEffect(() => { setLeads(loadLeads()) }, [])
  useEffect(() => { saveLeads(leads) }, [leads])
  useEffect(() => { saveAdminAuth(isAdminAuthed) }, [isAdminAuthed])
  useEffect(() => { saveCpAuth(isCpAuthed) }, [isCpAuthed])
  useEffect(() => { saveSiteConfig(siteConfig); applyMeta(siteConfig) }, [siteConfig])
  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 950)
    return () => window.clearTimeout(t)
  }, [])

  const handleLeadSubmit = (form: LeadForm) => {
    const currentLeads = loadLeads()
    const normalizedPhone = normalizePhone(form.phone)
    if (!/^\d{10}$/.test(normalizedPhone)) {
      throw new Error('INVALID_PHONE')
    }
    if (currentLeads.some((lead) => normalizePhone(lead.phone) === normalizedPhone)) {
      throw new DuplicatePhoneError()
    }

    const record: LeadRecord = {
      ...form,
      phone: normalizedPhone,
      id: `WC-${Date.now()}`,
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    }
    const updated = [record, ...currentLeads]
    saveLeads(updated)
    setLeads(updated)
  }

  const handleAdminLogin = (userId: string, password: string) => {
    if (userId === ADMIN_USER_ID && password === ADMIN_PASSWORD) {
      setIsAdminAuthed(true)
      return true
    }
    return false
  }

  const handleAdminLogout = () => {
    setIsAdminAuthed(false)
  }

  const handleCpLogin = (userId: string, password: string) => {
    if (userId === CP_USER_ID && password === CP_PASSWORD) {
      setIsCpAuthed(true)
      return true
    }
    return false
  }

  const handleCpLogout = () => {
    setIsCpAuthed(false)
  }

  return (
    <BrowserRouter>
      {booting && (
        <div className="app-loader" role="status" aria-live="polite" aria-label="Loading">
          <div className="loader-orb" />
          <p>Loading Wings Campus...</p>
        </div>
      )}
      <div className="bg-decor" aria-hidden="true">
        <div className="bg-shape bg-shape-1" />
        <div className="bg-shape bg-shape-2" />
        <div className="bg-shape bg-shape-3" />
      </div>

      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<StudentsPage onSubmitLead={handleLeadSubmit} config={siteConfig} />} />
          <Route
            path="/admin-login"
            element={<AdminLoginPage isAdminAuthed={isAdminAuthed} onLogin={handleAdminLogin} />}
          />
          <Route
            path="/admin"
            element={
              isAdminAuthed
                ? <AdminPage leads={leads} setLeads={setLeads} onLogout={handleAdminLogout} config={siteConfig} />
                : <Navigate to="/admin-login" replace />
            }
          />
          <Route path="/cp-login" element={<ControlPanelLoginPage isCpAuthed={isCpAuthed} onLogin={handleCpLogin} />} />
          <Route
            path="/cp"
            element={
              isCpAuthed
                ? <ControlPanelPage config={siteConfig} setConfig={setSiteConfig} onLogout={handleCpLogout} />
                : <Navigate to="/cp-login" replace />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function AdminLoginPage({
  isAdminAuthed,
  onLogin,
}: {
  isAdminAuthed: boolean
  onLogin: (userId: string, password: string) => boolean
}) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const ok = onLogin(userId.trim(), password)
    if (!ok) setError('Invalid user ID or password.')
  }

  if (isAdminAuthed) {
    return <Navigate to="/admin" replace />
  }

  return (
    <main className="page-shell">
      <section className="admin-login-shell animate-in">
        <div className="form-card admin-login-card">
          <p className="form-eyebrow">Admin Access</p>
          <h1 className="form-title">Sign in to Admin Dashboard</h1>
          <p className="form-subtitle">Use your fixed admin credentials to continue.</p>

          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="adminUserId">User ID</label>
              <input
                id="adminUserId"
                className="form-input"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                autoComplete="username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
            <button className="submit-btn" type="submit">Login</button>
            {error && <p className="form-status error" role="alert">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}

function AdCarousel({ ads, title }: { ads: [string, string, string], title: string }) {
  const adImages = [
    { src: ads[0], alt: 'Wings Campus Ad 1 - NEET/JEE Foundation' },
    { src: ads[1], alt: 'Wings Campus Ad 2 - Expert Coaching' },
    { src: ads[2], alt: 'Wings Campus Ad 3 - Enroll Now' },
  ]
  const [slide, setSlide] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const go = useCallback((i: number) => setSlide((i + 3) % 3), [])

  useEffect(() => {
    timer.current = setInterval(() => setSlide((s) => (s + 1) % 3), 4000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [])

  return (
    <section className="ad-section animate-in animate-in-delay-2" id="ad-section">
      <h2 className="ad-section-title">{title}</h2>

      <div className="ad-carousel">
        <button className="ad-carousel-nav prev" onClick={() => go(slide - 1)} aria-label="Previous">‹</button>
        <button className="ad-carousel-nav next" onClick={() => go(slide + 1)} aria-label="Next">›</button>
        <div className="ad-carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {adImages.map((ad, i) => (
            <div className="ad-carousel-slide" key={i}>
              <SmoothImage src={ad.src} fallbackSrc={DEFAULT_SITE_CONFIG.images.ads[i]} alt={ad.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
      <div className="ad-carousel-dots">
        {adImages.map((_, i) => (
          <button key={i} className={`ad-dot${i === slide ? ' active' : ''}`} onClick={() => go(i)} aria-label={`Ad ${i + 1}`} />
        ))}
      </div>

      <div className="ad-grid">
        {adImages.map((ad, i) => (
          <div className="ad-grid-item" key={i}>
            <SmoothImage src={ad.src} fallbackSrc={DEFAULT_SITE_CONFIG.images.ads[i]} alt={ad.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  )
}

function SmoothImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  loading = 'eager',
}: {
  src: string
  fallbackSrc: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}) {
  const [currentSrc, setCurrentSrc] = useState(textOr(src, fallbackSrc))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCurrentSrc(textOr(src, fallbackSrc))
    setLoaded(false)
  }, [src, fallbackSrc])

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`${className} smooth-image ${loaded ? 'is-loaded' : 'is-loading'}`.trim()}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
          return
        }
        setLoaded(true)
      }}
    />
  )
}

function GiveawayBanner({ spotsLeft, config }: { spotsLeft: number, config: SiteConfig }) {
  const filled = Math.min(GIVEAWAY_LIMIT, GIVEAWAY_LIMIT - spotsLeft)
  const pct = Math.round((filled / GIVEAWAY_LIMIT) * 100)

  return (
    <div className="giveaway-banner animate-in">
      <SmoothImage src={config.images.tab} fallbackSrc={DEFAULT_SITE_CONFIG.images.tab} alt="Tablet prize" className="giveaway-icon-img" />
      <div className="giveaway-content">
        <h2 className="giveaway-title">{textOr(config.giveaway.title, DEFAULT_SITE_CONFIG.giveaway.title)}</h2>
        <p className="giveaway-text" style={{ display: 'none' }}>
          ആദ്യത്തെ <strong>100 രജിസ്ട്രേഷനുകളിൽ</strong> നിന്ന് ഒരു <strong>Lucky Winner</strong> ന് ഒരു <strong>Tablet</strong>.
        </p>
        <p className="giveaway-text">{textOr(config.giveaway.text, DEFAULT_SITE_CONFIG.giveaway.text)}</p>
        <p className="giveaway-english">
          {textOr(config.giveaway.english, DEFAULT_SITE_CONFIG.giveaway.english)}
        </p>
        <div className="giveaway-progress">
          <div className="giveaway-bar">
            <div className="giveaway-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="giveaway-counter">
            <strong>{spotsLeft}</strong> spots left out of {GIVEAWAY_LIMIT}
          </span>
        </div>
      </div>
    </div>
  )
}

function StudentsPage({ onSubmitLead, config }: { onSubmitLead: (form: LeadForm) => void, config: SiteConfig }) {
  const [form, setForm] = useState<LeadForm>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [statusType, setStatusType] = useState<'' | 'success' | 'error'>('')
  const [fakeCounter, setFakeCounter] = useState<number>(() => loadFakeCounter())
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    saveFakeCounter(fakeCounter)
  }, [fakeCounter])

  const spotsLeft = Math.max(1, GIVEAWAY_LIMIT - fakeCounter)
  const urgencyText = config.form.urgencyText.replace('{spotsLeft}', String(spotsLeft))

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false
    if (type !== 'checkbox' && name === 'phone') {
      const sanitized = value.replace(/\D/g, '').slice(0, 10)
      setForm((cur) => ({ ...cur, phone: sanitized }))
      return
    }
    setForm((cur) => ({ ...cur, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setStatusMsg('')
    setStatusType('')
    try {
      onSubmitLead(form)
      setFakeCounter((cur) => Math.min(FAKE_COUNTER_MAX, cur + 1))
      setForm(initialForm)
      setStatusMsg('Details submitted successfully')
      setStatusType('success')
    } catch (err) {
      if (err instanceof DuplicatePhoneError) {
        setStatusMsg('This phone number is already registered.')
      } else if (err instanceof Error && err.message === 'INVALID_PHONE') {
        setStatusMsg('Enter a valid 10-digit phone number.')
      } else {
        setStatusMsg('Submission failed. Please try again.')
      }
      setStatusType('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-section hero-breakout animate-in" id="hero">
        <SmoothImage src={config.images.offer} fallbackSrc={DEFAULT_SITE_CONFIG.images.offer} alt="Special offer" className="hero-offer" />
        <div className="hero-content">
          <div className="top-marquee" aria-label="Admission notice">
            <div className="top-marquee-track">
              <span>✨ നിലവിൽ 6,7 ക്ലാസ്സുകളിൽ പഠിക്കുന്ന കുട്ടികൾക്ക് ഈ പരീക്ഷയിലേക്ക് രജിസ്റ്റർ ചെയ്യാവുന്നതാണ്....</span>
              <span>✨ നിലവിൽ 6,7 ക്ലാസ്സുകളിൽ പഠിക്കുന്ന കുട്ടികൾക്ക് ഈ പരീക്ഷയിലേക്ക് രജിസ്റ്റർ ചെയ്യാവുന്നതാണ്....</span>
            </div>
          </div>
          <div className="hero-layout">
            <div className="hero-boy-wrap">
              <SmoothImage src={config.images.boy} fallbackSrc={DEFAULT_SITE_CONFIG.images.boy} alt="Student" className="hero-boy" />
            </div>
            <div className="hero-main">
              <SmoothImage src={config.images.logo} fallbackSrc={DEFAULT_SITE_CONFIG.images.logo} alt="Wings Campus logo" className="hero-logo" />
              <div className="hero-badge"><span className="emoji">🚀</span> {textOr(config.hero.badge, DEFAULT_SITE_CONFIG.hero.badge)}</div>
              <h1 className="hero-title">{textOr(config.hero.titleMain, DEFAULT_SITE_CONFIG.hero.titleMain)} <span className="highlight">{textOr(config.hero.titleHighlight, DEFAULT_SITE_CONFIG.hero.titleHighlight)}</span></h1>
              <p className="hero-intro">
                {textOr(config.hero.intro1, DEFAULT_SITE_CONFIG.hero.intro1)}
              </p>
              <p className="hero-intro">
                {textOr(config.hero.intro2, DEFAULT_SITE_CONFIG.hero.intro2)}
              </p>
              <div className="hero-features">
                {config.features.map((feature, i) => (
                  <span className="hero-feature-tag" key={i}>{textOr(feature, DEFAULT_SITE_CONFIG.features[i])}</span>
                ))}
              </div>
            </div>
          </div>
          <button className="hero-cta" type="button" onClick={scrollToForm}>
            📝 {textOr(config.hero.ctaText, DEFAULT_SITE_CONFIG.hero.ctaText)}
          </button>
        </div>
      </section>

      <section className="form-hero-section animate-in animate-in-delay-1" id="register" ref={formRef}>
        <GiveawayBanner spotsLeft={spotsLeft} config={config} />

        <div className="form-card form-card-hero">
          <div className="form-header">
            <div className="form-urgency-badge">
              {urgencyText}
            </div>
            <p className="form-eyebrow">{config.form.eyebrow}</p>
            <h2 className="form-title">{config.form.title}</h2>
            <p className="form-subtitle">
              {config.form.subtitle}
            </p>
          </div>

          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="studentName">{config.form.studentLabel}</label>
              <input id="studentName" className="form-input" name="studentName" value={form.studentName} onChange={handleChange}
                placeholder={config.form.studentPlaceholder} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="guardianName">{config.form.guardianLabel}</label>
              <input id="guardianName" className="form-input" name="guardianName" value={form.guardianName} onChange={handleChange}
                placeholder={config.form.guardianPlaceholder} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">{config.form.phoneLabel}</label>
                <input id="phone" className="form-input" name="phone" value={form.phone} onChange={handleChange}
                  placeholder={config.form.phonePlaceholder} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="standard">{config.form.standardLabel}</label>
                <select id="standard" className="form-select" name="standard" value={form.standard} onChange={handleChange} required>
                  <option value="">{config.form.standardPlaceholder}</option>
                  {config.form.standardOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="school">{config.form.schoolLabel}</label>
              <input id="school" className="form-input" name="school" value={form.school} onChange={handleChange}
                placeholder={config.form.schoolPlaceholder} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="place">{config.form.placeLabel}</label>
              <input id="place" className="form-input" name="place" value={form.place} onChange={handleChange}
                placeholder={config.form.placePlaceholder} required />
            </div>

            <div className="consent-row">
              <input id="consent" name="consent" type="checkbox" checked={form.consent} onChange={handleChange} required />
              <span>
                {config.form.consentText}
              </span>
            </div>

            <button className="submit-btn" type="submit" disabled={submitting}>
              {submitting ? config.form.submittingText : config.form.submitText}
            </button>

            {statusMsg && (
              <p className={`form-status ${statusType}`} role="status">{statusMsg}</p>
            )}
          </form>
        </div>

        <div className="info-sidebar">
          <div className="info-box giveaway-highlight animate-in animate-in-delay-2">
            <div className="info-box-icon">{config.infoCards[0].icon}</div>
            <h3>{config.infoCards[0].title}</h3>
            <p>{config.infoCards[0].text}</p>
          </div>
          <div className="info-box animate-in animate-in-delay-3">
            <div className="info-box-icon">{config.infoCards[1].icon}</div>
            <h3>{config.infoCards[1].title}</h3>
            <p>{config.infoCards[1].text}</p>
          </div>
          <div className="info-box animate-in animate-in-delay-4">
            <div className="info-box-icon">{config.infoCards[2].icon}</div>
            <h3>{config.infoCards[2].title}</h3>
            <p>{config.infoCards[2].text}</p>
          </div>
          <div className="info-box animate-in animate-in-delay-4">
            <div className="info-box-icon">{config.infoCards[3].icon}</div>
            <h3>{config.infoCards[3].title}</h3>
            <p>{config.infoCards[3].text}</p>
          </div>
        </div>
      </section>

      <AdCarousel ads={config.images.ads} title={config.campaignTitle} />

      <footer className="page-footer students-footer">
        <p>{textOr(config.footerText, DEFAULT_SITE_CONFIG.footerText)}</p>
      </footer>
    </main>
  )
}

function ControlPanelLoginPage({
  isCpAuthed,
  onLogin,
}: {
  isCpAuthed: boolean
  onLogin: (userId: string, password: string) => boolean
}) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const ok = onLogin(userId.trim(), password)
    if (!ok) setError('Invalid user ID or password.')
  }

  if (isCpAuthed) {
    return <Navigate to="/cp" replace />
  }

  return (
    <main className="page-shell">
      <section className="admin-login-shell animate-in">
        <div className="form-card admin-login-card">
          <p className="form-eyebrow">Control Panel</p>
          <h1 className="form-title">Sign in to C Panel</h1>
          <p className="form-subtitle">Manage content, images, and meta tags without touching code.</p>
          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="cpUserId">User ID</label>
              <input id="cpUserId" className="form-input" value={userId} onChange={(e) => setUserId(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cpPassword">Password</label>
              <input id="cpPassword" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="submit-btn" type="submit">Login</button>
            {error && <p className="form-status error" role="alert">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}

function ControlPanelPage({
  config,
  setConfig,
  onLogout,
}: {
  config: SiteConfig
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>
  onLogout: () => void
}) {
  const [status, setStatus] = useState('All updates are auto-saved.')

  const updateMeta = (key: keyof SiteConfig['meta'], value: string) => {
    setConfig((cur) => ({ ...cur, meta: { ...cur.meta, [key]: value } }))
    setStatus('Updated and saved.')
  }

  const updateHero = (key: keyof SiteConfig['hero'], value: string) => {
    setConfig((cur) => ({ ...cur, hero: { ...cur.hero, [key]: value } }))
    setStatus('Updated and saved.')
  }

  const updateGiveaway = (key: keyof SiteConfig['giveaway'], value: string) => {
    setConfig((cur) => ({ ...cur, giveaway: { ...cur.giveaway, [key]: value } }))
    setStatus('Updated and saved.')
  }

  const updateFeature = (index: 0 | 1 | 2 | 3, value: string) => {
    setConfig((cur) => {
      const features: [string, string, string, string] = [...cur.features] as [string, string, string, string]
      features[index] = value
      return { ...cur, features }
    })
    setStatus('Updated and saved.')
  }

  const updateForm = (key: Exclude<keyof SiteConfig['form'], 'standardOptions'>, value: string) => {
    setConfig((cur) => ({ ...cur, form: { ...cur.form, [key]: value } }))
    setStatus('Updated and saved.')
  }

  const updateFormOption = (index: 0 | 1, value: string) => {
    setConfig((cur) => {
      const standardOptions: [string, string] = [...cur.form.standardOptions] as [string, string]
      standardOptions[index] = value
      return { ...cur, form: { ...cur.form, standardOptions } }
    })
    setStatus('Updated and saved.')
  }

  const updateInfoCard = (index: 0 | 1 | 2 | 3, key: 'icon' | 'title' | 'text', value: string) => {
    setConfig((cur) => {
      const infoCards = [...cur.infoCards] as SiteConfig['infoCards']
      infoCards[index] = { ...infoCards[index], [key]: value }
      return { ...cur, infoCards }
    })
    setStatus('Updated and saved.')
  }

  const updateImage = (key: keyof Omit<SiteConfig['images'], 'ads'>, value: string) => {
    setConfig((cur) => ({ ...cur, images: { ...cur.images, [key]: value } }))
    setStatus('Updated and saved.')
  }

  const updateAdImage = (index: 0 | 1 | 2, value: string) => {
    setConfig((cur) => {
      const ads: [string, string, string] = [...cur.images.ads] as [string, string, string]
      ads[index] = value
      return { ...cur, images: { ...cur.images, ads } }
    })
    setStatus('Updated and saved.')
  }

  const resetDefaults = () => {
    if (!window.confirm('Reset all content, images, and meta tags to defaults?')) return
    setConfig(DEFAULT_SITE_CONFIG)
    setStatus('Reset to defaults.')
  }

  return (
    <main className="page-shell">
      <section className="admin-hero animate-in">
        <p className="form-eyebrow">C Panel</p>
        <h1>Website Content Control Panel</h1>
        <p>Edit text, image URLs, and meta tags instantly.</p>
      </section>

      <section className="cp-toolbar animate-in animate-in-delay-1">
        <button className="btn-export" type="button" onClick={resetDefaults}>Reset Defaults</button>
        <button className="btn-clear" type="button" onClick={onLogout}>Logout</button>
      </section>

      <section className="form-card animate-in animate-in-delay-2 cp-card">
        <h2 className="form-title">Meta Tags</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={config.meta.title} onChange={(e) => updateMeta('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Keywords</label>
            <input className="form-input" value={config.meta.keywords} onChange={(e) => updateMeta('keywords', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input cp-textarea" value={config.meta.description} onChange={(e) => updateMeta('description', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">OG Title</label>
            <input className="form-input" value={config.meta.ogTitle} onChange={(e) => updateMeta('ogTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">OG Image URL</label>
            <input className="form-input" value={config.meta.ogImage} onChange={(e) => updateMeta('ogImage', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">OG Description</label>
          <textarea className="form-input cp-textarea" value={config.meta.ogDescription} onChange={(e) => updateMeta('ogDescription', e.target.value)} />
        </div>
      </section>

      <section className="form-card animate-in animate-in-delay-3 cp-card">
        <h2 className="form-title">Hero Content</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Badge</label>
            <input className="form-input" value={config.hero.badge} onChange={(e) => updateHero('badge', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">CTA Text</label>
            <input className="form-input" value={config.hero.ctaText} onChange={(e) => updateHero('ctaText', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hero Title Main</label>
            <input className="form-input" value={config.hero.titleMain} onChange={(e) => updateHero('titleMain', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Hero Title Highlight</label>
            <input className="form-input" value={config.hero.titleHighlight} onChange={(e) => updateHero('titleHighlight', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Intro Line 1</label>
          <textarea className="form-input cp-textarea" value={config.hero.intro1} onChange={(e) => updateHero('intro1', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Intro Line 2</label>
          <textarea className="form-input cp-textarea" value={config.hero.intro2} onChange={(e) => updateHero('intro2', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Campaign Section Title</label>
            <input className="form-input" value={config.campaignTitle} onChange={(e) => setConfig((cur) => ({ ...cur, campaignTitle: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Footer Text</label>
            <input className="form-input" value={config.footerText} onChange={(e) => setConfig((cur) => ({ ...cur, footerText: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Feature Tag 1</label><input className="form-input" value={config.features[0]} onChange={(e) => updateFeature(0, e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Feature Tag 2</label><input className="form-input" value={config.features[1]} onChange={(e) => updateFeature(1, e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Feature Tag 3</label><input className="form-input" value={config.features[2]} onChange={(e) => updateFeature(2, e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Feature Tag 4</label><input className="form-input" value={config.features[3]} onChange={(e) => updateFeature(3, e.target.value)} /></div>
        </div>
      </section>

      <section className="form-card animate-in animate-in-delay-4 cp-card">
        <h2 className="form-title">Form + Dropdown Settings</h2>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Urgency Text (use {'{spotsLeft}'})</label><input className="form-input" value={config.form.urgencyText} onChange={(e) => updateForm('urgencyText', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Form Eyebrow</label><input className="form-input" value={config.form.eyebrow} onChange={(e) => updateForm('eyebrow', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Form Title</label><input className="form-input" value={config.form.title} onChange={(e) => updateForm('title', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Submit Text</label><input className="form-input" value={config.form.submitText} onChange={(e) => updateForm('submitText', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Submitting Text</label><input className="form-input" value={config.form.submittingText} onChange={(e) => updateForm('submittingText', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Select Placeholder</label><input className="form-input" value={config.form.standardPlaceholder} onChange={(e) => updateForm('standardPlaceholder', e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="form-label">Form Subtitle</label><textarea className="form-input cp-textarea" value={config.form.subtitle} onChange={(e) => updateForm('subtitle', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Consent Text</label><textarea className="form-input cp-textarea" value={config.form.consentText} onChange={(e) => updateForm('consentText', e.target.value)} /></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Student Placeholder</label><input className="form-input" value={config.form.studentPlaceholder} onChange={(e) => updateForm('studentPlaceholder', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Guardian Placeholder</label><input className="form-input" value={config.form.guardianPlaceholder} onChange={(e) => updateForm('guardianPlaceholder', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Student Label</label><input className="form-input" value={config.form.studentLabel} onChange={(e) => updateForm('studentLabel', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Guardian Label</label><input className="form-input" value={config.form.guardianLabel} onChange={(e) => updateForm('guardianLabel', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Phone Placeholder</label><input className="form-input" value={config.form.phonePlaceholder} onChange={(e) => updateForm('phonePlaceholder', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">School Placeholder</label><input className="form-input" value={config.form.schoolPlaceholder} onChange={(e) => updateForm('schoolPlaceholder', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Phone Label</label><input className="form-input" value={config.form.phoneLabel} onChange={(e) => updateForm('phoneLabel', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Standard Label</label><input className="form-input" value={config.form.standardLabel} onChange={(e) => updateForm('standardLabel', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Place Placeholder</label><input className="form-input" value={config.form.placePlaceholder} onChange={(e) => updateForm('placePlaceholder', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Dropdown Option 1</label><input className="form-input" value={config.form.standardOptions[0]} onChange={(e) => updateFormOption(0, e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">School Label</label><input className="form-input" value={config.form.schoolLabel} onChange={(e) => updateForm('schoolLabel', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Place Label</label><input className="form-input" value={config.form.placeLabel} onChange={(e) => updateForm('placeLabel', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Dropdown Option 2</label><input className="form-input" value={config.form.standardOptions[1]} onChange={(e) => updateFormOption(1, e.target.value)} /></div>
        </div>
      </section>

      <section className="form-card animate-in animate-in-delay-4 cp-card">
        <h2 className="form-title">Giveaway + Images</h2>
        <div className="form-group">
          <label className="form-label">Giveaway Title</label>
          <input className="form-input" value={config.giveaway.title} onChange={(e) => updateGiveaway('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Giveaway Text</label>
          <textarea className="form-input cp-textarea" value={config.giveaway.text} onChange={(e) => updateGiveaway('text', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Giveaway English Text</label>
          <textarea className="form-input cp-textarea" value={config.giveaway.english} onChange={(e) => updateGiveaway('english', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Logo URL</label><input className="form-input" value={config.images.logo} onChange={(e) => updateImage('logo', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Boy URL</label><input className="form-input" value={config.images.boy} onChange={(e) => updateImage('boy', e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Offer URL</label><input className="form-input" value={config.images.offer} onChange={(e) => updateImage('offer', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Tablet URL</label><input className="form-input" value={config.images.tab} onChange={(e) => updateImage('tab', e.target.value)} /></div>
        </div>
        <div className="form-group">
          <label className="form-label">Footer Image URL</label>
          <input className="form-input" value={config.images.footer} onChange={(e) => updateImage('footer', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Ad Image 1 URL</label><input className="form-input" value={config.images.ads[0]} onChange={(e) => updateAdImage(0, e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Ad Image 2 URL</label><input className="form-input" value={config.images.ads[1]} onChange={(e) => updateAdImage(1, e.target.value)} /></div>
        </div>
        <div className="form-group">
          <label className="form-label">Ad Image 3 URL</label>
          <input className="form-input" value={config.images.ads[2]} onChange={(e) => updateAdImage(2, e.target.value)} />
        </div>
      </section>

      <section className="form-card animate-in animate-in-delay-4 cp-card">
        <h2 className="form-title">Info Cards (Right Side)</h2>
        {config.infoCards.map((card, i) => (
          <div className="cp-inline-card" key={i}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Card {i + 1} Icon</label>
                <input className="form-input" value={card.icon} onChange={(e) => updateInfoCard(i as 0 | 1 | 2 | 3, 'icon', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Card {i + 1} Title</label>
                <input className="form-input" value={card.title} onChange={(e) => updateInfoCard(i as 0 | 1 | 2 | 3, 'title', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Card {i + 1} Text</label>
              <textarea className="form-input cp-textarea" value={card.text} onChange={(e) => updateInfoCard(i as 0 | 1 | 2 | 3, 'text', e.target.value)} />
            </div>
          </div>
        ))}
        <p className="form-status success">{status}</p>
      </section>
    </main>
  )
}

function AdminPage({
  leads,
  setLeads,
  onLogout,
  config,
}: {
  leads: LeadRecord[]
  setLeads: React.Dispatch<React.SetStateAction<LeadRecord[]>>
  onLogout: () => void
  config: SiteConfig
}) {
  const [status, setStatus] = useState('')

  const clearLeads = () => {
    if (!window.confirm('Are you sure you want to clear all student data?')) return
    setLeads([])
    setStatus('All local student data cleared.')
  }

  const handleExport = () => {
    if (!exportLeadsAsExcel(leads)) {
      setStatus('No student data available for export.')
      return
    }
    setStatus('Student data exported as Excel file.')
  }

  return (
    <main className="page-shell">
      <section className="admin-hero animate-in">
        <p className="form-eyebrow">Admin Dashboard</p>
        <h1>Student Registrations</h1>
        <p>View and export all student details collected from the campaign landing page.</p>
        <button className="btn-clear admin-logout-btn" type="button" onClick={onLogout}>Logout</button>
      </section>

      <section className="admin-toolbar animate-in animate-in-delay-1">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <strong>{leads.length}</strong>
            <span>Total Registrations</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div>
            <strong>{Math.max(0, GIVEAWAY_LIMIT - leads.length)}</strong>
            <span>Giveaway Spots Left</span>
          </div>
        </div>
        <div className="toolbar-actions">
          <button className="btn-export" type="button" onClick={handleExport}>📥 Export as Excel</button>
          <button className="btn-clear" type="button" onClick={clearLeads}>🗑️ Clear All Data</button>
        </div>
      </section>

      <section className="table-card animate-in animate-in-delay-2">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Guardian</th>
                <th>Phone</th>
                <th>School</th>
                <th>Standard</th>
                <th>Place</th>
                <th>Consent</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {leads.length ? (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.studentName}</td>
                    <td>{lead.guardianName}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.school}</td>
                    <td>{lead.standard}</td>
                    <td>{lead.place}</td>
                    <td>{lead.consent ? '✅ Yes' : '❌ No'}</td>
                    <td>{lead.submittedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="empty-state">
                    No student registrations yet. Share the link via Meta ads to start collecting data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {status && <p className="admin-status">{status}</p>}
      </section>

      <footer className="page-footer">
        <a href="https://www.nexston.in" target="_blank" rel="noopener noreferrer" aria-label="Visit Nexston">
          <SmoothImage src={config.images.footer} fallbackSrc={DEFAULT_SITE_CONFIG.images.footer} alt="Wings Campus footer visual" className="admin-footer-image" />
        </a>
      </footer>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
