import { createContext, useContext, useState, useCallback } from 'react'

const INITIAL_REQUESTS = [
  { id:'RR-005', userId:3, username:'student_ธนา',    avatar:'ธ', uni:'ม.อ. · วิทยาศาสตร์ · CS · EDU001', from:'ROLE03', to:'ROLE02', toLabel:'ROLE02 Teacher', reason:'ฉันเป็นอาจารย์สอนวิชา Programming ต้องการสร้างโจทย์ให้นักศึกษาในคลาส Python 101', submitted:'09/03/68 11:24', status:'pending' },
  { id:'RR-004', userId:4, username:'student_มินตรา', avatar:'ม', uni:'ม.อ. · วิศวกรรม · CE · EDU001',     from:'ROLE03', to:'ROLE02', toLabel:'ROLE02 Teacher', reason:'TA ของวิชา Data Structure ต้องการสร้างชุดโจทย์สำหรับนักศึกษาชั้นปีที่ 2', submitted:'08/03/68 15:10', status:'pending' },
  { id:'RR-003', userId:7, username:'student_เอก',    avatar:'เ', uni:'ม.อ. · วิทยาศาสตร์ · IT · EDU001',  from:'ROLE03', to:'ROLE01', toLabel:'ROLE01 Admin',   reason:'ต้องการเข้าถึงระบบทั้งหมดเพื่อช่วยดูแลระบบ', submitted:'07/03/68 09:05', status:'pending' },
]
const INITIAL_HISTORY = [
  { id:'RR-002', username:'teacher_วิภา',  from:'ROLE03', to:'ROLE02', status:'approved', reviewedBy:'admin_สมชาย', reviewedAt:'11/01/67' },
  { id:'RR-001', username:'student_ปิ่น', from:'ROLE03', to:'ROLE01', status:'rejected', reviewedBy:'admin_สมชาย', reviewedAt:'05/01/67' },
]

const Ctx = createContext(null)

export function RoleRequestProvider({ children }) {
  const [requests, setRequests]       = useState(INITIAL_REQUESTS)
  const [history,  setHistory]        = useState(INITIAL_HISTORY)
  const [student3Role, setS3Role]     = useState('ROLE03')
  const [pendingBanner, setBanner]    = useState(null)

  const pendingAll     = requests.filter(r => r.status === 'pending')
  const pendingTeacher = requests.filter(r => r.status === 'pending' && r.to === 'ROLE02')

  const submitRequest = useCallback((role, reason) => {
    const newId = 'RR-00' + (6 + requests.length)
    const now = new Date()
    const d = now.toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit'})
    const t = now.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})
    const req = { id:newId, userId:3, username:'student_ธนา', avatar:'ธ', uni:'ม.อ. · วิทยาศาสตร์ · CS · EDU001', from:'ROLE03', to:role, toLabel:role==='ROLE02'?'ROLE02 Teacher':'ROLE01 Admin', reason, submitted:`${d} ${t}`, status:'pending' }
    setRequests(p => [...p, req])
    setBanner(req)
    return newId
  }, [requests.length])

  const approveRequest = useCallback((id, reviewer) => {
    const req = requests.find(r => r.id === id); if (!req) return
    const d = new Date().toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit'})
    const done = { ...req, status:'approved', reviewedBy:reviewer, reviewedAt:d }
    setRequests(p => p.map(r => r.id===id ? done : r))
    setHistory(p => [done, ...p])
    if (req.userId === 3) { setS3Role(req.to); setBanner({ ...done, approved:true }) }
  }, [requests])

  const rejectRequest = useCallback((id, reviewer) => {
    const req = requests.find(r => r.id === id); if (!req) return
    const d = new Date().toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit'})
    const done = { ...req, status:'rejected', reviewedBy:reviewer, reviewedAt:d }
    setRequests(p => p.map(r => r.id===id ? done : r))
    setHistory(p => [done, ...p])
  }, [requests])

  return (
    <Ctx.Provider value={{ requests, history, pendingAll, pendingTeacher, student3Role, pendingBanner, submitRequest, approveRequest, rejectRequest }}>
      {children}
    </Ctx.Provider>
  )
}

export const useRoleRequest = () => useContext(Ctx)
