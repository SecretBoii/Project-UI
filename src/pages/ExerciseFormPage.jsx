import { useState } from 'react'
import { Frame, Topbar, Sidebar, Avatar, SecH, Btn, InputGroup, toast, Badge } from '../components/UI'
import { ui } from '../components/UI'
import s from './ExerciseFormPage.module.css'
import ds from './DashboardShell.module.css'

const EMPTY = {
  title: '', topic: '', description: '', objective: '', skill: '',
  difficulty_level: '1', expected_time: '', answer_type: 'code',
  hint: '', status: 'draft', goals: [''],
}

export default function ExerciseFormPage({ onNavigate, editData = null }) {
  const isEdit = !!editData
  const [form, setForm] = useState(editData || EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const err = (k) => errors[k]

  /* Goals (ExerciseGoal table — composite PK) */
  const addGoal    = () => setForm(f => ({ ...f, goals: [...f.goals, ''] }))
  const setGoal    = (i, v) => setForm(f => { const g = [...f.goals]; g[i] = v; return { ...f, goals: g } })
  const removeGoal = (i) => setForm(f => ({ ...f, goals: f.goals.filter((_, idx) => idx !== i) }))

  /* Validation */
  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'กรุณากรอก Title'
    if (!form.topic.trim())       e.topic       = 'กรุณากรอก Topic'
    if (!form.description.trim()) e.description = 'กรุณากรอก Description'
    if (!form.objective.trim())   e.objective   = 'กรุณากรอก Objective'
    if (!form.skill.trim())       e.skill       = 'กรุณากรอก Skill'
    if (!form.expected_time)      e.expected_time = 'กรุณากรอกเวลา (นาที)'
    if (form.goals.some(g => !g.trim())) e.goals = 'Goal ต้องไม่ว่าง'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = (statusOverride) => {
    if (!validate()) { toast('❌ กรุณากรอกข้อมูลให้ครบ'); return }
    setSaving(true)
    const payload = { ...form, status: statusOverride || form.status }
    setTimeout(() => {
      setSaving(false)
      toast(statusOverride === 'active'
        ? '✅ เผยแพร่โจทย์แล้ว — status: active'
        : isEdit ? '✅ บันทึกการแก้ไขสำเร็จ' : '✅ บันทึก Draft สำเร็จ'
      )
      console.log('PAYLOAD →', payload)
      setTimeout(() => onNavigate('teacher'), 600)
    }, 800)
  }

  const TEACHER_TABS = [
    { id: 'dash',     label: '🏠 Dashboard' },
    { id: 'exs',      label: '📝 โจทย์ของฉัน' },
    { id: 'exform',   label: isEdit ? '✏️ แก้ไขโจทย์' : '➕ สร้างโจทย์', active: true },
    { id: 'results',  label: '📊 ผลนักเรียน' },
    { id: 'students', label: '👥 รายชื่อนักเรียน' },
    { id: 'profile',  label: '👤 โปรไฟล์' },
    { id: 'logout',   label: '🚪 ออกจากระบบ', danger: true },
  ]

  return (
    <Frame url={`pylearn.app/teacher/exercise/${isEdit ? 'edit' : 'new'}`}>
      <div className={ds.shell}>
        <Sidebar
          roleName="TEACHER"
          roleColor="var(--green)"
          tabs={TEACHER_TABS}
          activeTab="exform"
          onTabChange={(id) => {
            if (id === 'logout') { toast('👋 ออกจากระบบ'); setTimeout(() => onNavigate('login'), 500); return }
            if (id !== 'exform') onNavigate('teacher')
          }}
        />

        <div className={ds.main}>
          <Topbar
            title={isEdit ? '✏️ แก้ไขโจทย์' : '➕ สร้างโจทย์ใหม่'}
            right={
              <>
                <Btn variant="secondary" size="sm" onClick={() => setPreview(p => !p)}>
                  {preview ? '📝 Form' : '👁 Preview'}
                </Btn>
                <Avatar letter="ว" bg="var(--green-light)" color="var(--green)" />
              </>
            }
          />

          <div className={ds.content}>
            {preview ? (
              <PreviewCard form={form} onBack={() => setPreview(false)} />
            ) : (
              <div className={s.layout}>

                {/* ── LEFT: Main form ── */}
                <div className={s.mainCol}>

                  {/* Section 1 — Basic Info */}
                  <section className={s.section}>
                    <div className={s.sectionHead}>
                      <span className={s.sectionNum}>1</span>
                      <span>ข้อมูลพื้นฐาน</span>
                      <span className={s.sectionSub}>exercise_id จะ AUTO_INCREMENT</span>
                    </div>

                    <div className={s.row2}>
                      <InputGroup label="TITLE" required>
                        <input
                          className={`${s.inp} ${err('title') ? s.inpErr : ''}`}
                          placeholder="เช่น Fibonacci Sequence"
                          value={form.title}
                          onChange={e => set('title', e.target.value)}
                        />
                        {err('title') && <span className={s.errMsg}>{err('title')}</span>}
                      </InputGroup>

                      <InputGroup label="TOPIC" required>
                        <input
                          className={`${s.inp} ${err('topic') ? s.inpErr : ''}`}
                          placeholder="เช่น Loop, Function, Algorithm"
                          value={form.topic}
                          onChange={e => set('topic', e.target.value)}
                        />
                        {err('topic') && <span className={s.errMsg}>{err('topic')}</span>}
                      </InputGroup>
                    </div>

                    <InputGroup label="DESCRIPTION (โจทย์)" required>
                      <textarea
                        className={`${s.textarea} ${err('description') ? s.inpErr : ''}`}
                        rows={5}
                        placeholder="อธิบายโจทย์อย่างละเอียด เช่น&#10;จงเขียนฟังก์ชัน fibonacci(n) ที่รับจำนวนเต็ม n และคืนค่า Fibonacci ลำดับที่ n&#10;&#10;ตัวอย่าง:&#10;fibonacci(5) → 5&#10;fibonacci(10) → 55"
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                      />
                      {err('description') && <span className={s.errMsg}>{err('description')}</span>}
                    </InputGroup>

                    <InputGroup label="OBJECTIVE (จุดประสงค์การเรียนรู้)" required>
                      <textarea
                        className={`${s.textarea} ${err('objective') ? s.inpErr : ''}`}
                        rows={3}
                        placeholder="เช่น นักเรียนสามารถเขียน recursive function และเข้าใจ dynamic programming ได้"
                        value={form.objective}
                        onChange={e => set('objective', e.target.value)}
                      />
                      {err('objective') && <span className={s.errMsg}>{err('objective')}</span>}
                    </InputGroup>
                  </section>

                  {/* Section 2 — Skills & Difficulty */}
                  <section className={s.section}>
                    <div className={s.sectionHead}>
                      <span className={s.sectionNum}>2</span>
                      <span>ทักษะ &amp; ความยาก</span>
                    </div>

                    <div className={s.row2}>
                      <InputGroup label="SKILL (คั่นด้วย comma)" required>
                        <input
                          className={`${s.inp} ${err('skill') ? s.inpErr : ''}`}
                          placeholder="เช่น Loop, Recursion, List"
                          value={form.skill}
                          onChange={e => set('skill', e.target.value)}
                        />
                        {err('skill') && <span className={s.errMsg}>{err('skill')}</span>}
                        {form.skill && (
                          <div className={s.tagRow}>
                            {form.skill.split(',').map(sk => sk.trim()).filter(Boolean).map((sk, i) => (
                              <span key={i} className={s.skillTag}>{sk}</span>
                            ))}
                          </div>
                        )}
                      </InputGroup>

                      <div className={s.col2}>
                        <InputGroup label="DIFFICULTY LEVEL">
                          <div className={s.diffRow}>
                            {[['1','🟢 ง่าย'],['2','🟡 ปานกลาง'],['3','🔴 ยาก']].map(([v,label]) => (
                              <button
                                key={v}
                                className={`${s.diffBtn} ${form.difficulty_level === v ? s.diffBtnActive : ''}`}
                                style={form.difficulty_level === v ? {
                                  borderColor: v==='1'?'#0bbf7e':v==='2'?'#f59e0b':'#ef4444',
                                  background:  v==='1'?'#ecfdf5':v==='2'?'#fffbeb':'#fff5f5',
                                  color:       v==='1'?'#065f46':v==='2'?'#b45309':'#b91c1c',
                                } : {}}
                                onClick={() => set('difficulty_level', v)}
                              >{label}</button>
                            ))}
                          </div>
                        </InputGroup>

                        <InputGroup label="EXPECTED_TIME (นาที)" required>
                          <div className={s.timeRow}>
                            <input
                              type="number"
                              className={`${s.inp} ${s.inpSm} ${err('expected_time') ? s.inpErr : ''}`}
                              min="1" max="180"
                              placeholder="เช่น 20"
                              value={form.expected_time}
                              onChange={e => set('expected_time', e.target.value)}
                            />
                            <span className={s.timeUnit}>นาที</span>
                          </div>
                          {err('expected_time') && <span className={s.errMsg}>{err('expected_time')}</span>}
                        </InputGroup>
                      </div>
                    </div>
                  </section>

                  {/* Section 3 — Answer type + Hint */}
                  <section className={s.section}>
                    <div className={s.sectionHead}>
                      <span className={s.sectionNum}>3</span>
                      <span>รูปแบบคำตอบ &amp; คำใบ้</span>
                    </div>

                    <InputGroup label="ANSWER_TYPE">
                      <div className={s.typeRow}>
                        {[['code','💻 Code (Judge0 ตรวจ)'],['text','📝 Text (ตอบเป็นข้อความ)']].map(([v,label]) => (
                          <button
                            key={v}
                            className={`${s.typeBtn} ${form.answer_type === v ? s.typeBtnActive : ''}`}
                            onClick={() => set('answer_type', v)}
                          >{label}</button>
                        ))}
                      </div>
                    </InputGroup>

                    {form.answer_type === 'code' && (
                      <div className={s.infoBox}>
                        💡 <strong>Code type</strong> — นักเรียนจะพิมพ์ code ใน Editor แล้วกด Run (Judge0) / Submit<br/>
                        ผลจะถูก insert ลง <code>ActivityDB</code> พร้อม <code>judge0_status</code>, <code>run_count</code>, <code>score</code>
                      </div>
                    )}
                    {form.answer_type === 'text' && (
                      <div className={s.infoBox} style={{borderColor:'#bfdbfe',background:'#eff6ff'}}>
                        💡 <strong>Text type</strong> — นักเรียนพิมพ์คำตอบอิสระ ไม่ผ่าน Judge0<br/>
                        Teacher ตรวจเองหรือใช้ Gemini ช่วยประเมิน
                      </div>
                    )}

                    <InputGroup label="HINT (คำใบ้ — แสดงเมื่อนักเรียนกด hint_used)">
                      <textarea
                        className={s.textarea}
                        rows={3}
                        placeholder="เช่น ลองคิดว่า fibonacci(n) = fibonacci(n-1) + fibonacci(n-2)&#10;base case: fibonacci(0)=0, fibonacci(1)=1"
                        value={form.hint}
                        onChange={e => set('hint', e.target.value)}
                      />
                    </InputGroup>
                  </section>

                  {/* Section 4 — Goals (ExerciseGoal table) */}
                  <section className={s.section}>
                    <div className={s.sectionHead}>
                      <span className={s.sectionNum}>4</span>
                      <span>Exercise Goals</span>
                      <span className={s.sectionSub}>→ ExerciseGoal (exercise_id, Goal) composite PK</span>
                    </div>
                    {err('goals') && <div className={s.errMsg} style={{marginBottom:8}}>{err('goals')}</div>}
                    {form.goals.map((g, i) => (
                      <div key={i} className={s.goalRow}>
                        <span className={s.goalIdx}>{i + 1}</span>
                        <input
                          className={`${s.inp} ${s.goalInp} ${err('goals') && !g.trim() ? s.inpErr : ''}`}
                          placeholder={`Goal ${i+1} เช่น เขียน recursive function ได้`}
                          value={g}
                          onChange={e => setGoal(i, e.target.value)}
                        />
                        {form.goals.length > 1 && (
                          <button className={s.removeBtn} onClick={() => removeGoal(i)}>✕</button>
                        )}
                      </div>
                    ))}
                    <Btn variant="secondary" size="sm" onClick={addGoal}>+ เพิ่ม Goal</Btn>
                  </section>
                </div>

                {/* ── RIGHT: Status + Actions ── */}
                <div className={s.sideCol}>

                  {/* Status card */}
                  <div className={s.statusCard}>
                    <div className={s.statusCardHead}>📋 Status &amp; Actions</div>
                    <div className={s.statusCardBody}>
                      <InputGroup label="STATUS">
                        <div className={s.statusRow}>
                          {[['draft','📄 Draft'],['active','✅ Active'],['inactive','🔒 Inactive']].map(([v,label]) => (
                            <button
                              key={v}
                              className={`${s.statusBtn} ${form.status === v ? s.statusBtnActive : ''}`}
                              style={form.status === v ? {
                                borderColor: v==='active'?'#0bbf7e':v==='draft'?'#f59e0b':'#6b7280',
                                background:  v==='active'?'#ecfdf5':v==='draft'?'#fffbeb':'#f9fafb',
                                color:       v==='active'?'#065f46':v==='draft'?'#b45309':'#374151',
                              } : {}}
                              onClick={() => set('status', v)}
                            >{label}</button>
                          ))}
                        </div>
                      </InputGroup>

                      <div className={s.statusInfo}>
                        {form.status === 'draft'    && <><strong>Draft</strong> — ยังไม่เผยแพร่ นักเรียนมองไม่เห็น</>}
                        {form.status === 'active'   && <><strong>Active</strong> — นักเรียนเห็นและทำได้ทันที</>}
                        {form.status === 'inactive' && <><strong>Inactive</strong> — ซ่อนชั่วคราว</>}
                      </div>

                      <div className={s.actionBtns}>
                        <Btn variant="secondary" size="sm" full onClick={() => onNavigate('teacher')}>
                          ← ยกเลิก
                        </Btn>
                        <Btn
                          variant="secondary" size="sm" full
                          onClick={() => handleSave('draft')}
                          style={{opacity: saving ? .6 : 1}}
                        >
                          {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึก Draft'}
                        </Btn>
                        <Btn
                          variant="green" size="sm" full
                          onClick={() => handleSave('active')}
                          style={{opacity: saving ? .6 : 1}}
                        >
                          {saving ? '⏳...' : '🚀 เผยแพร่ (Active)'}
                        </Btn>
                      </div>
                    </div>
                  </div>

                  {/* DB mapping info */}
                  <div className={s.dbCard}>
                    <div className={s.dbCardHead}>🗄️ DB Mapping</div>
                    <div className={s.dbCardBody}>
                      <div className={s.dbRow}><span className={s.dbField}>exercise_id</span><span className={s.dbVal}>AUTO_INCREMENT</span></div>
                      <div className={s.dbRow}><span className={s.dbField}>title</span><span className={s.dbVal}>{form.title || <em className={s.dbEmpty}>ว่าง</em>}</span></div>
                      <div className={s.dbRow}><span className={s.dbField}>topic</span><span className={s.dbVal}>{form.topic || <em className={s.dbEmpty}>ว่าง</em>}</span></div>
                      <div className={s.dbRow}><span className={s.dbField}>difficulty</span><span className={s.dbVal}>{form.difficulty_level}</span></div>
                      <div className={s.dbRow}><span className={s.dbField}>answer_type</span><span className={s.dbVal}>{form.answer_type}</span></div>
                      <div className={s.dbRow}><span className={s.dbField}>expected_time</span><span className={s.dbVal}>{form.expected_time ? `${form.expected_time} นาที` : <em className={s.dbEmpty}>ว่าง</em>}</span></div>
                      <div className={s.dbRow}><span className={s.dbField}>status</span>
                        <span className={s.dbVal} style={{color: form.status==='active'?'#0bbf7e':form.status==='draft'?'#f59e0b':'#6b7280', fontWeight:700}}>
                          {form.status}
                        </span>
                      </div>
                      <div className={s.dbRow}><span className={s.dbField}>goals</span><span className={s.dbVal}>{form.goals.filter(Boolean).length} รายการ</span></div>
                      <div className={s.dbRow}><span className={s.dbField}>created_at</span><span className={s.dbVal} style={{color:'#bbb'}}>AUTO NOW()</span></div>
                    </div>
                  </div>

                  {/* Flow hint */}
                  <div className={s.flowCard}>
                    <div className={s.flowCardHead}>⚡ Flow หลังบันทึก</div>
                    <div className={s.flowStep}><span className={s.flowDot} style={{background:'#7c55f5'}}/>Teacher กด Save</div>
                    <div className={s.flowLine}/>
                    <div className={s.flowStep}><span className={s.flowDot} style={{background:'#7c55f5'}}/>POST /exercises (JWT · ROLE02)</div>
                    <div className={s.flowLine}/>
                    <div className={s.flowStep}><span className={s.flowDot} style={{background:'#f5832a'}}/>INSERT ExerciseDB</div>
                    <div className={s.flowLine}/>
                    <div className={s.flowStep}><span className={s.flowDot} style={{background:'#f5832a'}}/>INSERT ExerciseGoal ×{form.goals.filter(Boolean).length}</div>
                    {form.status === 'active' && <>
                      <div className={s.flowLine}/>
                      <div className={s.flowStep}><span className={s.flowDot} style={{background:'#0bbf7e'}}/>นักเรียนเห็นทันที ✅</div>
                    </>}
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

/* ── Preview Card ── */
function PreviewCard({ form, onBack }) {
  const diffColor = form.difficulty_level==='1'?'#0bbf7e':form.difficulty_level==='2'?'#f59e0b':'#ef4444'
  const diffLabel = form.difficulty_level==='1'?'ง่าย':form.difficulty_level==='2'?'ปานกลาง':'ยาก'
  return (
    <div style={{maxWidth:760,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <span style={{fontSize:13,fontWeight:700,color:'#1a1a2e'}}>👁 Preview — มุมมองนักเรียน</span>
        <Btn variant="secondary" size="sm" onClick={onBack}>← กลับแก้ไข</Btn>
      </div>
      <div style={{background:'#fff',borderRadius:14,border:'1.5px solid #e2e8f0',overflow:'hidden',boxShadow:'0 2px 20px rgba(0,0,0,.06)'}}>
        {/* header */}
        <div style={{padding:'20px 24px',borderBottom:'1px solid #f0f2f8'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <span style={{background:diffColor,color:'#fff',fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99}}>Level {form.difficulty_level} · {diffLabel}</span>
            <span style={{background:'#f0f4ff',color:'#4a7cff',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:99}}>{form.topic || 'Topic'}</span>
            <span style={{background:'#f5f3ff',color:'#7c55f5',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:99}}>{form.answer_type === 'code' ? '💻 Code' : '📝 Text'}</span>
            <span style={{marginLeft:'auto',fontSize:10,color:'#999'}}>⏱ {form.expected_time || '?'} นาที</span>
          </div>
          <h2 style={{fontSize:18,fontWeight:700,color:'#1a1a2e',margin:0}}>{form.title || '(ยังไม่มีชื่อ)'}</h2>
        </div>
        {/* body */}
        <div style={{padding:'20px 24px'}}>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:'#999',letterSpacing:1,marginBottom:6}}>DESCRIPTION</div>
            <pre style={{fontFamily:'inherit',fontSize:13,color:'#374151',whiteSpace:'pre-wrap',lineHeight:1.7,margin:0}}>{form.description || '(ไม่มี description)'}</pre>
          </div>
          {form.objective && (
            <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:8,padding:'12px 16px',marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#0369a1',marginBottom:4}}>🎯 OBJECTIVE</div>
              <div style={{fontSize:12,color:'#0c4a6e',lineHeight:1.6}}>{form.objective}</div>
            </div>
          )}
          {form.goals.filter(Boolean).length > 0 && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#999',letterSpacing:1,marginBottom:8}}>LEARNING GOALS</div>
              {form.goals.filter(Boolean).map((g, i) => (
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:6}}>
                  <span style={{width:20,height:20,borderRadius:'50%',background:'#ecfdf5',color:'#0bbf7e',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:12,color:'#374151',lineHeight:1.5}}>{g}</span>
                </div>
              ))}
            </div>
          )}
          {form.skill && (
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {form.skill.split(',').map(sk => sk.trim()).filter(Boolean).map((sk, i) => (
                <span key={i} style={{background:'#f5f3ff',color:'#7c55f5',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:99}}>{sk}</span>
              ))}
            </div>
          )}
        </div>
        {/* hint hidden */}
        {form.hint && (
          <details style={{padding:'0 24px 20px'}}>
            <summary style={{cursor:'pointer',fontSize:12,color:'#f59e0b',fontWeight:600}}>💡 ดูคำใบ้ (hint_used event)</summary>
            <div style={{marginTop:8,background:'#fffbeb',border:'1px solid #fde68a',borderRadius:8,padding:'12px 16px',fontSize:12,color:'#92400e',lineHeight:1.6}}>{form.hint}</div>
          </details>
        )}
      </div>
    </div>
  )
}
