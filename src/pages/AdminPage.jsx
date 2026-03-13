import { useState } from 'react'
import { Frame, Topbar, Sidebar, Avatar, SecH, StatCard, Modal, InputGroup, RoleBadge, Btn, toast } from '../components/UI'
import { ui } from '../components/UI'
import s from './DashboardShell.module.css'

const USERS = [
  {id:1,u:'admin_สมชาย',  g:'Male',  dob:'1985-05-10',role:'ROLE01',fac:'วิทยาศาสตร์',    maj:'วิทยาการคอมพิวเตอร์',reg:'10/01/68'},
  {id:2,u:'teacher_วิภา',  g:'Female',dob:'1990-03-22',role:'ROLE02',fac:'วิทยาศาสตร์',    maj:'วิทยาการคอมพิวเตอร์',reg:'11/01/68'},
  {id:3,u:'teacher_ประยุทธ',g:'Male', dob:'1988-07-14',role:'ROLE02',fac:'วิศวกรรมศาสตร์', maj:'วิศวกรรมคอมพิวเตอร์', reg:'12/01/68'},
  {id:4,u:'student_ธนา',   g:'Male',  dob:'2003-11-05',role:'ROLE03',fac:'วิทยาศาสตร์',    maj:'วิทยาการคอมพิวเตอร์',reg:'01/02/68'},
  {id:5,u:'student_มินตรา',g:'Female',dob:'2004-07-18',role:'ROLE03',fac:'วิทยาศาสตร์',    maj:'วิทยาการคอมพิวเตอร์',reg:'03/02/68'},
  {id:6,u:'student_สมศรี', g:'Female',dob:'2003-03-12',role:'ROLE03',fac:'วิศวกรรมศาสตร์', maj:'วิศวกรรมคอมพิวเตอร์', reg:'05/02/68'},
]

const BLOOM_COLORS = ['#0369a1','#065f46','#92400e','#6d28d9','#9f1239']

const MiniBar = ({val,max,color}) => (
  <div style={{display:'flex',alignItems:'center',gap:8}}>
    <div style={{flex:1,height:6,background:'var(--surface3)',borderRadius:99,overflow:'hidden'}}>
      <div style={{height:'100%',width:`${(val/max)*100}%`,background:color,borderRadius:99}}/>
    </div>
    <span style={{fontSize:10,fontWeight:700,color,minWidth:24,textAlign:'right'}}>{val}</span>
  </div>
)

export default function AdminPage({ onNavigate }) {
  const [tab, setTab]     = useState('dash')
  const [addOpen, setAdd] = useState(false)

  const TABS = [
    { id:'dash',   label:'🏠 Dashboard' },
    { id:'users',  label:'👥 จัดการผู้ใช้' },
    { id:'role',   label:'🔑 Role' },
    { id:'report', label:'📊 รายงาน' },
    { id:'logout', label:'🚪 ออกจากระบบ', danger:true },
  ]
  const titles = { dash:'ภาพรวมระบบ', users:'จัดการผู้ใช้', role:'กำหนด Role', report:'รายงานระบบ' }

  const go = id => {
    if (id==='logout') { toast('👋 ออกจากระบบแล้ว'); setTimeout(()=>onNavigate('login'),500); return }
    setTab(id)
  }

  return (
    <Frame url="pylearn.app/admin">
      <div className={s.shell}>
        <Sidebar roleName="ADMIN" roleColor="var(--accent)" tabs={TABS} activeTab={tab} onTabChange={go}/>
        <div className={s.main}>
          <Topbar title={titles[tab]||''} right={<><span style={{fontSize:11,color:'var(--text2)'}}>สวัสดี, <strong>Admin สมชาย</strong></span><Avatar letter="A"/></>}/>
          <div className={s.content}>

            {/* ── Dashboard ── */}
            {tab==='dash' && <>
              <div className={s.row}>
                <StatCard icon="👥" title="ผู้ใช้ทั้งหมด" value={128} sub="↑ +5 สัปดาห์นี้" subColor="var(--green)" onClick={()=>go('users')}/>
                <StatCard icon="👩‍🏫" title="Teacher"      value={8}   sub="กำลัง active" onClick={()=>go('users')}/>
                <StatCard icon="🎓" title="Student"        value={119} sub="ROLE03" onClick={()=>go('users')}/>
                <StatCard icon="⚡" title="Activity วันนี้" value={312} sub="การส่งคำตอบ" subColor="var(--accent)"/>
              </div>

              {/* Charts row */}
              <div className={s.row}>
                {/* Role distribution */}
                <div className={`${ui.card} ${s.card2}`}>
                  <SecH>👥 สัดส่วนผู้ใช้ตาม Role</SecH>
                  <div style={{display:'flex',alignItems:'center',gap:20,padding:'8px 0'}}>
                    {/* Donut */}
                    <svg width="90" height="90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="34" fill="none" stroke="#e2e8f0" strokeWidth="16"/>
                      <circle cx="45" cy="45" r="34" fill="none" stroke="#4f46e5" strokeWidth="16"
                        strokeDasharray={`${1/128*2*Math.PI*34} ${2*Math.PI*34}`} strokeLinecap="round" transform="rotate(-90 45 45)"/>
                      <circle cx="45" cy="45" r="34" fill="none" stroke="#059669" strokeWidth="16"
                        strokeDasharray={`${8/128*2*Math.PI*34} ${2*Math.PI*34}`} strokeLinecap="round"
                        transform={`rotate(${-90+1/128*360} 45 45)`}/>
                      <circle cx="45" cy="45" r="34" fill="none" stroke="#d97706" strokeWidth="16"
                        strokeDasharray={`${119/128*2*Math.PI*34} ${2*Math.PI*34}`} strokeLinecap="round"
                        transform={`rotate(${-90+(1+8)/128*360} 45 45)`}/>
                      <text x="45" y="49" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">128</text>
                    </svg>
                    <div style={{flex:1}}>
                      {[{l:'Admin',v:1,c:'#4f46e5'},{l:'Teacher',v:8,c:'#059669'},{l:'Student',v:119,c:'#d97706'}].map(r=>(
                        <div key={r.l} style={{marginBottom:8}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                            <span style={{fontSize:11,display:'flex',alignItems:'center',gap:5}}>
                              <span style={{width:8,height:8,borderRadius:'50%',background:r.c,display:'inline-block'}}/>
                              {r.l}
                            </span>
                          </div>
                          <MiniBar val={r.v} max={128} color={r.c}/>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weekly activity */}
                <div className={`${ui.card} ${s.card2}`}>
                  <SecH>📈 Activity รายวัน (7 วันล่าสุด)</SecH>
                  <div style={{display:'flex',alignItems:'flex-end',gap:6,height:80,marginTop:70,padding:'0 4px'}}>
                    {[{d:'จ',v:42},{d:'อ',v:68},{d:'พ',v:55},{d:'พฤ',v:89},{d:'ศ',v:120},{d:'ส',v:38},{d:'อา',v:25}].map(b=>(
                      <div key={b.d} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                        <div style={{height:`${b.v/120*68}px`,width:'100%',background:'var(--accent)',borderRadius:'4px 4px 0 0',opacity:.85}}/>
                        <span style={{fontSize:8,color:'var(--text2)'}}>{b.d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top exercises */}
                <div className={`${ui.card} ${s.cardFull}`}>
                  <SecH>🏆 โจทย์ที่ทำมากที่สุด</SecH>
                  {[
                    {t:'ประกาศตัวแปรและแสดงผล',v:95,lv:1},
                    {t:'รับค่าและทักทายผู้ใช้',  v:78,lv:2},
                    {t:'ตรวจสอบผลการสอบ',        v:62,lv:3},
                    {t:'ผลรวมใน List',            v:44,lv:4},
                    {t:'แปลงเวลา 12→24 ชม.',      v:21,lv:5},
                  ].map((r,i)=>(
                    <div key={r.t} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:10,display:'flex',alignItems:'center',gap:5}}>
                          <span style={{fontSize:9,fontWeight:700,color:BLOOM_COLORS[r.lv-1],background:'#f1f5f9',borderRadius:4,padding:'1px 5px'}}>Lv.{r.lv}</span>
                          {r.t}
                        </span>
                      </div>
                      <MiniBar val={r.v} max={95} color={BLOOM_COLORS[r.lv-1]}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent users */}
              <div className={ui.card}>
                <SecH>👤 ผู้ใช้ล่าสุด <Btn variant="primary" size="sm" onClick={()=>setAdd(true)}>+ เพิ่มผู้ใช้</Btn></SecH>
                <table className={ui.tbl}>
                  <thead><tr><th>Username</th><th>Role</th><th>คณะ</th><th>สมัครเมื่อ</th><th></th></tr></thead>
                  <tbody>{USERS.slice().reverse().slice(0,4).map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.u}</td>
                      <td><RoleBadge role={r.role}/></td>
                      <td style={{fontSize:10}}>{r.fac}</td>
                      <td style={{fontSize:10}}>{r.reg}</td>
                      <td><Btn variant="secondary" size="xs" onClick={()=>toast(`✏️ แก้ไข ${r.u}`)}>แก้ไข</Btn></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </>}

            {/* ── Users ── */}
            {tab==='users' && (
              <div className={ui.card}>
                <SecH>👥 จัดการผู้ใช้ทั้งหมด <Btn variant="primary" size="sm" onClick={()=>setAdd(true)}>+ เพิ่มผู้ใช้</Btn></SecH>
                <table className={ui.tbl}>
                  <thead><tr><th>Username</th><th>เพศ</th><th>วันเกิด</th><th>Role</th><th>คณะ</th><th>สาขา</th><th>สมัครเมื่อ</th><th></th></tr></thead>
                  <tbody>{USERS.map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.u}</td>
                      <td style={{fontSize:10}}>{r.g}</td>
                      <td style={{fontSize:10}}>{r.dob}</td>
                      <td><RoleBadge role={r.role}/></td>
                      <td style={{fontSize:10}}>{r.fac}</td>
                      <td style={{fontSize:10}}>{r.maj}</td>
                      <td style={{fontSize:10}}>{r.reg}</td>
                      <td>
                        <div style={{display:'flex',gap:4}}>
                          <Btn variant="secondary" size="xs" onClick={()=>toast(`✏️ แก้ไข ${r.u}`)}>แก้ไข</Btn>
                          <Btn variant="red"       size="xs" onClick={()=>toast(`🗑️ ลบ ${r.u}`)}>ลบ</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}

            {/* ── Role ── */}
            {tab==='role' && (
              <div className={ui.card}>
                <SecH>🔑 กำหนด Role</SecH>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
                  {[
                    {id:'ROLE01',icon:'🔵',name:'Admin',     n:1,  color:'#1e40af',bg:'#dbeafe',border:'#93c5fd',perms:['จัดการผู้ใช้ทั้งหมด','กำหนด Role','ดูรายงานระบบ','ทุกสิทธิ์']},
                    {id:'ROLE02',icon:'🟢',name:'Teacher',   n:8,  color:'#065f46',bg:'#d1fae5',border:'#6ee7b7',perms:['สร้างโจทย์','จัดการ Session','ดูผลนักเรียน','Export รายงาน']},
                    {id:'ROLE03',icon:'🟡',name:'Student',   n:119,color:'#92400e',bg:'#fef3c7',border:'#fcd34d',perms:['ทำโจทย์','ดูผลตัวเอง','เลือก Session','ดูประวัติ']},
                  ].map(r=>(
                    <div key={r.id} style={{borderRadius:12,border:`1.5px solid ${r.border}`,background:r.bg+'44',padding:'18px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                        <span style={{fontSize:20}}>{r.icon}</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:13,color:r.color}}>{r.name}</div>
                          <div style={{fontSize:10,color:'var(--text2)'}}>{r.id} · {r.n} คน</div>
                        </div>
                      </div>
                      {r.perms.map(p=>(
                        <div key={p} style={{fontSize:10,color:r.color,marginBottom:4,display:'flex',gap:5}}>
                          <span>✓</span>{p}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <table className={ui.tbl}>
                  <thead><tr><th>Role</th><th>ชื่อ</th><th>สิทธิ์</th><th>จำนวนผู้ใช้</th></tr></thead>
                  <tbody>
                    {[{id:'ROLE01',p:'ทุกสิทธิ์ — จัดการระบบ',n:1},{id:'ROLE02',p:'สร้างโจทย์, Session, ดูผลนักเรียน',n:8},{id:'ROLE03',p:'ทำโจทย์, ดูผลตัวเอง, ดู Session',n:119}].map(r=>(
                      <tr key={r.id}>
                        <td><RoleBadge role={r.id}/></td>
                        <td style={{fontWeight:600}}>{r.id==='ROLE01'?'Admin':r.id==='ROLE02'?'Teacher':'Student'}</td>
                        <td style={{fontSize:10,color:'var(--text2)'}}>{r.p}</td>
                        <td style={{fontWeight:700,color:'var(--accent)',textAlign:'center'}}>{r.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Report ── */}
            {tab==='report' && <>
              <div className={s.row}>
                {[{icon:'👥',t:'ผู้ใช้ทั้งหมด',v:128,c:'var(--accent)'},{icon:'📝',t:'โจทย์ทั้งหมด',v:30,c:'var(--green)'},{icon:'🗂️',t:'Sessions',v:10,c:'#d97706'},{icon:'📊',t:'ส่งคำตอบแล้ว',v:1240,c:'#7c3aed'}].map(c=>(
                  <div key={c.t} className={ui.statCard}>
                    <div className={ui.statIcon}>{c.icon}</div>
                    <div className={ui.statTitle}>{c.t}</div>
                    <div className={ui.statValue} style={{color:c.c}}>{c.v}</div>
                  </div>
                ))}
              </div>

              <div className={s.row}>
                {/* Score distribution */}
                <div className={`${ui.card} ${s.card2}`}>
                  <SecH>📊 การกระจายคะแนน (ทุกโจทย์)</SecH>
                  <div style={{display:'flex',alignItems:'flex-end',gap:4,height:90,marginTop:60}}>
                    {[{r:'0-20',v:5},{r:'21-40',v:8},{r:'41-60',v:15},{r:'61-80',v:42},{r:'81-100',v:88}].map(b=>(
                      <div key={b.r} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                        <span style={{fontSize:8,color:'var(--accent)',fontWeight:700}}>{b.v}</span>
                        <div style={{height:`${b.v/88*70}px`,width:'100%',background:b.v>50?'var(--green)':b.v>30?'var(--accent)':'var(--red)',borderRadius:'4px 4px 0 0',opacity:.8}}/>
                        <span style={{fontSize:7,color:'var(--text2)'}}>{b.r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloom level stats */}
                <div className={`${ui.card} ${s.card2}`}>
                  <SecH>📈 การส่งงานตาม Bloom Level</SecH>
                  <div style={{marginTop:8}}>
                    {[
                      {l:'Lv.1 Remember', v:320,color:'#0369a1'},
                      {l:'Lv.2 Understand',v:245,color:'#065f46'},
                      {l:'Lv.3 Apply',    v:180,color:'#92400e'},
                      {l:'Lv.4 Analyse',  v:95, color:'#6d28d9'},
                      {l:'Lv.5 Create',   v:40, color:'#9f1239'},
                    ].map(r=>(
                      <div key={r.l} style={{marginBottom:8}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3,fontSize:10}}>
                          <span style={{color:r.color,fontWeight:600}}>{r.l}</span>
                        </div>
                        <MiniBar val={r.v} max={320} color={r.color}/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* avg score per session */}
                <div className={`${ui.card} ${s.cardFull}`}>
                  <SecH>🎯 คะแนนเฉลี่ยต่อ Session</SecH>
                  {[
                    {s:'Variables & Types', avg:94,lv:1},
                    {s:'Input & Casting',   avg:88,lv:2},
                    {s:'Conditions',        avg:79,lv:3},
                    {s:'Loops & Lists',     avg:71,lv:4},
                    {s:'Functions & OOP',   avg:65,lv:5},
                  ].map(r=>(
                    <div key={r.s} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:10,color:'var(--text)'}}>{r.s}</span>
                        <span style={{fontSize:10,fontWeight:700,color:BLOOM_COLORS[r.lv-1]}}>{r.avg}</span>
                      </div>
                      <MiniBar val={r.avg} max={100} color={BLOOM_COLORS[r.lv-1]}/>
                    </div>
                  ))}
                </div>
              </div>
            </>}

          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={addOpen} onClose={()=>setAdd(false)} width={440}>
        <div className={ui.modalTitle}>➕ เพิ่มผู้ใช้ใหม่</div>
        <div className={ui.row}>
          <div className={ui.col}><InputGroup label="Username" required><input className={ui.inp} placeholder="username..."/></InputGroup></div>
          <div className={ui.col}><InputGroup label="Password" required><input className={ui.inp} type="password" placeholder="••••••••"/></InputGroup></div>
        </div>
        <div className={ui.row}>
          <div className={ui.col}><InputGroup label="เพศ"><select className={ui.inp}><option>Male</option><option>Female</option><option>Other</option></select></InputGroup></div>
          <div className={ui.col}><InputGroup label="Role"><select className={ui.inp}><option>ROLE03 — Student</option><option>ROLE02 — Teacher</option><option>ROLE01 — Admin</option></select></InputGroup></div>
        </div>
        <InputGroup label="คณะ"><select className={ui.inp}><option>วิทยาศาสตร์</option><option>วิศวกรรมศาสตร์</option><option>เทคโนโลยีและสิ่งแวดล้อม</option></select></InputGroup>
        <div style={{display:'flex',gap:10,marginTop:4}}>
          <Btn variant="secondary" full onClick={()=>setAdd(false)}>ยกเลิก</Btn>
          <Btn variant="primary"   full onClick={()=>{setAdd(false);toast('✅ เพิ่มผู้ใช้สำเร็จ')}}>💾 บันทึก</Btn>
        </div>
      </Modal>
    </Frame>
  )
}
