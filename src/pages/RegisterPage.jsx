import { useState } from 'react'
import { Frame, Btn, InputGroup, toast } from '../components/UI'
import { ui } from '../components/UI'
import s from './RegisterPage.module.css'

const PSU_FACULTIES = [
  { fac:'วิทยาศาสตร์', majors:['วิทยาการคอมพิวเตอร์','เทคโนโลยีสารสนเทศและการสื่อสาร','คณิตศาสตร์','สถิติ','ฟิสิกส์','เคมี','ชีววิทยา'] },
  { fac:'วิศวกรรมศาสตร์', majors:['วิศวกรรมคอมพิวเตอร์','วิศวกรรมไฟฟ้า','วิศวกรรมเครื่องกล','วิศวกรรมโยธา','วิศวกรรมเคมี'] },
  { fac:'เทคโนโลยีและสิ่งแวดล้อม', majors:['เทคโนโลยีสารสนเทศ','วิทยาศาสตร์และเทคโนโลยีสิ่งแวดล้อม'] },
  { fac:'การจัดการ', majors:['ระบบสารสนเทศเพื่อการจัดการ','บริหารธุรกิจ','การบัญชี'] },
  { fac:'ศิลปศาสตร์', majors:['ภาษาอังกฤษ','ภาษาไทย','การพัฒนาสังคม'] },
]

export default function RegisterPage({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [f, setF] = useState({ username:'', password:'', confirm:'', gender:'', dob:'', faculty:'', major:'' })
  const set = (k,v) => setF(p => ({ ...p, [k]:v }))
  const facObj = PSU_FACULTIES.find(x => x.fac === f.faculty)

  const next = () => {
    if (step === 1) {
      if (!f.username)              { toast('⚠️ กรุณากรอก Username'); return }
      if (f.password.length < 8)    { toast('⚠️ Password ต้องมีอย่างน้อย 8 ตัวอักษร'); return }
      if (f.password !== f.confirm) { toast('⚠️ Password ไม่ตรงกัน'); return }
    }
    if (step === 2) {
      if (!f.gender) { toast('⚠️ กรุณาเลือกเพศ'); return }
      if (!f.dob)    { toast('⚠️ กรุณากรอกวันเกิด'); return }
    }
    setStep(p => p + 1)
  }

  const register = () => {
    if (!f.faculty || !f.major) { toast('⚠️ กรุณาเลือกคณะและสาขา'); return }
    toast('✅ สมัครสมาชิกสำเร็จ')
    setTimeout(() => onNavigate('login'), 800)
  }

  const Dot = ({ n }) => (
    <div className={[s.stepDot, n === step && s.stepDotActive, n < step && s.stepDotDone].filter(Boolean).join(' ')}>
      {n < step ? '✓' : n}
    </div>
  )

  return (
    <Frame url="pylearn.app/register">
      <div className={s.wrap}>
        <div className={s.box}>
          <div className={s.header}>
            <div className={s.headerIcon}>✨</div>
            <div className={s.headerTitle}>สมัครสมาชิก PyLearn</div>
            <div className={s.headerSub}>มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่</div>
          </div>

          <div className={s.steps}>
            {['บัญชี','ข้อมูล','การศึกษา'].map((label, i) => (
              <div key={i} className={[s.stepWrap, i < step - 1 && s.stepWrapDone].filter(Boolean).join(' ')}>
                <Dot n={i+1} />
                <span className={s.stepLabel}>{label}</span>
              </div>
            ))}
          </div>

          {step === 1 && <>
            <InputGroup label="Username" required><input className={ui.inp} placeholder="username..." value={f.username} onChange={e=>set('username',e.target.value)}/></InputGroup>
            <InputGroup label="Password" required><input className={ui.inp} type="password" placeholder="อย่างน้อย 8 ตัวอักษร" value={f.password} onChange={e=>set('password',e.target.value)}/></InputGroup>
            <InputGroup label="Confirm Password" required><input className={ui.inp} type="password" placeholder="ยืนยัน password" value={f.confirm} onChange={e=>set('confirm',e.target.value)}/></InputGroup>
          </>}

          {step === 2 && <>
            <InputGroup label="เพศ" required>
              <select className={ui.inp} value={f.gender} onChange={e=>set('gender',e.target.value)}>
                <option value="">-- เลือก --</option>
                <option value="Male">Male — ชาย</option>
                <option value="Female">Female — หญิง</option>
                <option value="Other">Other — อื่นๆ</option>
              </select>
            </InputGroup>
            <InputGroup label="วันเกิด" required>
              <input className={ui.inp} type="date" value={f.dob} onChange={e=>set('dob',e.target.value)}/>
            </InputGroup>
          </>}

          {step === 3 && <>
            <div className={s.uniTag}>🏫 มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่</div>
            <InputGroup label="คณะ" required>
              <select className={ui.inp} value={f.faculty} onChange={e=>{ set('faculty',e.target.value); set('major','') }}>
                <option value="">-- เลือกคณะ --</option>
                {PSU_FACULTIES.map(x=><option key={x.fac} value={x.fac}>{x.fac}</option>)}
              </select>
            </InputGroup>
            <InputGroup label="สาขาวิชา" required>
              <select className={ui.inp} value={f.major} onChange={e=>set('major',e.target.value)} disabled={!f.faculty}>
                <option value="">-- เลือกสาขา --</option>
                {(facObj?.majors||[]).map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </InputGroup>
          </>}

          <div className={s.btnRow}>
            {step > 1 && <Btn variant="secondary" full onClick={() => setStep(p=>p-1)}>← ย้อนกลับ</Btn>}
            {step < 3  ? <Btn variant="primary" full onClick={next}>ถัดไป →</Btn>
                       : <Btn variant="primary" full onClick={register}>✅ สมัครสมาชิก</Btn>}
          </div>

          <div className={s.footer}>
            มีบัญชีแล้ว? <button className={s.link} onClick={() => onNavigate('login')}>เข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    </Frame>
  )
}
