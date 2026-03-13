import { useState } from 'react'
import { Frame, Topbar, Sidebar, Avatar, SecH, StatCard, Btn, InputGroup, toast } from '../components/UI'
import { ui } from '../components/UI'
import s from './DashboardShell.module.css'

const BLOOM = {
  1:{label:'Lv.1 Remember',  th:'ความจำพื้นฐาน',         color:'#0369a1',bg:'#e0f2fe',border:'#bae6fd'},
  2:{label:'Lv.2 Understand',th:'ความเข้าใจและการตีความ', color:'#065f46',bg:'#d1fae5',border:'#6ee7b7'},
  3:{label:'Lv.3 Apply',     th:'การนำไปประยุกต์ใช้',    color:'#92400e',bg:'#fef3c7',border:'#fcd34d'},
  4:{label:'Lv.4 Analyse',   th:'การวิเคราะห์และตรวจสอบ',color:'#6d28d9',bg:'#ede9fe',border:'#c4b5fd'},
  5:{label:'Lv.5 Create',    th:'การออกแบบและสร้างสรรค์', color:'#9f1239',bg:'#ffe4e6',border:'#fda4af'},
}

const SESSIONS = [
  {id:1, level:1, name:'Variables & Types',     obj:'ตัวแปรและชนิดข้อมูลพื้นฐาน',  exCount:3, done:3},
  {id:2, level:1, name:'Print & Syntax',        obj:'การแสดงผลและ Syntax เบื้องต้น',exCount:3, done:2},
  {id:3, level:2, name:'Input & Casting',       obj:'การรับค่าและแปลงชนิดข้อมูล',  exCount:3, done:2},
  {id:4, level:2, name:'String Formatting',     obj:'การจัดรูปแบบข้อความ',          exCount:3, done:1},
  {id:5, level:3, name:'Conditions & Operators',obj:'เงื่อนไขและตัวดำเนินการ',      exCount:3, done:1},
  {id:6, level:3, name:'Nested Conditions',     obj:'เงื่อนไขซ้อนและ match-case',   exCount:3, done:0},
  {id:7, level:4, name:'Loops & Lists',         obj:'การวนลูปและการใช้ List',        exCount:3, done:0},
  {id:8, level:4, name:'Debugging',             obj:'การตรวจสอบและแก้ไข Bug',        exCount:3, done:0},
  {id:9, level:5, name:'Functions & Algorithms',obj:'ฟังก์ชันและ Algorithm',         exCount:3, done:0},
  {id:10,level:5, name:'OOP Basics',            obj:'การเขียนโปรแกรมเชิงวัตถุ',      exCount:3, done:0},
]

const EXERCISES = {
  1:[
    {id:1, title:'ประกาศตัวแปรและแสดงผล',  diff:1,time:5,  desc:'จงประกาศตัวแปร x = 10 และ y = \'Python\' แล้วแสดงผลทีละบรรทัด',done:true},
    {id:2, title:'ชนิดข้อมูลพื้นฐาน',      diff:1,time:5,  desc:'ประกาศตัวแปร 4 ชนิด (int,float,str,bool) แล้วแสดงชนิดด้วย type()',done:true},
    {id:3, title:'ตัวแปรหลายตัว',           diff:1,time:5,  desc:'ประกาศตัวแปร a,b,c พร้อมกันในบรรทัดเดียว แล้วแสดงผลรวมกัน',done:true},
  ],
  2:[
    {id:4, title:'Hello World',              diff:1,time:5,  desc:'แสดงข้อความ "Hello, World!" และ "ยินดีต้อนรับสู่ Python"',done:true},
    {id:5, title:'Print หลายค่า',            diff:1,time:5,  desc:'ใช้ print() แสดงตัวเลข ข้อความ และ boolean ในบรรทัดเดียว',done:true},
    {id:6, title:'Comment & Syntax',         diff:1,time:5,  desc:'เขียนโปรแกรมพร้อม comment อธิบายทุกบรรทัด',done:false},
  ],
  3:[
    {id:7, title:'รับชื่อและทักทาย',         diff:2,time:10, desc:'รับชื่อจากผู้ใช้ แล้วแสดง "Hello, [ชื่อ]"',done:true},
    {id:8, title:'รับตัวเลขและบวก',          diff:2,time:10, desc:'รับตัวเลข 2 ค่า แปลงชนิด แล้วแสดงผลรวม',done:true},
    {id:9, title:'แปลง float',               diff:2,time:10, desc:'รับราคาสินค้าเป็น string แปลงเป็น float แล้วคำนวณ VAT 7%',done:false},
  ],
  4:[
    {id:10,title:'f-string',                 diff:2,time:10, desc:'รับชื่อและอายุ แสดง "ชื่อ: X, อายุ: Y ปี" ด้วย f-string',done:true},
    {id:11,title:'format()',                  diff:2,time:10, desc:'แสดงตัวเลขทศนิยม 2 ตำแหน่งด้วย format()',done:false},
    {id:12,title:'ตาราง format',              diff:2,time:15, desc:'แสดงตารางสินค้า 3 รายการให้ตรงคอลัมน์ด้วย format()',done:false},
  ],
  5:[
    {id:13,title:'ตรวจสอบผลการสอบ',          diff:3,time:15, desc:'รับคะแนน 0-100 ถ้า >= 50 แสดง "Pass" ไม่งั้น "Fail"',done:true},
    {id:14,title:'เกรด A-F',                 diff:3,time:15, desc:'รับคะแนน แสดงเกรด A(80+) B(70+) C(60+) D(50+) F(<50)',done:false},
    {id:15,title:'คำนวณค่าจ้าง OT',          diff:3,time:15, desc:'ถ้าทำงาน > 40 ชม. คิด OT 1.5 เท่า',done:false},
  ],
  6:[
    {id:16,title:'match-case วันใน week',    diff:3,time:15, desc:'รับตัวเลข 1-7 แสดงชื่อวัน ด้วย match-case',done:false},
    {id:17,title:'เงื่อนไขซ้อน',              diff:3,time:20, desc:'ตรวจสอบว่าตัวเลขเป็นบวก/ลบ/ศูนย์ และเป็นคู่/คี่',done:false},
    {id:18,title:'Calculator อย่างง่าย',     diff:3,time:20, desc:'รับตัวเลข 2 ค่าและ operator (+,-,*,/) แสดงผลการคำนวณ',done:false},
  ],
  7:[
    {id:19,title:'ผลรวม List',               diff:4,time:20, desc:'กำหนด numbers=[5,2,9,1] วนลูปหาผลรวม ห้ามใช้ sum()',done:false},
    {id:20,title:'ค่าสูงสุด/ต่ำสุด',          diff:4,time:20, desc:'รับตัวเลข 5 ค่า หาค่า max/min โดยไม่ใช้ฟังก์ชันสำเร็จรูป',done:false},
    {id:21,title:'กรองเลขคู่',               diff:4,time:20, desc:'วนลูปใน list แสดงเฉพาะเลขคู่',done:false},
  ],
  8:[
    {id:22,title:'ตรวจจำนวนเฉพาะ',           diff:4,time:25, desc:'รับจำนวนเต็มบวก ตรวจว่าเป็น Prime หรือไม่',done:false},
    {id:23,title:'หา Bug',                   diff:4,time:20, desc:'โค้ดต่อไปนี้มี Bug ให้หาและแก้ไขให้ถูกต้อง',done:false},
    {id:24,title:'Count คำใน string',        diff:4,time:25, desc:'รับประโยค นับจำนวนคำ และหาคำที่ซ้ำมากที่สุด',done:false},
  ],
  9:[
    {id:25,title:'แปลงเวลา 12→24 ชม.',       diff:5,time:30, desc:'เขียนฟังก์ชัน time_convert(h,m,am_pm) → "14:30"',done:false},
    {id:26,title:'Caesar Cipher',            diff:5,time:30, desc:'เขียนฟังก์ชัน caesar(text,shift) เข้ารหัสแบบ shift',done:false},
    {id:27,title:'Binary Search',            diff:5,time:35, desc:'เขียนฟังก์ชัน binary_search(lst,target) คืน index หรือ -1',done:false},
  ],
  10:[
    {id:28,title:'Class Calculator',         diff:5,time:35, desc:'สร้าง class Calculator มี method add/sub/mul/div และ history',done:false},
    {id:29,title:'Class BankAccount',        diff:5,time:35, desc:'สร้าง class BankAccount มี deposit/withdraw/balance พร้อม error handling',done:false},
    {id:30,title:'Inheritance',              diff:5,time:40, desc:'สร้าง Animal base class และ Dog, Cat ที่ inherit พร้อม override speak()',done:false},
  ],
}

const HISTORY = [
  {id:6,ex:'ตัวแปรหลายตัว',           ss:'Variables & Types',  lv:1,ev:'submit',score:100,rc:1, judge:'Accepted',    t:'13/03/68 10:15'},
  {id:5,ex:'ชนิดข้อมูลพื้นฐาน',       ss:'Variables & Types',  lv:1,ev:'submit',score:95, rc:2, judge:'Accepted',    t:'12/03/68 09:30'},
  {id:4,ex:'ประกาศตัวแปรและแสดงผล',   ss:'Variables & Types',  lv:1,ev:'submit',score:100,rc:1, judge:'Accepted',    t:'11/03/68 14:05'},
  {id:3,ex:'รับชื่อและทักทาย',         ss:'Input & Casting',    lv:2,ev:'submit',score:88, rc:3, judge:'Accepted',    t:'10/03/68 10:15'},
  {id:2,ex:'รับตัวเลขและบวก',          ss:'Input & Casting',    lv:2,ev:'submit',score:90, rc:2, judge:'Accepted',    t:'09/03/68 15:20'},
  {id:1,ex:'ตรวจสอบผลการสอบ',          ss:'Conditions',         lv:3,ev:'submit',score:75, rc:4, judge:'Accepted',    t:'08/03/68 16:40'},
]

const BAR = ({val,max=100,color})=>(
  <div style={{width:100,height:6,background:'rgba(0,0,0,.08)',borderRadius:99,overflow:'hidden',display:'inline-block'}}>
    <div style={{height:'100%',width:`${val/max*100}%`,background:color,borderRadius:99}}/>
  </div>
)

export default function StudentPage({ onNavigate }) {
  const [tab, setTab]         = useState('home')
  const [selLevel, setLevel]  = useState(null)

  const TABS = [
    {id:'home',    label:'🏠 หน้าหลัก'},
    {id:'session', label:'📚 Session'},
    {id:'history', label:'📋 ประวัติ'},
    {id:'profile', label:'👤 โปรไฟล์'},
    {id:'logout',  label:'🚪 ออกจากระบบ', danger:true},
  ]
  const titles = {home:'หน้าหลัก', session:'Session ของฉัน', history:'ประวัติและผลการทำโจทย์', profile:'โปรไฟล์'}

  const handleTab = id => {
    if (id==='logout'){toast('👋 ออกจากระบบแล้ว'); setTimeout(()=>onNavigate('login'),500); return}
    setTab(id); if(id==='session') setLevel(null)
  }

  const totalDone  = SESSIONS.reduce((a,s)=>a+s.done,0)
  const totalEx    = SESSIONS.reduce((a,s)=>a+s.exCount,0)
  const avgScore   = Math.round(HISTORY.reduce((a,r)=>a+(r.score||0),0)/HISTORY.length)
  const levelSessions = selLevel ? SESSIONS.filter(s=>s.level===selLevel) : []

  return (
    <Frame url="pylearn.app/student">
      <div className={s.shell}>
        <Sidebar roleName="STUDENT" roleColor="var(--yellow)" tabs={TABS} activeTab={tab} onTabChange={handleTab}/>
        <div className={s.main}>
          <Topbar title={titles[tab]||''} right={<Avatar letter="ธ" bg="var(--yellow-light)" color="#ca8a04"/>}/>
          <div className={s.content}>

            {/* ── HOME ── */}
            {tab==='home' && <>
              <div className={s.row}>
                <StatCard icon="📝" title="โจทย์ที่ทำ"    value={`${totalDone}/${totalEx}`} sub={`${Math.round(totalDone/totalEx*100)}% ของทั้งหมด`}/>
                <StatCard icon="✅" title="ผ่านแล้ว"       value={HISTORY.length}            sub="ส่งสำเร็จ" subColor="var(--green)"/>
                <StatCard icon="📊" title="คะแนนเฉลี่ย"   value={avgScore}                  sub="จากทุกโจทย์"/>
                <StatCard icon="🔥" title="Streak"         value={5}                         sub="วันต่อเนื่อง" subColor="var(--yellow)"/>
              </div>

              {/* Level progress */}
              <div className={ui.card} style={{marginBottom:14}}>
                <SecH>📈 ความก้าวหน้าแต่ละระดับ</SecH>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:10,marginTop:4}}>
                  {[1,2,3,4,5].map(lv=>{
                    const lvSess=SESSIONS.filter(s=>s.level===lv)
                    const done=lvSess.reduce((a,s)=>a+s.done,0)
                    const total=lvSess.reduce((a,s)=>a+s.exCount,0)
                    const pct=total>0?Math.round(done/total*100):0
                    return (
                      <div key={lv} onClick={()=>{setTab('session');setLevel(lv)}} style={{cursor:'pointer',padding:'14px 12px',borderRadius:12,border:`2px solid ${BLOOM[lv].border}`,background:BLOOM[lv].bg+'55',textAlign:'center',transition:'transform .1s'}}
                        onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
                        onMouseOut={e=>e.currentTarget.style.transform=''}>
                        <div style={{fontSize:11,fontWeight:800,color:BLOOM[lv].color,marginBottom:4}}>{BLOOM[lv].label}</div>
                        <div style={{fontSize:22,fontWeight:800,color:BLOOM[lv].color,lineHeight:1}}>{pct}<span style={{fontSize:11}}>%</span></div>
                        <div style={{fontSize:9,color:'var(--text2)',marginTop:4}}>{done}/{total} ข้อ</div>
                        <div style={{width:'100%',height:4,background:'rgba(0,0,0,.08)',borderRadius:99,overflow:'hidden',marginTop:6}}>
                          <div style={{height:'100%',width:`${pct}%`,background:BLOOM[lv].color,borderRadius:99}}/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sessions in progress */}
              <div className={ui.card}>
                <SecH>🎯 Session ที่กำลังเรียน <Btn variant="secondary" size="sm" onClick={()=>setTab('session')}>ดูทั้งหมด →</Btn></SecH>
                {SESSIONS.filter(ss=>ss.done>0&&ss.done<ss.exCount).map(ss=>(
                  <div key={ss.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,border:`1px solid ${BLOOM[ss.level].border}`,background:BLOOM[ss.level].bg+'33',marginBottom:8}}>
                    <span style={{fontSize:8,fontWeight:700,color:BLOOM[ss.level].color,background:BLOOM[ss.level].bg,border:`1px solid ${BLOOM[ss.level].border}`,borderRadius:99,padding:'2px 8px',whiteSpace:'nowrap'}}>{BLOOM[ss.level].label}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13}}>{ss.name}</div>
                      <div style={{fontSize:9,color:'var(--text2)'}}>{ss.obj}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <BAR val={ss.done} max={ss.exCount} color={BLOOM[ss.level].color}/>
                      <span style={{fontSize:10,color:'var(--text2)',minWidth:36}}>{ss.done}/{ss.exCount}</span>
                      <Btn variant="primary" size="sm" onClick={()=>onNavigate('editor')}>ทำต่อ</Btn>
                    </div>
                  </div>
                ))}
                {SESSIONS.filter(ss=>ss.done>0&&ss.done<ss.exCount).length===0&&(
                  <div style={{textAlign:'center',padding:'20px 0',color:'var(--text2)',fontSize:12}}>🎉 ทำ Session ที่เริ่มไว้ครบแล้ว!</div>
                )}
              </div>

              {/* Recent results */}
              <div className={ui.card}>
                <SecH>📋 ผลล่าสุด <Btn variant="secondary" size="sm" onClick={()=>setTab('history')}>ดูทั้งหมด →</Btn></SecH>
                <table className={ui.tbl}>
                  <thead><tr><th>โจทย์</th><th>Session</th><th>คะแนน</th><th>ผลตรวจ</th><th>วันที่</th><th></th></tr></thead>
                  <tbody>{HISTORY.slice(0,3).map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.ex}</td>
                      <td style={{fontSize:10,color:'var(--text2)'}}>{r.ss}</td>
                      <td><span style={{fontWeight:700,color:r.score>=80?'var(--green)':'#d97706'}}>{r.score}</span></td>
                      <td><span className={`${ui.badge} ${ui.badgeGreen}`}>{r.judge}</span></td>
                      <td style={{fontSize:10}}>{r.t.split(' ')[0]}</td>
                      <td><Btn variant="secondary" size="xs" onClick={()=>onNavigate('result')}>ดูผล</Btn></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </>}

            {/* ── SESSION ── */}
            {tab==='session' && (
              <div className={ui.card}>
                {!selLevel ? <>
                  <SecH>📚 เลือก Level ที่ต้องการเรียน</SecH>
                  {[1,2,3,4,5].map(lv=>{
                    const lvSess=SESSIONS.filter(s=>s.level===lv)
                    const done=lvSess.reduce((a,s)=>a+s.done,0)
                    const total=lvSess.reduce((a,s)=>a+s.exCount,0)
                    return (
                      <div key={lv} onClick={()=>setLevel(lv)} style={{cursor:'pointer',padding:'18px 20px',borderRadius:12,border:`2px solid ${BLOOM[lv].border}`,background:BLOOM[lv].bg+'44',marginBottom:12}}
                        onMouseOver={e=>e.currentTarget.style.background=BLOOM[lv].bg+'88'}
                        onMouseOut={e=>e.currentTarget.style.background=BLOOM[lv].bg+'44'}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                              <span style={{fontSize:12,fontWeight:800,color:BLOOM[lv].color,background:BLOOM[lv].bg,border:`1px solid ${BLOOM[lv].border}`,borderRadius:99,padding:'3px 12px'}}>{BLOOM[lv].label}</span>
                              <span style={{fontSize:11,color:BLOOM[lv].color,fontWeight:500}}>{BLOOM[lv].th}</span>
                            </div>
                            <div style={{fontSize:11,color:'var(--text2)'}}>{lvSess.length} Sessions · {total} โจทย์</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontSize:16,fontWeight:800,color:BLOOM[lv].color}}>{done}/{total} ข้อ</div>
                            <BAR val={done} max={total||1} color={BLOOM[lv].color}/>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </> : <>
                  <SecH>
                    <Btn variant="secondary" size="xs" onClick={()=>setLevel(null)}>← กลับ</Btn>
                    &nbsp;<span style={{color:BLOOM[selLevel].color}}>{BLOOM[selLevel].label} — {BLOOM[selLevel].th}</span>
                  </SecH>
                  {levelSessions.map(ss=>(
                    <div key={ss.id} style={{padding:'16px',borderRadius:12,border:`1px solid ${BLOOM[ss.level].border}`,background:BLOOM[ss.level].bg+'33',marginBottom:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                        <div>
                          <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{ss.name}</div>
                          <div style={{fontSize:10,color:'var(--text2)',marginBottom:6}}>{ss.obj}</div>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <BAR val={ss.done} max={ss.exCount||1} color={BLOOM[ss.level].color}/>
                            <span style={{fontSize:10,color:'var(--text2)'}}>{ss.done}/{ss.exCount} ข้อ</span>
                          </div>
                        </div>
                        <Btn variant="primary" size="sm" onClick={()=>onNavigate('editor')}>เริ่มทำ →</Btn>
                      </div>
                      <div style={{borderTop:`1px solid ${BLOOM[ss.level].border}`,paddingTop:10}}>
                        {(EXERCISES[ss.id]||[]).map((ex,i)=>(
                          <div key={ex.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:8,background:ex.done?'rgba(22,163,74,.06)':'rgba(255,255,255,.7)',marginBottom:6,border:ex.done?'1px solid #86efac':'1px solid rgba(0,0,0,.06)'}}>
                            <div style={{fontSize:14,minWidth:20}}>{ex.done?'✅':'⬜'}</div>
                            <div style={{fontWeight:600,fontSize:12,minWidth:20,color:BLOOM[ex.diff].color}}>#{i+1}</div>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:600,fontSize:12}}>{ex.title}
                                <span style={{fontSize:9,color:'var(--text2)',fontWeight:400,marginLeft:8}}>{ex.time} นาที</span>
                              </div>
                              <div style={{fontSize:10,color:'var(--text2)',marginTop:1}}>{ex.desc}</div>
                            </div>
                            <Btn variant={ex.done?"secondary":"primary"} size="xs" onClick={()=>onNavigate('editor')}>{ex.done?'ทำอีกครั้ง':'ทำโจทย์'}</Btn>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>}
              </div>
            )}

            {/* ── HISTORY ── */}
            {tab==='history' && <>
              <div className={s.row}>
                <StatCard icon="📤" title="ส่งทั้งหมด" value={HISTORY.length} sub="ครั้ง"/>
                <StatCard icon="💯" title="คะแนนสูงสุด" value={Math.max(...HISTORY.map(r=>r.score||0))} sub="คะแนน" subColor="var(--green)"/>
                <StatCard icon="📊" title="คะแนนเฉลี่ย" value={avgScore} sub="คะแนน"/>
                <StatCard icon="🔁" title="Run เฉลี่ย" value={(HISTORY.reduce((a,r)=>a+(r.rc||0),0)/HISTORY.length).toFixed(1)} sub="ครั้งต่อโจทย์"/>
              </div>
              <div className={ui.card}>
                <SecH>📋 ประวัติและผลการทำโจทย์ทั้งหมด</SecH>
                <table className={ui.tbl}>
                  <thead>
                    <tr>
                      <th>โจทย์</th><th>Session</th><th>Level</th>
                      <th>ครั้งที่ Run</th><th>คะแนน</th><th>ผลตรวจ</th>
                      <th>วันที่และเวลา</th><th></th>
                    </tr>
                  </thead>
                  <tbody>{HISTORY.map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.ex}</td>
                      <td style={{fontSize:10,color:'var(--text2)'}}>{r.ss}</td>
                      <td><span style={{fontSize:8,fontWeight:700,color:BLOOM[r.lv].color,background:BLOOM[r.lv].bg,border:`1px solid ${BLOOM[r.lv].border}`,borderRadius:99,padding:'1px 7px'}}>{BLOOM[r.lv].label}</span></td>
                      <td style={{textAlign:'center'}}><span className={s.rcBadge}>{r.rc}</span></td>
                      <td><span style={{fontWeight:700,color:r.score>=80?'var(--green)':'#d97706'}}>{r.score}</span></td>
                      <td><span className={`${ui.badge} ${r.judge==='Accepted'?ui.badgeGreen:ui.badgeYellow}`}>{r.judge}</span></td>
                      <td className={s.mono} style={{fontSize:10,whiteSpace:'nowrap'}}>{r.t}</td>
                      <td><Btn variant="secondary" size="xs" onClick={()=>onNavigate('result')}>ดูผล</Btn></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </>}

            {/* ── PROFILE ── */}
            {tab==='profile' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'start'}}>
                <div className={ui.card}>
                  <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>
                    <Avatar letter="ธ" bg="var(--yellow-light)" color="#ca8a04" size={52}/>
                    <div>
                      <div style={{fontWeight:800,fontSize:17}}>student_ธนา</div>
                      <div style={{fontSize:11,color:'var(--text2)',marginTop:2}}>ม.อ. หาดใหญ่ · วิทยาศาสตร์ · วิทยาการคอมพิวเตอร์</div>
                      <div style={{fontSize:10,color:'var(--text2)',marginTop:2}}>สมัครเมื่อ 01/02/68</div>
                    </div>
                  </div>
                  <div className={ui.row}>
                    <div className={ui.col}><InputGroup label="Username"><input className={ui.inp} defaultValue="student_ธนา"/></InputGroup></div>
                    <div className={ui.col}><InputGroup label="เพศ"><select className={ui.inp}><option>Male — ชาย</option><option>Female — หญิง</option><option>Other</option></select></InputGroup></div>
                  </div>
                  <InputGroup label="วันเกิด"><input className={ui.inp} type="date" defaultValue="2003-11-05"/></InputGroup>
                  <div className={ui.row}>
                    <div className={ui.col}><InputGroup label="คณะ"><input className={ui.inp} defaultValue="วิทยาศาสตร์" readOnly/></InputGroup></div>
                    <div className={ui.col}><InputGroup label="สาขา"><input className={ui.inp} defaultValue="วิทยาการคอมพิวเตอร์" readOnly/></InputGroup></div>
                  </div>
                  <InputGroup label="Password ใหม่"><input className={ui.inp} type="password" placeholder="ปล่อยว่างถ้าไม่เปลี่ยน"/></InputGroup>
                  <Btn variant="primary" full onClick={()=>toast('✅ บันทึกสำเร็จ')}>💾 บันทึกข้อมูล</Btn>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className={ui.card}>
                    <SecH>📊 สถิติของฉัน</SecH>
                    {[
                      {label:'โจทย์ที่ทำ',    val:`${totalDone} / ${totalEx} ข้อ`, color:'var(--accent)'},
                      {label:'คะแนนเฉลี่ย',  val:`${avgScore} / 100`,              color:'var(--green)'},
                      {label:'ส่งสำเร็จ',     val:`${HISTORY.length} ครั้ง`,        color:'var(--green)'},
                      {label:'Run เฉลี่ย',   val:`${(HISTORY.reduce((a,r)=>a+(r.rc||0),0)/HISTORY.length).toFixed(1)} ครั้ง/โจทย์`, color:'#d97706'},
                    ].map(r=>(
                      <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)',fontSize:12}}>
                        <span style={{color:'var(--text2)'}}>{r.label}</span>
                        <span style={{fontWeight:700,color:r.color}}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className={ui.card}>
                    <SecH>🏆 ความก้าวหน้า</SecH>
                    {[1,2,3,4,5].map(lv=>{
                      const lvSess=SESSIONS.filter(s=>s.level===lv)
                      const done=lvSess.reduce((a,s)=>a+s.done,0)
                      const total=lvSess.reduce((a,s)=>a+s.exCount,0)
                      return (
                        <div key={lv} style={{marginBottom:10}}>
                          <div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginBottom:3}}>
                            <span style={{color:BLOOM[lv].color,fontWeight:600}}>{BLOOM[lv].label}</span>
                            <span style={{color:'var(--text2)'}}>{done}/{total}</span>
                          </div>
                          <div style={{width:'100%',height:6,background:'rgba(0,0,0,.07)',borderRadius:99,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${total>0?done/total*100:0}%`,background:BLOOM[lv].color,borderRadius:99}}/>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Frame>
  )
}
