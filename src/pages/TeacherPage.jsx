import { useState } from 'react'
import { Frame, Topbar, Sidebar, Avatar, SecH, StatCard, Btn, InputGroup, toast } from '../components/UI'
import { ui } from '../components/UI'
import s from './DashboardShell.module.css'

const BLOOM = {
  1: { label:'Lv.1 Remember',   th:'ความจำพื้นฐาน',          color:'#0369a1', bg:'#e0f2fe', border:'#bae6fd' },
  2: { label:'Lv.2 Understand', th:'ความเข้าใจและการตีความ',  color:'#065f46', bg:'#d1fae5', border:'#6ee7b7' },
  3: { label:'Lv.3 Apply',      th:'การนำไปประยุกต์ใช้',     color:'#92400e', bg:'#fef3c7', border:'#fcd34d' },
  4: { label:'Lv.4 Analyse',    th:'การวิเคราะห์และตรวจสอบ', color:'#6d28d9', bg:'#ede9fe', border:'#c4b5fd' },
  5: { label:'Lv.5 Create',     th:'การออกแบบและสร้างสรรค์', color:'#9f1239', bg:'#ffe4e6', border:'#fda4af' },
}

const INIT_EX = [
  { id:1,  title:'ประกาศตัวแปรและแสดงผล',
    topic:'Variables, Data types, Syntax', skill:'Variables, Print',
    diff:1, time:5, avgTime:3, type:'code', status:'active',
    description:'จงประกาศตัวแปรชื่อ x เก็บค่าเลขจำนวนเต็ม 10 และตัวแปรชื่อ y เก็บค่าข้อความ \'Python\' จากนั้นแสดงผลออกมาทีละบรรทัด',
    hint:'ใช้ print() ในการแสดงผล และ = ในการกำหนดค่าตัวแปร' },
  { id:2,  title:'ชนิดข้อมูลพื้นฐาน',
    topic:'Data types, Syntax', skill:'int, str, float, bool',
    diff:1, time:5, avgTime:3, type:'code', status:'active',
    description:'จงประกาศตัวแปร 4 ตัว ชนิด int, float, str, bool แล้วใช้ type() แสดงชนิดของแต่ละตัวแปร',
    hint:'ใช้ print(type(x)) เพื่อดูชนิดข้อมูล' },
  { id:3,  title:'การใช้ Print พื้นฐาน',
    topic:'Syntax, Print', skill:'Print, String',
    diff:1, time:5, avgTime:3, type:'code', status:'active',
    description:'จงเขียนโปรแกรมแสดงข้อความ "Hello, World!" และ "ยินดีต้อนรับสู่ Python" ออกทางหน้าจอ',
    hint:'ใช้ print("ข้อความ")' },
  { id:4,  title:'รับค่าและทักทายผู้ใช้',
    topic:'input(), Casting, Print format', skill:'input, print, f-string',
    diff:2, time:10, avgTime:8, type:'code', status:'active',
    description:'จงเขียนโปรแกรมรับค่าชื่อจากผู้ใช้ผ่านคีย์บอร์ด แล้วแสดงข้อความว่า "Hello, " ตามด้วยชื่อนั้นออกทางหน้าจอ',
    hint:'ใช้ input() รับค่า และ f-string หรือ + เชื่อมข้อความ' },
  { id:5,  title:'แปลงชนิดข้อมูลและบวกเลข',
    topic:'Casting, input()', skill:'int(), float(), input',
    diff:2, time:10, avgTime:8, type:'code', status:'active',
    description:'จงเขียนโปรแกรมรับตัวเลข 2 ค่าจากผู้ใช้ แล้วแสดงผลรวมของตัวเลขทั้งสอง (ต้องแปลงชนิดข้อมูลก่อน)',
    hint:'input() คืนค่าเป็น str เสมอ ต้องใช้ int() หรือ float() แปลงก่อนบวก' },
  { id:6,  title:'จัดรูปแบบการแสดงผล',
    topic:'Print format', skill:'f-string, format()',
    diff:2, time:10, avgTime:8, type:'code', status:'active',
    description:'จงเขียนโปรแกรมรับชื่อและอายุ แล้วแสดงผลในรูปแบบ "ชื่อ: [ชื่อ], อายุ: [อายุ] ปี"',
    hint:'ใช้ f"ชื่อ: {name}, อายุ: {age} ปี"' },
  { id:7,  title:'ตรวจสอบผลการสอบ',
    topic:'Expressions, Operators, if-else', skill:'if-else, comparison',
    diff:3, time:15, avgTime:13, type:'code', status:'active',
    description:'จงเขียนโปรแกรมรับคะแนน (0-100) หากคะแนนมากกว่าหรือเท่ากับ 50 ให้แสดง "Pass" หากต่ำกว่านั้นให้แสดง "Fail"',
    hint:'ใช้ if score >= 50: และ else:' },
  { id:8,  title:'เกรดนักเรียน',
    topic:'if-elif-else, Operators', skill:'if-elif-else, comparison',
    diff:3, time:15, avgTime:13, type:'code', status:'active',
    description:'จงเขียนโปรแกรมรับคะแนน แล้วแสดงเกรด A(80+), B(70+), C(60+), D(50+), F(<50)',
    hint:'ใช้ if-elif-elif-elif-else ตรวจสอบเป็นลำดับ' },
  { id:9,  title:'คำนวณค่าจ้าง',
    topic:'Expressions, Operators', skill:'arithmetic, if-else',
    diff:3, time:15, avgTime:13, type:'code', status:'active',
    description:'จงเขียนโปรแกรมคำนวณค่าจ้าง รับชั่วโมงทำงาน ถ้าไม่เกิน 40 ชม. คิด 100 บาท/ชม. ถ้าเกิน คิด 1.5 เท่า',
    hint:'แยก OT ออกมา: ot_hours = hours - 40 แล้วคำนวณแยก' },
  { id:10, title:'ผลรวมใน List ด้วย Loop',
    topic:'Loops, Lists, Debugging', skill:'for loop, list, accumulator',
    diff:4, time:20, avgTime:18, type:'code', status:'active',
    description:'กำหนด List numbers = [5, 2, 9, 1] จงเขียนโปรแกรมวนลูปหาผลรวมของตัวเลขทั้งหมดใน List โดยห้ามใช้ฟังก์ชัน sum() สำเร็จรูป',
    hint:'สร้างตัวแปร total = 0 แล้ววนลูป total += n ทุกรอบ' },
  { id:11, title:'หาค่าสูงสุดและต่ำสุด',
    topic:'Loops, Lists', skill:'for loop, if, min, max logic',
    diff:4, time:20, avgTime:18, type:'code', status:'active',
    description:'จงเขียนโปรแกรมรับตัวเลข 5 ค่าจากผู้ใช้ เก็บลง List แล้ววนลูปหาค่าสูงสุดและต่ำสุดโดยไม่ใช้ min() max()',
    hint:'กำหนด max_val = list[0] แล้วเปรียบเทียบทุกตัว ทำเหมือนกันกับ min_val' },
  { id:12, title:'ตรวจสอบจำนวนเฉพาะ',
    topic:'Loops, Debugging', skill:'for loop, if, modulo',
    diff:4, time:25, avgTime:23, type:'code', status:'active',
    description:'จงเขียนโปรแกรมรับจำนวนเต็มบวก แล้วตรวจสอบว่าเป็นจำนวนเฉพาะหรือไม่ แสดงผล "Prime" หรือ "Not Prime"',
    hint:'วนลูปจาก 2 ถึง sqrt(n) ถ้า n % i == 0 คือไม่ใช่จำนวนเฉพาะ' },
  { id:13, title:'แปลงเวลา 12 ชม. เป็น 24 ชม.',
    topic:'Functions, Multiple Algorithms', skill:'function, string, logic',
    diff:5, time:30, avgTime:28, type:'code', status:'active',
    description:'จงเขียนฟังก์ชัน time_convert(h, m, am_pm) รับเวลาแบบ 12 ชม. แล้วคืนค่าเป็น string รูปแบบ 24 ชม. เช่น time_convert(2, 30, "pm") → "14:30"',
    hint:'PM และไม่ใช่ 12: บวก 12 | AM และ 12: เปลี่ยนเป็น 0 | ใช้ f"{h:02d}:{m:02d}"' },
  { id:14, title:'เข้ารหัส Caesar Cipher',
    topic:'Functions, String', skill:'function, string, ord, chr',
    diff:5, time:30, avgTime:28, type:'code', status:'active',
    description:'จงเขียนฟังก์ชัน caesar(text, shift) เข้ารหัสข้อความโดยเลื่อนตัวอักษรตาม shift เช่น caesar("abc", 3) → "def" (ต้องรองรับ wrap-around)',
    hint:'ใช้ ord() แปลงเป็นตัวเลข chr() แปลงกลับ และ % 26 สำหรับ wrap-around' },
  { id:15, title:'เครื่องคิดเลข OOP',
    topic:'Functions, OOP', skill:'class, method, function',
    diff:5, time:35, avgTime:33, type:'code', status:'active',
    description:'จงสร้าง Class Calculator ที่มี method: add, subtract, multiply, divide และ history (เก็บประวัติการคำนวณทั้งหมด) พร้อม error handling กรณีหารด้วย 0',
    hint:'ใช้ self.history = [] เก็บประวัติ แต่ละ method append ผลลัพธ์เข้า history' },
]

const INIT_SS = [
  { id:1, name:'Session 1 — ความจำพื้นฐาน',          level:1, obj:'เรียนรู้ Variables, Data types, Syntax (Bloom Lv.1)',          status:'active', exIds:[1,2,3] },
  { id:2, name:'Session 2 — ความเข้าใจและการตีความ',  level:2, obj:'ฝึก input(), Casting, Print format (Bloom Lv.2)',              status:'active', exIds:[4,5,6] },
  { id:3, name:'Session 3 — การนำไปประยุกต์ใช้',      level:3, obj:'ประยุกต์ใช้ Expressions, Operators, if-else (Bloom Lv.3)',     status:'active', exIds:[7,8,9] },
  { id:4, name:'Session 4 — การวิเคราะห์และตรวจสอบ',  level:4, obj:'วิเคราะห์ Loops, Lists, Debugging (Bloom Lv.4)',              status:'active', exIds:[10,11,12] },
  { id:5, name:'Session 5 — การออกแบบและสร้างสรรค์',  level:5, obj:'สร้างสรรค์ Functions, Algorithms, OOP (Bloom Lv.5)',          status:'active', exIds:[13,14,15] },
  { id:6, name:'Session รวม — Python ครบวงจร',         level:3, obj:'รวมทุกระดับจาก Remember ถึง Create',                          status:'active', exIds:[1,4,7,10,13] },
]

const ACTS = [
  {id:7,u:'student_ธนา',   ex:'ประกาศตัวแปรและแสดงผล', ss:'Variables & Types', ev:'submit',rc:1,  sc:100,elapsed:6,  j:'Accepted',     t:'12/03/68 09:30'},
  {id:6,u:'student_ธนา',   ex:'ชนิดข้อมูลพื้นฐาน',     ss:'Variables & Types', ev:'submit',rc:2,  sc:95, elapsed:7,  j:'Accepted',     t:'11/03/68 14:00'},
  {id:5,u:'student_มินตรา',ex:'ตรวจสอบผลการสอบ',        ss:'Conditions',        ev:'submit',rc:1,  sc:100,elapsed:11, j:'Accepted',     t:'11/03/68 10:20'},
  {id:4,u:'student_มินตรา',ex:'ตรวจสอบผลการสอบ',        ss:'Conditions',        ev:'run',   rc:null,sc:null,elapsed:null,j:'Wrong Answer',t:'11/03/68 10:10'},
  {id:3,u:'student_ปิ่น',  ex:'รับค่าและทักทายผู้ใช้',  ss:'Input & Casting',   ev:'submit',rc:3,  sc:88, elapsed:14, j:'Accepted',     t:'10/03/68 15:45'},
  {id:2,u:'student_สมศรี', ex:'ผลรวมใน List ด้วย Loop', ss:'Loops & Lists',     ev:'submit',rc:2,  sc:92, elapsed:22, j:'Accepted',     t:'09/03/68 11:00'},
  {id:1,u:'student_ธนา',   ex:'เกรดนักเรียน',           ss:'Conditions',        ev:'run',   rc:null,sc:null,elapsed:null,j:'Runtime Error',t:'08/03/68 09:45'},
]

const STUDS = [
  {n:1,u:'student_ธนา',   g:'Male',  d:'2003-11-05',fac:'วิทยาศาสตร์',      maj:'วิทยาการคอมพิวเตอร์',   avgTime:7,  ex:7, sc:97},
  {n:2,u:'student_มินตรา',g:'Female',d:'2004-07-18',fac:'วิทยาศาสตร์',      maj:'วิทยาการคอมพิวเตอร์',   avgTime:11, ex:5, sc:99},
  {n:3,u:'student_ปิ่น',  g:'Female',d:'2003-05-12',fac:'วิศวกรรมศาสตร์',   maj:'วิศวกรรมคอมพิวเตอร์',   avgTime:14, ex:3, sc:88},
  {n:4,u:'student_สมศรี', g:'Female',d:'2004-09-01',fac:'วิทยาศาสตร์',      maj:'เทคโนโลยีสารสนเทศ',      avgTime:22, ex:2, sc:92},
]

const SB = (st) => st==='active'?ui.badgeGreen:st==='draft'?ui.badgeYellow:ui.badgeGray
const EMPTY_EX = { title:'', topic:'', skill:'', diff:1, time:'', type:'code', hint:'', description:'', status:'draft' }
const EMPTY_SS = { name:'', level:1, obj:'', status:'draft', exIds:[] }

export default function TeacherPage({ onNavigate }) {
  const [tab, setTab] = useState('dash')

  const [exList, setExList] = useState(INIT_EX)
  const [exForm, setExForm] = useState(null)

  const [ssList,   setSsList]   = useState(INIT_SS)
  const [selSS,    setSelSS]    = useState(1)
  const [ssForm,   setSsForm]   = useState(null)
  const [addModal, setAddModal] = useState(false)

  const [prof, setProf] = useState({ username:'teacher_วิภา', gender:'Female', pw:'' })

  const TABS = [
    { id:'dash',    label:'🏠 Dashboard' },
    { id:'exs',     label:'📝 โจทย์ทั้งหมด' },
    { id:'sess',    label:'🗂️ จัดการ Session' },
    { id:'results', label:'📊 ผลนักเรียน' },
    { id:'studs',   label:'👥 รายชื่อนักเรียน' },
    { id:'profile', label:'👤 โปรไฟล์' },
    { id:'logout',  label:'🚪 ออกจากระบบ', danger:true },
  ]
  const TITLE = { dash:'Teacher Dashboard', exs:'โจทย์ทั้งหมด', sess:'จัดการ Session', results:'ผลนักเรียน', studs:'รายชื่อนักเรียน', profile:'โปรไฟล์ของฉัน' }

  const goTab = (id) => {
    if (id==='logout') { toast('👋 ออกจากระบบแล้ว'); setTimeout(()=>onNavigate('login'),500); return }
    setTab(id); setExForm(null); setSsForm(null); setAddModal(false)
  }

  const saveEx = () => {
    if (!exForm.title.trim()||!exForm.topic.trim()) { toast('❌ กรุณากรอก Title และ Topic'); return }
    if (exForm.id) {
      setExList(l=>l.map(e=>e.id===exForm.id?{...exForm,time:Number(exForm.time)||10}:e))
      toast('✅ บันทึกการแก้ไขแล้ว')
    } else {
      const nx = {...exForm, id:Math.max(...exList.map(e=>e.id))+1, time:Number(exForm.time)||10 }
      setExList(l=>[...l,nx])
      toast('✅ สร้างโจทย์ใหม่แล้ว — id: '+nx.id)
    }
    setExForm(null)
  }
  const delEx = (id) => { setExList(l=>l.filter(e=>e.id!==id)); toast('🗑️ ลบโจทย์แล้ว') }
  const toggleExSt = (id) => { setExList(l=>l.map(e=>e.id===id?{...e,status:e.status==='active'?'draft':'active'}:e)); toast('🔄 เปลี่ยน status แล้ว') }

  const saveSS = () => {
    if (!ssForm.name.trim()) { toast('❌ กรุณากรอกชื่อ Session'); return }
    if (ssForm.id) {
      setSsList(l=>l.map(s=>s.id===ssForm.id?ssForm:s))
      toast('✅ บันทึก Session แล้ว')
    } else {
      const nx = {...ssForm, id:Math.max(...ssList.map(s=>s.id))+1 }
      setSsList(l=>[...l,nx]); setSelSS(nx.id)
      toast('✅ สร้าง Session ใหม่ — id: '+nx.id)
    }
    setSsForm(null)
  }
  const delSS = (id) => {
    setSsList(l=>l.filter(s=>s.id!==id))
    if (selSS===id) setSelSS(ssList.find(s=>s.id!==id)?.id||null)
    toast('🗑️ ลบ Session แล้ว')
  }
  const toggleSsSt = (id) => { setSsList(l=>l.map(s=>s.id===id?{...s,status:s.status==='active'?'inactive':'active'}:s)); toast('🔄 เปลี่ยน status Session แล้ว') }
  const addExToSS = (exId) => {
    const cur = ssList.find(s=>s.id===selSS)
    if (cur?.exIds.includes(exId)) { toast('⚠️ โจทย์นี้อยู่ใน Session แล้ว'); return }
    setSsList(l=>l.map(s=>s.id===selSS?{...s,exIds:[...s.exIds,exId]}:s))
    toast('✅ เพิ่มโจทย์ใน Session แล้ว'); setAddModal(false)
  }
  const removeExFromSS = (exId) => { setSsList(l=>l.map(s=>s.id===selSS?{...s,exIds:s.exIds.filter(e=>e!==exId)}:s)); toast('🗑️ ลบออกจาก Session') }
  const moveEx = (exId, dir) => {
    setSsList(l=>l.map(s=>{
      if (s.id!==selSS) return s
      const a=[...s.exIds]; const i=a.indexOf(exId)
      if (dir==='up'&&i>0) [a[i-1],a[i]]=[a[i],a[i-1]]
      if (dir==='dn'&&i<a.length-1) [a[i],a[i+1]]=[a[i+1],a[i]]
      return {...s,exIds:a}
    }))
  }

  const curSS  = ssList.find(s=>s.id===selSS)
  const curExs = curSS ? curSS.exIds.map(id=>exList.find(e=>e.id===id)).filter(Boolean) : []
  const available = exList.filter(e=>!curSS?.exIds.includes(e.id))

  const exportExcel = () => {
    const rows = [['Username','โจทย์','Session','ประเภท','ครั้งที่ Run','เวลาเฉลี่ย (นาที)','คะแนน','ผลตรวจ','วันที่และเวลา']]
    ACTS.forEach(r => rows.push([r.u, r.ex, r.ss||'', r.ev, r.rc??'', r.elapsed??'', r.sc??'', r.j||'', r.t]))
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'})
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob)
    a.download='pylearn_results.csv'; a.click()
    toast('📥 Export สำเร็จ — pylearn_results.csv')
  }

  return (
    <Frame url="pylearn.app/teacher">
      <div className={s.shell}>
        <Sidebar roleName="TEACHER" roleColor="var(--green)" tabs={TABS} activeTab={tab} onTabChange={goTab} />
        <div className={s.main}>
          <Topbar title={TITLE[tab]||''} right={
            <>
              {tab==='exs'  && <Btn variant="green" size="sm" onClick={()=>setExForm({...EMPTY_EX})}>+ สร้างโจทย์</Btn>}
              {tab==='sess' && <Btn variant="green" size="sm" onClick={()=>setSsForm({...EMPTY_SS})}>+ สร้าง Session</Btn>}
              <Avatar letter="ว" bg="var(--green-light)" color="var(--green)" />
            </>
          } />

          <div className={s.content}>

            {/* ══ DASHBOARD ══ */}
            {tab==='dash' && <>
              <div className={s.row}>
                <StatCard icon="📝" title="โจทย์ทั้งหมด"
                  value={exList.length}
                  sub={`active ${exList.filter(e=>e.status==='active').length} | draft ${exList.filter(e=>e.status==='draft').length}`}
                  onClick={()=>goTab('exs')} />
                <StatCard icon="🗂️" title="Sessions"
                  value={ssList.length}
                  sub={`active ${ssList.filter(s=>s.status==='active').length} session`}
                  onClick={()=>goTab('sess')} />
                <StatCard icon="🎓" title="นักเรียน"
                  value={STUDS.length} sub="รายชื่อทั้งหมด"
                  onClick={()=>goTab('studs')} />
                <StatCard icon="⭐" title="avg Score"
                  value="87.4" sub="ทุกโจทย์"
                  subColor="var(--green)" />
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                {/* คะแนนเฉลี่ยตาม Bloom Level */}
                <div className={ui.card}>
                  <SecH>📊 คะแนนเฉลี่ยตาม Bloom Level</SecH>
                  {[
                    {lv:'Lv.1 Remember',   avg:94, color:'#0369a1'},
                    {lv:'Lv.2 Understand', avg:88, color:'#065f46'},
                    {lv:'Lv.3 Apply',      avg:82, color:'#92400e'},
                    {lv:'Lv.4 Analyse',    avg:75, color:'#6d28d9'},
                    {lv:'Lv.5 Create',     avg:68, color:'#9f1239'},
                  ].map(r=>(
                    <div key={r.lv} style={{marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:10,color:'var(--text2)'}}>{r.lv}</span>
                        <span style={{fontSize:10,fontWeight:700,color:r.color}}>{r.avg}</span>
                      </div>
                      <div style={{height:10,background:'var(--surface3)',borderRadius:99,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${r.avg}%`,background:r.color,borderRadius:99,transition:'width .4s'}}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* จำนวนโจทย์ที่ส่งต่อนักเรียน */}
                <div className={ui.card}>
                  <SecH>📈 จำนวนโจทย์ที่ส่งต่อนักเรียน</SecH>
                  <div style={{display:'flex',alignItems:'flex-end',gap:10,height:190,padding:'4px 0 0'}}>
                    {STUDS.map(r=>{
                      const pct = Math.round(r.ex/10*100)
                      return (
                        <div key={r.n} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                          <span style={{fontSize:9,fontWeight:700,color:'var(--accent)'}}>{r.ex}</span>
                          <div style={{width:'100%',background:'var(--accent)',borderRadius:'4px 4px 0 0',height:`${Math.max(pct,6)}%`,minHeight:6}}/>
                          <span style={{fontSize:8,color:'var(--text2)',textAlign:'center',lineHeight:1.3}}>{r.u.replace('student_','')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className={ui.card}>
                <SecH>📋 ผลส่งล่าสุด
                  <div style={{display:'flex',gap:8}}>
                    <Btn variant="secondary" size="sm" onClick={()=>goTab('results')}>ดูทั้งหมด →</Btn>
                    <Btn variant="primary"   size="sm" onClick={()=>exportExcel()}>📥 Export Excel</Btn>
                  </div>
                </SecH>
                <table className={ui.tbl}>
                  <thead><tr><th>Username</th><th>โจทย์</th><th>ประเภท</th><th>คะแนน</th><th>ครั้งที่ Run</th><th>เวลา (นาที)</th><th>วันที่และเวลา</th></tr></thead>
                  <tbody>{ACTS.slice(0,5).map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.u}</td>
                      <td>{r.ex}</td>
                      <td><span className={`${ui.badge} ${r.ev==='submit'?ui.badgeBlue:ui.badgeGray}`}>{r.ev}</span></td>
                      <td style={{fontWeight:700,color:'var(--green)'}}>{r.sc||'—'}</td>
                      <td style={{textAlign:'center'}}>{r.rc===null?'—':<span className={s.rcBadge}>{r.rc}</span>}</td>
                      <td style={{textAlign:'center',fontWeight:600,color:'var(--accent)'}}>{r.elapsed||'—'}</td>
                      <td style={{fontSize:10}}>{r.t}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </>}

            {/* ══ EXERCISES ══ */}
            {tab==='exs' && (<>
              {exForm && (
                <div className={ui.card} style={{borderColor:'var(--green)',marginBottom:16}}>
                  <SecH>{exForm.id?'✏️ แก้ไขโจทย์':'➕ สร้างโจทย์ใหม่'}</SecH>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                    <InputGroup label="TITLE *">
                      <input className={ui.inp} placeholder="เช่น Fibonacci Sequence"
                        value={exForm.title} onChange={e=>setExForm(f=>({...f,title:e.target.value}))} />
                    </InputGroup>
                    <InputGroup label="TOPIC *">
                      <input className={ui.inp} placeholder="เช่น Loop, Function, Algorithm"
                        value={exForm.topic} onChange={e=>setExForm(f=>({...f,topic:e.target.value}))} />
                    </InputGroup>
                    <InputGroup label="SKILL (คั่น comma)">
                      <input className={ui.inp} placeholder="เช่น Loop, Recursion"
                        value={exForm.skill} onChange={e=>setExForm(f=>({...f,skill:e.target.value}))} />
                    </InputGroup>
                    <InputGroup label="EXPECTED_TIME (นาที)">
                      <input className={ui.inp} type="number" min="1" max="180" placeholder="เช่น 20"
                        value={exForm.time} onChange={e=>setExForm(f=>({...f,time:e.target.value}))} />
                    </InputGroup>
                    <InputGroup label="DIFFICULTY (Bloom's Taxonomy)">
                      <select className={ui.inp} value={exForm.diff} onChange={e=>setExForm(f=>({...f,diff:Number(e.target.value)}))}>
                        <option value={1}>Lv.1 — Remember (ความจำพื้นฐาน)</option>
                        <option value={2}>Lv.2 — Understand (ความเข้าใจและการตีความ)</option>
                        <option value={3}>Lv.3 — Apply (การนำไปประยุกต์ใช้)</option>
                        <option value={4}>Lv.4 — Analyse (การวิเคราะห์และตรวจสอบ)</option>
                        <option value={5}>Lv.5 — Create (การออกแบบและสร้างสรรค์)</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="STATUS">
                      <select className={ui.inp} value={exForm.status} onChange={e=>setExForm(f=>({...f,status:e.target.value}))}>
                        <option value="draft">draft — ยังไม่เผยแพร่</option>
                        <option value="active">active — เผยแพร่แล้ว</option>
                        <option value="inactive">inactive — ซ่อน</option>
                      </select>
                    </InputGroup>
                  </div>
                  <InputGroup label="HINT (ไม่บังคับ)">
                    <textarea className={ui.inp} rows={2} style={{resize:'vertical'}}
                      placeholder="คำใบ้สำหรับนักเรียน..."
                      value={exForm.hint||''} onChange={e=>setExForm(f=>({...f,hint:e.target.value}))} />
                  </InputGroup>
                  <div style={{display:'flex',gap:8,marginTop:12}}>
                    <Btn variant="green" onClick={saveEx}>💾 บันทึก</Btn>
                    <Btn variant="secondary" onClick={()=>setExForm(null)}>ยกเลิก</Btn>
                  </div>
                </div>
              )}
              <div className={ui.card}>
                <SecH>📝 โจทย์ทั้งหมด ({exList.length} ข้อ)
                  {!exForm && <Btn variant="green" size="sm" onClick={()=>setExForm({...EMPTY_EX})}>+ เพิ่มโจทย์</Btn>}
                </SecH>
                <table className={ui.tbl}>
                  <thead><tr><th>ID</th><th>Title</th><th>Topic</th><th>Skill</th><th>Bloom Level</th><th>Time</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>{exList.map(ex=>(
                    <tr key={ex.id}>
                      <td className={s.mono}>{ex.id}</td>
                      <td>
                        <div style={{fontWeight:600}}>{ex.title}</div>
                        {ex.description && <div style={{fontSize:9,color:'var(--text2)',marginTop:2,maxWidth:200,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ex.description}</div>}
                      </td>
                      <td style={{fontSize:11}}>{ex.topic}</td>
                      <td style={{fontSize:10,color:'var(--text2)'}}>{ex.skill}</td>
                      <td>
                        <span style={{fontSize:9,fontWeight:700,color:BLOOM[ex.diff]?.color,background:BLOOM[ex.diff]?.bg,border:`1px solid ${BLOOM[ex.diff]?.border}`,borderRadius:99,padding:'2px 7px',whiteSpace:'nowrap'}}>
                          {BLOOM[ex.diff]?.label}
                        </span>
                      </td>
                      <td style={{fontSize:11}}>{ex.time} นาที</td>
                      <td><span className={`${ui.badge} ${ui.badgeGray}`}>{ex.type}</span></td>
                      <td>
                        <span className={`${ui.badge} ${SB(ex.status)}`}
                          style={{cursor:'pointer'}} onClick={()=>toggleExSt(ex.id)}>{ex.status}</span>
                      </td>
                      <td>
                        <div style={{display:'flex',gap:4}}>
                          <Btn variant="secondary" size="xs" onClick={()=>setExForm({...ex})}>✏️</Btn>
                          <Btn variant="red"       size="xs" onClick={()=>delEx(ex.id)}>🗑️</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </>)}

            {/* ══ SESSIONS ══ */}
            {tab==='sess' && (<>
              {ssForm && (
                <div className={ui.card} style={{borderColor:'var(--green)',marginBottom:16}}>
                  <SecH>{ssForm.id?'✏️ แก้ไข Session':'➕ สร้าง Session ใหม่'}</SecH>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                    <InputGroup label="SESSION NAME *">
                      <input className={ui.inp} placeholder="เช่น Python พื้นฐาน"
                        value={ssForm.name} onChange={e=>setSsForm(f=>({...f,name:e.target.value}))} />
                    </InputGroup>
                    <InputGroup label="TARGET LEVEL (Bloom's Taxonomy)">
                      <select className={ui.inp} value={ssForm.level} onChange={e=>setSsForm(f=>({...f,level:Number(e.target.value)}))}>
                        <option value={1}>Lv.1 — Remember</option>
                        <option value={2}>Lv.2 — Understand</option>
                        <option value={3}>Lv.3 — Apply</option>
                        <option value={4}>Lv.4 — Analyse</option>
                        <option value={5}>Lv.5 — Create</option>
                      </select>
                    </InputGroup>
                  </div>
                  <InputGroup label="LEARNING_OBJECTIVE">
                    <textarea className={ui.inp} rows={2} style={{resize:'vertical'}}
                      placeholder="จุดประสงค์การเรียนรู้..."
                      value={ssForm.obj} onChange={e=>setSsForm(f=>({...f,obj:e.target.value}))} />
                  </InputGroup>
                  <InputGroup label="STATUS">
                    <select className={ui.inp} value={ssForm.status} onChange={e=>setSsForm(f=>({...f,status:e.target.value}))}>
                      <option value="draft">draft — ยังไม่เผยแพร่</option>
                      <option value="active">active — นักเรียนเห็นได้</option>
                      <option value="inactive">inactive — ซ่อน</option>
                    </select>
                  </InputGroup>
                  <div style={{display:'flex',gap:8,marginTop:12}}>
                    <Btn variant="green" onClick={saveSS}>💾 บันทึก Session</Btn>
                    <Btn variant="secondary" onClick={()=>setSsForm(null)}>ยกเลิก</Btn>
                  </div>
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:16}}>
                <div className={ui.card} style={{padding:0,overflow:'hidden'}}>
                  <div style={{padding:'10px 14px',borderBottom:'1px solid var(--border)',fontWeight:700,fontSize:11,color:'var(--text2)'}}>
                    SESSIONS ({ssList.length})
                  </div>
                  {ssList.map(ss=>(
                    <div key={ss.id} onClick={()=>setSelSS(ss.id)} style={{
                      padding:'10px 14px', cursor:'pointer',
                      borderLeft: ss.id===selSS?'3px solid var(--green)':'3px solid transparent',
                      background: ss.id===selSS?'var(--green-light)':'transparent',
                      borderBottom:'1px solid var(--border)',
                    }}>
                      <div style={{fontWeight:700,fontSize:12,marginBottom:4}}>{ss.name}</div>
                      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                        <span style={{fontSize:8,fontWeight:700,color:BLOOM[ss.level]?.color,background:BLOOM[ss.level]?.bg,border:`1px solid ${BLOOM[ss.level]?.border}`,borderRadius:99,padding:'1px 6px'}}>
                          {BLOOM[ss.level]?.label}
                        </span>
                        <span className={`${ui.badge} ${SB(ss.status)}`} style={{fontSize:8}}>{ss.status}</span>
                        <span style={{fontSize:9,color:'var(--text2)'}}>{ss.exIds.length} ข้อ</span>
                      </div>
                    </div>
                  ))}
                  {ssList.length===0 && <div className={s.emptyState} style={{padding:16}}>ยังไม่มี Session</div>}
                </div>

                <div>
                  {curSS ? (<>
                    <div className={ui.card} style={{marginBottom:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div>
                          <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{curSS.name}</div>
                          <div style={{fontSize:11,color:'var(--text2)',marginBottom:8}}>{curSS.obj||'(ไม่มี objective)'}</div>
                          <div style={{display:'flex',gap:6,alignItems:'center'}}>
                            <span style={{fontSize:9,fontWeight:700,color:BLOOM[curSS.level]?.color,background:BLOOM[curSS.level]?.bg,border:`1px solid ${BLOOM[curSS.level]?.border}`,borderRadius:99,padding:'2px 8px'}}>
                              {BLOOM[curSS.level]?.label}
                            </span>
                            <span className={`${ui.badge} ${SB(curSS.status)}`}
                              style={{cursor:'pointer'}} onClick={()=>toggleSsSt(curSS.id)}>{curSS.status}</span>
                            <span style={{fontSize:10,color:'var(--text2)'}}>session_id: {curSS.id} · {curSS.exIds.length} โจทย์</span>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:6}}>
                          <Btn variant="secondary" size="sm" onClick={()=>setSsForm({...curSS,exIds:[...curSS.exIds]})}>✏️ แก้ไข</Btn>
                          <Btn variant="red"       size="sm" onClick={()=>delSS(curSS.id)}>🗑️ ลบ</Btn>
                        </div>
                      </div>
                    </div>

                    <div className={ui.card}>
                      <SecH>📝 โจทย์ใน Session ({curExs.length} ข้อ)
                        <Btn variant="green" size="sm" onClick={()=>setAddModal(v=>!v)}>+ เพิ่มโจทย์</Btn>
                      </SecH>

                      {addModal && (
                        <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:10,padding:14,marginBottom:12}}>
                          <div style={{fontWeight:700,fontSize:12,marginBottom:10}}>เลือกโจทย์ที่ต้องการเพิ่มเข้า Session</div>
                          {available.length===0
                            ? <div style={{fontSize:11,color:'var(--text2)',padding:'8px 0'}}>โจทย์ทั้งหมดอยู่ใน Session นี้แล้ว</div>
                            : <table className={ui.tbl}>
                                <thead><tr><th>ID</th><th>Title</th><th>Topic</th><th>Bloom Level</th><th>Time</th><th></th></tr></thead>
                                <tbody>{available.map(ex=>(
                                  <tr key={ex.id}>
                                    <td className={s.mono}>{ex.id}</td>
                                    <td style={{fontWeight:600}}>{ex.title}</td>
                                    <td style={{fontSize:11}}>{ex.topic}</td>
                                    <td><span style={{fontSize:8,fontWeight:700,color:BLOOM[ex.diff]?.color,background:BLOOM[ex.diff]?.bg,border:`1px solid ${BLOOM[ex.diff]?.border}`,borderRadius:99,padding:'2px 7px'}}>{BLOOM[ex.diff]?.label}</span></td>
                                    <td style={{fontSize:11}}>{ex.time} นาที</td>
                                    <td><Btn variant="green" size="xs" onClick={()=>addExToSS(ex.id)}>+ เพิ่ม</Btn></td>
                                  </tr>
                                ))}</tbody>
                              </table>
                          }
                          <Btn variant="secondary" size="sm" onClick={()=>setAddModal(false)} style={{marginTop:8}}>ปิด</Btn>
                        </div>
                      )}

                      {curExs.length===0
                        ? <div className={s.emptyState}>ยังไม่มีโจทย์ — กด "+ เพิ่มโจทย์" ด้านบน</div>
                        : <table className={ui.tbl}>
                            <thead><tr><th>ลำดับ</th><th>ID</th><th>Title</th><th>Bloom Level</th><th>เวลาที่กำหนด</th><th>เวลาเฉลี่ย (จริง)</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>{curExs.map((ex,i)=>(
                              <tr key={ex.id}>
                                <td style={{fontWeight:700,color:'var(--accent)',fontFamily:'JetBrains Mono,monospace'}}>#{i+1}</td>
                                <td className={s.mono}>{ex.id}</td>
                                <td style={{fontWeight:600}}>{ex.title}</td>
                                <td><span style={{fontSize:8,fontWeight:700,color:BLOOM[ex.diff]?.color,background:BLOOM[ex.diff]?.bg,border:`1px solid ${BLOOM[ex.diff]?.border}`,borderRadius:99,padding:'2px 7px'}}>{BLOOM[ex.diff]?.label}</span></td>
                                <td style={{fontSize:11}}>{ex.time} นาที</td>
                                <td style={{textAlign:'center',fontWeight:600,color:'var(--accent)',fontSize:11}}>{ex.avgTime ? ex.avgTime+' นาที' : '—'}</td>
                                <td><span className={`${ui.badge} ${SB(ex.status)}`}>{ex.status}</span></td>
                                <td>
                                  <div style={{display:'flex',gap:4}}>
                                    <Btn variant="secondary" size="xs" onClick={()=>moveEx(ex.id,'up')}>↑</Btn>
                                    <Btn variant="secondary" size="xs" onClick={()=>moveEx(ex.id,'dn')}>↓</Btn>
                                    <Btn variant="red"       size="xs" onClick={()=>removeExFromSS(ex.id)}>ลบออก</Btn>
                                  </div>
                                </td>
                              </tr>
                            ))}</tbody>
                          </table>
                      }
                    </div>
                  </>) : (
                    <div className={s.emptyState} style={{padding:40}}>เลือก Session จากรายการทางซ้าย</div>
                  )}
                </div>
              </div>
            </>)}

            {/* ══ RESULTS ══ */}
            {tab==='results' && (
              <div className={ui.card}>
                <SecH>📊 ผลนักเรียน
                  <Btn variant="primary" size="sm" onClick={()=>exportExcel()}>📥 Export Excel</Btn>
                </SecH>
                <table className={ui.tbl}>
                  <thead><tr><th>Username</th><th>โจทย์</th><th>Session</th><th>ประเภท</th><th>ครั้งที่ Run</th><th>เวลาเฉลี่ย (นาที)</th><th>คะแนน</th><th>ผลตรวจ</th><th>วันที่และเวลา</th><th></th></tr></thead>
                  <tbody>{ACTS.map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.u}</td>
                      <td style={{fontSize:11}}>{r.ex}</td>
                      <td style={{fontSize:10,color:'var(--text2)'}}>{r.ss||'—'}</td>
                      <td><span className={`${ui.badge} ${r.ev==='submit'?ui.badgeBlue:ui.badgeGray}`}>{r.ev}</span></td>
                      <td style={{textAlign:'center'}}>{r.rc===null?'—':<span className={s.rcBadge}>{r.rc}</span>}</td>
                      <td style={{textAlign:'center',fontWeight:600,color:'var(--accent)'}}>{r.elapsed||'—'}</td>
                      <td>{r.sc?<span style={{fontWeight:700,color:'var(--green)'}}>{r.sc}</span>:'—'}</td>
                      <td><span className={`${ui.badge} ${r.j==='Accepted'?ui.badgeGreen:r.j?.includes('Wrong')?ui.badgeYellow:ui.badgeRed}`}>{r.j||'—'}</span></td>
                      <td style={{fontSize:10,whiteSpace:'nowrap'}}>{r.t}</td>
                      <td>{r.ev==='submit'&&<Btn variant="secondary" size="xs" onClick={()=>onNavigate('result')}>ดูผล</Btn>}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}

            {/* ══ STUDENTS ══ */}
            {tab==='studs' && (
              <div className={ui.card}>
                <SecH>👥 รายชื่อนักเรียน
                  <Btn variant="primary" size="sm" onClick={()=>exportExcel()}>📥 Export Excel</Btn>
                </SecH>
                <table className={ui.tbl}>
                  <thead><tr><th>#</th><th>Username</th><th>เพศ</th><th>วันเกิด</th><th>คณะ</th><th>สาขา</th><th>เวลาเฉลี่ยต่อโจทย์</th><th>โจทย์ที่ส่ง</th><th>avg score</th><th></th></tr></thead>
                  <tbody>{STUDS.map(r=>(
                    <tr key={r.n}>
                      <td>{r.n}</td>
                      <td style={{fontWeight:600}}>{r.u}</td>
                      <td style={{fontSize:10}}>{r.g}</td>
                      <td className={s.mono} style={{fontSize:10}}>{r.d}</td>
                      <td style={{fontSize:10}}>{r.fac}</td>
                      <td style={{fontSize:10}}>{r.maj}</td>
                      <td style={{fontWeight:600,color:'var(--accent)',textAlign:'center'}}>{r.avgTime} นาที</td>
                      <td style={{textAlign:'center'}}>{r.ex} ข้อ</td>
                      <td style={{fontWeight:700,color:'var(--green)'}}>{r.sc}</td>
                      <td><Btn variant="secondary" size="xs" onClick={()=>goTab('results')}>ดูผล</Btn></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}

            {/* ══ PROFILE ══ */}
            {tab==='profile' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start'}}>

                {/* LEFT */}
                <div className={ui.card}>
                  <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20,paddingBottom:18,borderBottom:'1px solid var(--border)'}}>
                    <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#065f46,#34d399)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:'0 2px 8px rgba(0,0,0,.12)',flexShrink:0,color:'#fff',fontWeight:700}}>ว</div>
                    <div>
                      <div style={{fontSize:16,fontWeight:800,color:'var(--text)'}}>{prof.username}</div>
                      <div style={{fontSize:10,color:'var(--text2)',marginTop:2}}>ม.สงขลานครินทร์ วิทยาเขตหาดใหญ่</div>
                      <div style={{fontSize:10,color:'var(--text2)'}}>วิทยาการคอมพิวเตอร์</div>
                    </div>
                  </div>
                  <InputGroup label="USERNAME">
                    <input className={ui.inp} value={prof.username} onChange={e=>setProf(p=>({...p,username:e.target.value}))}/>
                  </InputGroup>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <InputGroup label="เพศ">
                      <select className={ui.inp} value={prof.gender} onChange={e=>setProf(p=>({...p,gender:e.target.value}))}>
                        <option value="Female">Female — หญิง</option>
                        <option value="Male">Male — ชาย</option>
                        <option value="Other">Other</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="วันเกิด">
                      <input className={ui.inp} type="date" defaultValue="1990-03-22"/>
                    </InputGroup>
                  </div>
                  <InputGroup label="Password ใหม่">
                    <input className={ui.inp} type="password" placeholder="ปล่อยว่างถ้าไม่เปลี่ยน" value={prof.pw} onChange={e=>setProf(p=>({...p,pw:e.target.value}))}/>
                  </InputGroup>
                  <div style={{marginTop:14}}>
                    <Btn variant="primary" full onClick={()=>{toast('✅ บันทึกสำเร็จ');setProf(p=>({...p,pw:''}))}}>💾 บันทึกข้อมูล</Btn>
                  </div>
                </div>

                {/* RIGHT */}
                <div className={ui.card}>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text)',marginBottom:14}}>📊 สรุปภาพรวม</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
                    {[
                      {icon:'📝',label:'โจทย์ทั้งหมด',val:exList.length,       color:'#065f46',bg:'#d1fae5'},
                      {icon:'🗂️',label:'Sessions',     val:ssList.length,       color:'#1e40af',bg:'#dbeafe'},
                      {icon:'🎓',label:'นักเรียน',      val:STUDS.length,        color:'#7c3aed',bg:'#ede9fe'},
                      {icon:'⭐',label:'avg Score',     val:'87.4',              color:'#b45309',bg:'#fef3c7'},
                    ].map(c=>(
                      <div key={c.label} style={{background:c.bg,borderRadius:10,padding:'10px 12px',display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:20}}>{c.icon}</span>
                        <div>
                          <div style={{fontSize:16,fontWeight:800,color:c.color,lineHeight:1}}>{c.val}</div>
                          <div style={{fontSize:9,color:c.color,marginTop:2}}>{c.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {[
                    {label:'โจทย์ active',         val:exList.filter(e=>e.status==='active').length,  max:exList.length,  color:'#065f46'},
                    {label:'Sessions active',       val:ssList.filter(s=>s.status==='active').length, max:ssList.length,  color:'#1e40af'},
                    {label:'นักเรียนส่งงานแล้ว',    val:STUDS.filter(r=>r.ex>0).length,               max:STUDS.length,   color:'#7c3aed'},
                  ].map(r=>(
                    <div key={r.label} style={{marginBottom:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontSize:10,color:'var(--text2)'}}>{r.label}</span>
                        <span style={{fontSize:10,fontWeight:700,color:r.color}}>{r.val}/{r.max}</span>
                      </div>
                      <div style={{height:6,background:'var(--surface3)',borderRadius:99,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${r.max>0?r.val/r.max*100:0}%`,background:r.color,borderRadius:99}}/>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </Frame>
  )
}
