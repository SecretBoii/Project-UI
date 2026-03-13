import { useState } from 'react'
import { Frame, Modal, Btn, Badge, toast } from '../components/UI'
import { ui } from '../components/UI'
import s from './CodeEditorPage.module.css'

const EXERCISE = {
  id: 7,
  title: 'ตรวจสอบผลการสอบ',
  session: 'Conditions & Operators · Lv.3 Apply',
  seq: '1/3',
  diff: 3,
  diffLabel: 'Apply',
  topic: 'if-else, comparison',
  skills: ['if-else','comparison','input()'],
  time: 15,
  desc: 'จงเขียนโปรแกรมรับคะแนน (0–100) หากคะแนนมากกว่าหรือเท่ากับ 50 ให้แสดงผลว่า "Pass" หากต่ำกว่านั้นให้แสดงผลว่า "Fail"',
  example_input: '72',
  example_output: 'Pass',
  hint: 'ใช้ if score >= 50: แล้วตามด้วย else: ถ้า input คืน str ต้องแปลงเป็น int ก่อน',
}

const BLOOM_COLOR = { 1:'#0369a1', 2:'#065f46', 3:'#92400e', 4:'#6d28d9', 5:'#9f1239' }
const BLOOM_BG    = { 1:'#e0f2fe', 2:'#d1fae5', 3:'#fef3c7', 4:'#ede9fe', 5:'#ffe4e6' }

const CODE_LINES = [
  { tokens: [['kw','score '],['op','= '],['fn','int'],['','('],['fn','input'],['','('],['str','"กรอกคะแนน: "'],['','))']] },
  { tokens: [['','']] },
  { tokens: [['kw','if '],['','score '],['op','>='],['num',' 50'],['kw',':']] },
  { tokens: [['fn','    print'],['','('],['str','"Pass"'],['',')']] },
  { tokens: [['kw','else'],['kw',':']] },
  { tokens: [['fn','    print'],['','('],['str','"Fail"'],['',')']] },
]

function CodeLine({ tokens, n }) {
  return (
    <div className={s.lineRow}>
      <span className={s.lineNo}>{n}</span>
      <span>
        {tokens.map(([type, text], i) => {
          const color = type==='kw'?'#c084fc':type==='fn'?'#60a5fa':type==='num'?'#fb923c':type==='str'?'#4ade80':type==='op'?'#f472b6':'#f1f5f9'
          return <span key={i} style={{color}}>{text}</span>
        })}
      </span>
    </div>
  )
}

export default function CodeEditorPage({ onNavigate }) {
  const [runCount,   setRunCount]   = useState(0)
  const [runs,       setRuns]       = useState([])
  const [activeRun,  setActiveRun]  = useState(null)
  const [hintOpen,   setHintOpen]   = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [resultOpen, setResultOpen] = useState(false)

  const RESULTS = [
    { variant:'red',    label:'❌ Error',   output:'—', stderr:'ValueError: invalid literal for int()' },
    { variant:'yellow', label:'⚠️ ผิด',    output:'Pass', stderr:'— expected: Fail for input 30' },
    { variant:'green',  label:'✅ ผ่าน',    output:'Pass', stderr:'—' },
  ]

  const handleRun = () => {
    const n = runCount + 1
    const res = RESULTS[Math.min(n-1, RESULTS.length-1)]
    setRunCount(n)
    setRuns(r => [...r, { n, ...res }])
    setActiveRun(n)
    toast(`▶ Run #${n}`)
  }

  const handleSubmit = () => {
    setSubmitOpen(false)
    setResultOpen(true)
  }

  const curRun = runs.find(r => r.n === activeRun)

  return (
    <Frame url="pylearn.app/exercise">
      <div className={s.shell}>

        {/* ── Problem panel ── */}
        <div className={s.problem}>
          <div className={s.problemHead}>
            <Btn variant="secondary" size="sm" onClick={() => onNavigate('student')}>← กลับ</Btn>
            <div style={{flex:1,marginLeft:10}}>
              <div className={s.problemMeta}>{EXERCISE.session} · ข้อ {EXERCISE.seq}</div>
              <div className={s.problemTitle}>{EXERCISE.title}</div>
            </div>
            <span style={{fontSize:9,fontWeight:700,color:BLOOM_COLOR[EXERCISE.diff],background:BLOOM_BG[EXERCISE.diff],border:`1px solid ${BLOOM_BG[EXERCISE.diff]}`,borderRadius:99,padding:'3px 10px'}}>
              Lv.{EXERCISE.diff} {EXERCISE.diffLabel}
            </span>
          </div>

          <div className={s.problemBody}>
            <div className={s.sectionLabel}>โจทย์</div>
            <p style={{lineHeight:1.75,marginBottom:14,fontSize:12}}>{EXERCISE.desc}</p>

            <div className={s.sectionLabel}>ตัวอย่าง</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
              <div className={ui.codeArea} style={{fontSize:11}}>
                <div style={{color:'#9ca3af',marginBottom:4}}>Input</div>
                <div style={{color:'#fb923c'}}>{EXERCISE.example_input}</div>
              </div>
              <div className={ui.codeArea} style={{fontSize:11}}>
                <div style={{color:'#9ca3af',marginBottom:4}}>Output</div>
                <div style={{color:'#4ade80'}}>{EXERCISE.example_output}</div>
              </div>
            </div>

            <div className={s.sectionLabel}>ทักษะ</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:14}}>
              {EXERCISE.skills.map(t => <Badge key={t} variant="gray">{t}</Badge>)}
            </div>

            <div style={{fontSize:10,color:'var(--text2)',marginBottom:12}}>
              ⏱ เวลาที่กำหนด: <strong>{EXERCISE.time} นาที</strong>
            </div>

            <div className={`${s.hintBox} ${hintOpen ? s.hintUnlocked : s.hintLocked}`}>
              {hintOpen ? '💡 '+EXERCISE.hint : '🔒 กด "แสดง Hint" เพื่อดูคำใบ้'}
            </div>
            <Btn variant="secondary" full size="sm"
              style={{borderColor:'#fde68a',color:'#92400e',marginTop:6}}
              onClick={() => { setHintOpen(true); toast('💡 Hint ปลดล็อกแล้ว') }}>
              💡 แสดง Hint
            </Btn>
          </div>
        </div>

        {/* ── Editor + Output ── */}
        <div className={s.editorArea}>
          <div className={s.editorToolbar}>
            <div className={s.toolbarLeft}>
              <span className={s.langBadge}>Python 3.11</span>
              <span style={{fontSize:10,color:'var(--text2)'}}>solution.py</span>
              {runCount > 0 && <span style={{fontSize:10,color:'#fb923c',fontWeight:600}}>Run ไปแล้ว {runCount} ครั้ง</span>}
            </div>
            <div className={s.toolbarRight}>
              <Btn variant="secondary" size="sm" onClick={handleRun}>▶ Run</Btn>
              <Btn variant="primary"   size="sm" onClick={() => setSubmitOpen(true)} disabled={runCount===0}>📤 Submit</Btn>
            </div>
          </div>

          <div className={s.codeEditor}>
            {CODE_LINES.map((line, i) => <CodeLine key={i} tokens={line.tokens} n={i+1}/>)}
          </div>

          <div className={s.outputPanel}>
            {runs.length === 0 ? (
              <div style={{padding:'20px',textAlign:'center',color:'var(--text2)',fontSize:11}}>
                กด ▶ Run เพื่อทดสอบโค้ด
              </div>
            ) : <>
              <div className={s.outputTabs}>
                {runs.map(r => (
                  <button key={r.n}
                    className={`${ui.navTab}${activeRun===r.n?' '+ui.navTabActive:''}`}
                    style={{fontSize:11,padding:'6px 12px'}}
                    onClick={()=>setActiveRun(r.n)}>
                    <span style={{color:r.variant==='green'?'#4ade80':r.variant==='red'?'#f87171':'#fbbf24'}}>●</span>
                    {' '}Run {r.n}
                  </button>
                ))}
              </div>
              {curRun && (
                <div className={s.outputContent}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                    <Badge variant={curRun.variant}>{curRun.label}</Badge>
                  </div>
                  <div className={s.outputLabel}>OUTPUT</div>
                  <div className={`${s.outputBox} ${s.outputNormal}`}>{curRun.output}</div>
                  {curRun.stderr !== '—' && <>
                    <div className={s.outputLabel}>STDERR</div>
                    <div className={`${s.outputBox} ${s.outputErr}`}>{curRun.stderr}</div>
                  </>}
                </div>
              )}
            </>}
          </div>
        </div>
      </div>

      {/* Submit modal */}
      <Modal open={submitOpen} onClose={() => setSubmitOpen(false)} width={380}>
        <div className={ui.modalTitle}>📤 ยืนยันการส่งคำตอบ</div>
        <div className={ui.modalSub}>ระบบจะตรวจสอบโค้ดและให้คะแนนโดยอัตโนมัติ</div>
        <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:10,padding:'14px 16px',margin:'14px 0',textAlign:'center'}}>
          <div style={{fontSize:11,color:'#15803d',marginBottom:4}}>ทดสอบแล้ว {runCount} ครั้ง</div>
          <div style={{fontSize:22,fontWeight:800,color:'#15803d'}}>{EXERCISE.title}</div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <Btn variant="secondary" full onClick={() => setSubmitOpen(false)}>ยกเลิก</Btn>
          <Btn variant="primary"   full onClick={handleSubmit}>📤 ส่งคำตอบ</Btn>
        </div>
      </Modal>

      {/* Result modal */}
      <Modal open={resultOpen} onClose={() => setResultOpen(false)} width={420}>
        <div className={ui.modalTitle}>🎉 ผลการตรวจ</div>
        <div style={{display:'flex',alignItems:'center',gap:16,background:'#f0fdf4',border:'1px solid #86efac',borderRadius:12,padding:'16px',margin:'14px 0'}}>
          <span style={{fontSize:40}}>✅</span>
          <div>
            <div style={{fontWeight:800,color:'#15803d',fontSize:18}}>ผ่าน!</div>
            <div style={{fontSize:11,color:'#16a34a',marginTop:2}}>{EXERCISE.title}</div>
          </div>
          <div style={{marginLeft:'auto',textAlign:'center'}}>
            <div style={{fontSize:32,fontWeight:800,color:'#1a1a2e'}}>88</div>
            <div style={{fontSize:10,color:'#6b7280'}}>คะแนน</div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
          {[
            {icon:'🔄',label:'ทดสอบ',value:runCount+' ครั้ง',color:'#f97316'},
            {icon:'🤖',label:'AI Score',value:'90/100',color:'var(--accent)'},
            {icon:'⚡',label:'ผลตรวจ',value:'Accepted',color:'#16a34a'},
            {icon:'⏱',label:'เวลาที่ใช้',value:'11 นาที',color:'#6b7280'},
          ].map(c=>(
            <div key={c.label} style={{background:'var(--surface2)',borderRadius:10,padding:'10px 12px',textAlign:'center'}}>
              <div style={{fontSize:18,marginBottom:4}}>{c.icon}</div>
              <div style={{fontSize:9,color:'var(--text2)',marginBottom:2}}>{c.label}</div>
              <div style={{fontWeight:700,fontSize:13,color:c.color}}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={{background:'#f8f9ff',border:'1px solid #e0e7ff',borderRadius:10,padding:'12px 14px',marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:'#3730a3',marginBottom:6}}>🤖 AI Feedback</div>
          <div style={{fontSize:11,color:'#374151',lineHeight:1.6}}>
            โค้ดถูกต้องและชัดเจน การใช้ <code style={{background:'#e0e7ff',padding:'1px 5px',borderRadius:4,color:'#4338ca'}}>int(input())</code> แปลงชนิดข้อมูลก่อนเปรียบเทียบเป็นสิ่งที่ถูกต้อง ลองเพิ่ม validation ตรวจสอบว่าคะแนนอยู่ในช่วง 0–100 เพื่อให้โปรแกรมสมบูรณ์ยิ่งขึ้น
          </div>
        </div>

        <div style={{display:'flex',gap:10}}>
          <Btn variant="secondary" full onClick={() => { setResultOpen(false); onNavigate('student') }}>กลับหน้าหลัก</Btn>
          <Btn variant="primary"   full onClick={() => { setResultOpen(false); onNavigate('result') }}>ดูผลเต็ม</Btn>
        </div>
      </Modal>
    </Frame>
  )
}
