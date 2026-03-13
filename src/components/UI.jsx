import { useEffect, useState, useCallback } from 'react'
import s from './UI.module.css'

/* ══ Toast ══════════════════════════════════════ */
let _toastTimer = null
let _setMsg = null

export function ToastProvider() {
  const [msg, setMsg]   = useState('')
  const [show, setShow] = useState(false)
  _setMsg = useCallback((m) => {
    setMsg(m); setShow(true)
    clearTimeout(_toastTimer)
    _toastTimer = setTimeout(() => setShow(false), 2500)
  }, [])
  return <div className={`toast-el${show ? ' show' : ''}`}>{msg}</div>
}
export const toast = (m) => _setMsg?.(m)

/* ══ Modal ══════════════════════════════════════ */
export function Modal({ open, onClose, children, width = 480 }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className={s.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modalBox} style={{ width }}>
        {children}
      </div>
    </div>
  )
}

/* ══ Button ══════════════════════════════════════ */
export function Btn({ variant = 'primary', size, full, onClick, children, style }) {
  const variantCls = { primary: s.btnPrimary, secondary: s.btnSecondary, green: s.btnGreen, red: s.btnRed }
  const sizeCls    = { sm: s.btnSm, xs: s.btnXs }
  return (
    <button
      className={[s.btn, variantCls[variant], size && sizeCls[size], full && s.btnFull].filter(Boolean).join(' ')}
      onClick={onClick}
      style={style}
    >{children}</button>
  )
}

/* ══ Badge ═══════════════════════════════════════ */
export function RoleBadge({ role }) {
  if (role === 'ROLE01') return <span className={`${s.badge} ${s.badgeBlue}`}>ROLE01 Admin</span>
  if (role === 'ROLE02') return <span className={`${s.badge} ${s.badgeGreen}`}>ROLE02 Teacher</span>
  return <span className={`${s.badge} ${s.badgeYellow}`}>ROLE03 User</span>
}
export function StatusPill({ status }) {
  if (status === 'approved') return <span className={`${s.badge} ${s.badgeGreen}`}>✅ approved</span>
  if (status === 'rejected') return <span className={`${s.badge} ${s.badgeRed}`}>❌ rejected</span>
  return <span className={`${s.badge} ${s.badgeYellow}`}>⏳ pending</span>
}
export function Badge({ children, variant = 'gray' }) {
  const map = { blue: s.badgeBlue, green: s.badgeGreen, yellow: s.badgeYellow, red: s.badgeRed, gray: s.badgeGray }
  return <span className={`${s.badge} ${map[variant]}`}>{children}</span>
}

/* ══ Input group ════════════════════════════════ */
export function InputGroup({ label, required, children }) {
  return (
    <div className={s.inpGroup}>
      <label className={s.inpLabel}>{label}{required && <span className={s.req}>*</span>}</label>
      {children}
    </div>
  )
}

/* ══ Avatar ══════════════════════════════════════ */
export function Avatar({ letter, bg = '#eef1fe', color = '#4f6ef7', size = 32 }) {
  return (
    <div className={s.avatar} style={{ width: size, height: size, background: bg, color, fontSize: size * .44 }}>
      {letter}
    </div>
  )
}

/* ══ Stat card ═══════════════════════════════════ */
export function StatCard({ icon, title, value, sub, subColor, onClick }) {
  return (
    <div className={`${s.statCard}${onClick ? ' ' + s.clickable : ''}`} onClick={onClick}>
      <div className={s.statIcon}>{icon}</div>
      <div className={s.statTitle}>{title}</div>
      <div className={s.statValue} style={subColor ? { color: subColor } : {}}>{value}</div>
      <div className={s.statSub} style={subColor ? { color: subColor } : {}}>{sub}</div>
    </div>
  )
}

/* ══ Section header ══════════════════════════════ */
export function SecH({ children }) {
  return <div className={s.secH}>{children}</div>
}

/* ══ Topbar ══════════════════════════════════════ */
export function Topbar({ title, right }) {
  return (
    <div className={s.topbar}>
      <span className={s.topbarTitle}>{title}</span>
      <div className={s.topbarRight}>{right}</div>
    </div>
  )
}

/* ══ Browser frame ═══════════════════════════════ */
export function Frame({ url, children }) {
  return (
    <div className={s.frame}>
      <div className={s.frameBar}>
        <div className={`${s.dot} ${s.dotR}`} />
        <div className={`${s.dot} ${s.dotY}`} />
        <div className={`${s.dot} ${s.dotG}`} />
        <div className={s.urlBar}>{url}</div>
      </div>
      {children}
    </div>
  )
}

/* ══ Sidebar ═════════════════════════════════════ */
export function Sidebar({ roleName, roleColor, tabs, activeTab, onTabChange, bottom }) {
  return (
    <div className={s.sidebar}>
      <div className={s.sidebarLogo}>
        <div className={s.sidebarLogoName}>🐍 PyLearn</div>
        <div className={s.sidebarRole} style={{ color: roleColor }}>{roleName}</div>
      </div>
      {tabs.map(t => (
        <button
          key={t.id}
          className={[s.sItem, activeTab === t.id && s.sItemActive, t.danger && s.sItemDanger].filter(Boolean).join(' ')}
          onClick={() => onTabChange(t.id)}
          style={t.danger ? { color: 'var(--red)', marginTop: 'auto' } : {}}
        >
          {t.label}
          {t.badge > 0 && <span className={s.sItemBadge}>{t.badge}</span>}
        </button>
      ))}
      {bottom && <div className={s.sidebarBottom}>{bottom}</div>}
    </div>
  )
}

/* ══ Table ═══════════════════════════════════════ */
export { s as ui }
