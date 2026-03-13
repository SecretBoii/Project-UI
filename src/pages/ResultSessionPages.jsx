import { useState } from 'react'
import { Frame, SecH, Btn, toast } from '../components/UI'
import { ui } from '../components/UI'
import s from './ResultSessionPages.module.css'

const BLOOM = {
  1:{label:'Lv.1 Remember', color:'#0369a1',bg:'#e0f2fe',border:'#bae6fd'},
  2:{label:'Lv.2 Understand',color:'#065f46',bg:'#d1fae5',border:'#6ee7b7'},
  3:{label:'Lv.3 Apply',    color:'#92400e',bg:'#fef3c7',border:'#fcd34d'},
  4:{label:'Lv.4 Analyse',  color:'#6d28d9',bg:'#ede9fe',border:'#c4b5fd'},
  5:{label:'Lv.5 Create',   color:'#9f1239',bg:'#ffe4e6',border:'#fda4af'},
}

export function ResultPage({ onNavigate }) {
  const score = 88
  const passed = score >= 50

  return (
    <Frame url="pylearn.app/result">
      <div style={{minHeight:520,background:'var(--surface2)',padding:'0 0 32px'}}>

        {/* Header */}
        <div style={{background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'14px 24px',display:'flex',alignItems:'center',gap:12}}>
          <Btn variant="secondary" size="sm" onClick={()=>onNavigate('student')}>← กลับ</Btn>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>ผลตรวจ — ประกาศตัวแปรและแสดงผล</div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
              <span style={{fontSize:9,fontWeight:700,color:BLOOM[1].color,background:BLOOM[1].bg,border:`1px solid ${BLOOM[1].border}`,borderRadius:99,padding:'1px 8px'}}>{BLOOM[1].label}</span>
              <span style={{fontSize:10,color:'var(--text2)'}}>Session: Variables & Types · 5 นาที</span>
            </div>
          </div>
        </div>

        <div style={{padding:'20px 24px',display:'grid',gridTemplateColumns:'220px 1fr',gap:16}}>

          {/* Score card */}
          <div style={{background:'var(--surface)',borderRadius:14,padding:'24px 16px',border:'1px solid var(--border)',textAlign:'center',boxShadow:'var(--shadow)',height:'fit-content'}}>
            <div style={{fontSize:52,fontWeight:800,color:passed?'#16a34a':'#dc2626',lineHeight:1}}>{score}</div>
            <div style={{fontSize:11,color:'var(--text2)',marginBottom:12}}>คะแนน</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:passed?'#f0fdf4':'#fff1f2',border:`1px solid ${passed?'#86efac':'#fca5a5'}`,color:passed?'#16a34a':'#dc2626',borderRadius:99,padding:'5px 14px',fontWeight:700,fontSize:12,marginBottom:16}}>
              {passed?'✅ ผ่าน':'❌ ไม่ผ่าน'}
            </div>
            <div style={{borderTop:'1px solid var(--border)',paddingTop:14,textAlign:'left'}}>
              {[
                {label:'ผลตรวจ',     val:'ถูกต้อง',    color:'#16a34a'},
                {label:'AI Score',   val:'90/100',     color:'var(--accent)'},
                {label:'ครั้งที่ Run', val:'3 ครั้ง',   color:'#d97706'},
                {label:'เวลาที่ใช้',  val:'6 นาที',    color:'var(--text)'},
                {label:'วันที่ส่ง',   val:'12/03/68',  color:'var(--text2)'},
                {label:'เวลาส่ง',    val:'09:30',      color:'var(--text2)'},
              ].map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:11}}>
                  <span style={{color:'var(--text2)'}}>{r.label}</span>
                  <span style={{fontWeight:600,color:r.color}}>{r.val}</span>
                </div>
              ))}
            </div>
            <Btn variant="primary" full size="sm" onClick={()=>onNavigate('editor')} style={{marginTop:8}}>ลองอีกครั้ง</Btn>
          </div>

          {/* Right side */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>

            {/* Output */}
            <div style={{background:'var(--surface)',borderRadius:12,border:'1px solid var(--border)',padding:'16px 20px'}}>
              <SecH>📤 ผลลัพธ์การรัน</SecH>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:4}}>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:'var(--text2)',marginBottom:6}}>OUTPUT ที่ได้</div>
                  <div style={{background:'#0f172a',color:'#4ade80',borderRadius:8,padding:'12px 14px',fontFamily:'JetBrains Mono,monospace',fontSize:12,lineHeight:1.7}}>
                    10<br/>Python
                  </div>
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:'var(--text2)',marginBottom:6}}>OUTPUT ที่ถูกต้อง</div>
                  <div style={{background:'#0f172a',color:'#94a3b8',borderRadius:8,padding:'12px 14px',fontFamily:'JetBrains Mono,monospace',fontSize:12,lineHeight:1.7}}>
                    10<br/>Python
                  </div>
                </div>
              </div>
            </div>

            {/* Code submitted */}
            <div style={{background:'var(--surface)',borderRadius:12,border:'1px solid var(--border)',padding:'16px 20px'}}>
              <SecH>💻 โค้ดที่ส่ง</SecH>
              <div style={{background:'#0f172a',color:'#e2e8f0',borderRadius:8,padding:'14px',fontFamily:'JetBrains Mono,monospace',fontSize:12,lineHeight:1.8,marginTop:4}}>
                <span style={{color:'#94a3b8'}}>x </span><span style={{color:'#f472b6'}}>=</span><span style={{color:'#94a3b8'}}> </span><span style={{color:'#fb923c'}}>10</span><br/>
                <span style={{color:'#94a3b8'}}>y </span><span style={{color:'#f472b6'}}>=</span><span style={{color:'#94a3b8'}}> </span><span style={{color:'#a3e635'}}>'Python'</span><br/>
                <span style={{color:'#60a5fa'}}>print</span><span style={{color:'#94a3b8'}}>(x)</span><br/>
                <span style={{color:'#60a5fa'}}>print</span><span style={{color:'#94a3b8'}}>(y)</span>
              </div>
            </div>

            {/* AI Feedback */}
            <div style={{background:'var(--surface)',borderRadius:12,border:'1px solid #c4b5fd',padding:'16px 20px',background:'#faf5ff'}}>
              <SecH>🤖 คำแนะนำจาก AI</SecH>
              <div style={{fontSize:12,color:'var(--text)',lineHeight:1.8,marginTop:4}}>
                โค้ดของคุณถูกต้องและทำงานได้ดี 🎉 การประกาศตัวแปรและแสดงผลทำได้ถูกต้อง
              </div>
              <div style={{marginTop:10,padding:'10px 14px',background:'#ede9fe',borderRadius:8,border:'1px solid #c4b5fd'}}>
                <div style={{fontSize:10,fontWeight:700,color:'#6d28d9',marginBottom:4}}>💡 คำแนะนำ</div>
                <div style={{fontSize:11,color:'#5b21b6',lineHeight:1.7}}>
                  ลองเพิ่ม comment อธิบายว่าตัวแปรแต่ละตัวเก็บข้อมูลอะไร จะทำให้โค้ดอ่านง่ายขึ้นสำหรับผู้อื่น
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Frame>
  )
}

export function SessionPage({ onNavigate }) {
  return null
}
