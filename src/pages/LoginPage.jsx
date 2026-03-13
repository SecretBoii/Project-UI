import { useState } from 'react'
import { Frame, Btn, InputGroup, toast } from '../components/UI'
import { ui } from '../components/UI'
import s from './LoginPage.module.css'

export default function LoginPage({ onNavigate }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (!username || !password) { toast('⚠️ กรุณากรอก Username และ Password'); return }
    toast(`✅ เข้าสู่ระบบสำเร็จ — ยินดีต้อนรับ ${username}`)
  }

  return (
    <Frame url="pylearn.app/login">
      <div className={s.wrap}>
        <div className={s.box}>
          <div className={s.logo}>
            <div className={s.logoIcon}>🐍</div>
            <div className={s.logoTitle}>PyLearn</div>
            <div className={s.logoSub}>ระบบฝึกหัด Python ออนไลน์</div>
          </div>

          <InputGroup label="Username" required>
            <input className={ui.inp} placeholder="กรอก username..." value={username} onChange={e => setUsername(e.target.value)} />
          </InputGroup>
          <InputGroup label="Password" required>
            <input className={ui.inp} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </InputGroup>

          <Btn variant="primary" full onClick={handleLogin}>เข้าสู่ระบบ</Btn>
          <div className={s.gap} />
          <Btn variant="secondary" full onClick={() => onNavigate('register')}>สมัครสมาชิก →</Btn>

          <div className={s.demoSection}>
            <div className={s.demoLabel}>Demo accounts</div>
            {[
              { label:'🔵 Admin',   user:'admin_สมชาย',  page:'admin'   },
              { label:'🟢 Teacher', user:'teacher_วิภา', page:'teacher' },
              { label:'🟡 Student', user:'student_ธนา',  page:'student' },
            ].map(d => (
              <button key={d.page} className={s.demoBtn}
                onClick={() => { toast(`🔐 Login as ${d.user}`); setTimeout(() => onNavigate(d.page), 400) }}>
                <span>{d.label}</span>
                <span className={s.demoBtnUser}>{d.user}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  )
}
