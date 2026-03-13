import { useState } from 'react'
import { Modal, Btn, RoleBadge, InputGroup, Avatar, toast, ui } from './UI'
import { useRoleRequest } from '../context/RoleRequestContext'
import s from './RoleRequestModals.module.css'

/* ══ Student: Request modal ══════════════════════ */
export function RoleRequestModal({ open, onClose }) {
  const { submitRequest } = useRoleRequest()
  const [role, setRole]     = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (!role)               { toast('⚠️ กรุณาเลือก Role ที่ต้องการ'); return }
    if (reason.length < 10)  { toast('⚠️ กรุณากรอกเหตุผลอย่างน้อย 10 ตัวอักษร'); return }
    const id = submitRequest(role, reason)
    toast(`📤 ส่ง Role Request สำเร็จ — INSERT RoleRequestDB (${id}) status: pending`)
    setRole(''); setReason(''); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} width={460}>
      <div className={ui.modalTitle}>🔄 ขอเปลี่ยน Role</div>
      <div className={ui.modalSub}>ส่ง request ไปยัง Teacher / Admin เพื่ออนุมัติ · ระบบจะ <strong>ไม่เปลี่ยน Role ทันที</strong></div>

      <div className={s.curRole}>
        🔒 Role ปัจจุบัน: <strong>ROLE03 — User (นักเรียน)</strong>
      </div>

      <InputGroup label="Role ที่ต้องการขอ" required>
        <select className={ui.inp} value={role} onChange={e => setRole(e.target.value)}>
          <option value="">-- เลือก Role ที่ต้องการ --</option>
          <option value="ROLE02">ROLE02 — Teacher (อาจารย์/ผู้สอน)</option>
          <option value="ROLE01">ROLE01 — Admin (ผู้ดูแลระบบ)</option>
        </select>
      </InputGroup>

      {role === 'ROLE02' && (
        <div className={`${s.warnBox} ${s.warnGreen}`}>
          ✅ <strong>ROLE02 Teacher</strong> — Teacher อนุมัติได้ · ระยะเวลา 1-3 วันทำการ
          <div style={{ marginTop: 4, color: '#059669' }}>สิทธิ์ใหม่: สร้างโจทย์, จัดการ Session, ดูผลนักเรียน</div>
        </div>
      )}
      {role === 'ROLE01' && (
        <div className={`${s.warnBox} ${s.warnRed}`}>
          ⚠️ <strong>ROLE01 Admin</strong> — ต้องรอ <strong>Admin</strong> เท่านั้น · จะตรวจสอบตัวตนเพิ่มเติม
        </div>
      )}

      <InputGroup label="เหตุผลที่ขอเปลี่ยน" required>
        <textarea className={ui.inp} rows={3} style={{ resize:'vertical' }}
          placeholder="เช่น ฉันเป็นอาจารย์สอนวิชา Python ต้องการสร้างโจทย์..."
          value={reason} onChange={e => setReason(e.target.value)} />
      </InputGroup>

      <div className={s.dbNote}>
        💾 จะ INSERT ลง <strong>RoleRequestDB</strong>: status = <code>pending</code> · reviewed_by = NULL
      </div>

      <div className={s.actions}>
        <Btn variant="secondary" full onClick={onClose}>ยกเลิก</Btn>
        <Btn variant="primary"   full onClick={handleSubmit}>📤 ส่ง Request</Btn>
      </div>
    </Modal>
  )
}

/* ══ Admin: Approve modal ════════════════════════ */
export function ApproveModal({ open, onClose, request, reviewer = 'admin_สมชาย' }) {
  const { approveRequest, rejectRequest } = useRoleRequest()
  const [note, setNote] = useState('')
  if (!request) return null

  const handleApprove = () => {
    approveRequest(request.id, reviewer)
    toast(`✅ อนุมัติ ${request.username} เป็น ${request.toLabel} — UPDATE UserprofileDB + INSERT ActivityDB`)
    setNote(''); onClose()
  }
  const handleReject = () => {
    rejectRequest(request.id, reviewer)
    toast(`❌ ปฏิเสธ ${request.username} — UPDATE RoleRequestDB.status = rejected`)
    setNote(''); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} width={500}>
      <div className={ui.modalTitle}>⚖️ พิจารณา Role Request</div>
      <div className={ui.modalSub}>request_id: <span style={{ fontFamily:'JetBrains Mono',color:'var(--accent)' }}>{request.id}</span></div>

      <div className={s.infoBox}>
        <div className={s.infoRow}>
          <Avatar letter={request.avatar} bg="#fef9c3" color="#ca8a04" size={36} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:13 }}>{request.username}</div>
            <div style={{ fontSize:10, color:'var(--text2)' }}>{request.uni}</div>
          </div>
          <div style={{ textAlign:'right', fontSize:10, color:'var(--text2)' }}>
            <div>{request.id}</div><div>{request.submitted}</div>
          </div>
        </div>
        <div className={s.roleArrow}>
          <RoleBadge role={request.from} />
          <span style={{ color:'var(--text2)', fontSize:16 }}>→</span>
          <RoleBadge role={request.to} />
          <span style={{ marginLeft:'auto', fontSize:10, color:'var(--text2)' }}>
            {request.to === 'ROLE02' ? 'ผู้อนุมัติ: Teacher / Admin' : 'ผู้อนุมัติ: Admin เท่านั้น'}
          </span>
        </div>
        <div className={s.reasonBox}>
          <span className={s.reasonLabel}>📝 เหตุผลของผู้ขอ</span>
          {request.reason}
        </div>
      </div>

      <InputGroup label="หมายเหตุ (ถ้ามี)">
        <input className={ui.inp} placeholder="เช่น ยืนยันตัวตนเรียบร้อย / ขอเอกสารเพิ่มเติม..."
          value={note} onChange={e => setNote(e.target.value)} />
      </InputGroup>

      <div className={s.dbNote}>
        ✅ อนุมัติ → UPDATE <strong>UserprofileDB.RoleId</strong> + UPDATE <strong>RoleRequestDB.status</strong>='approved' + INSERT <strong>ActivityDB</strong> event_type='role_change'<br />
        ❌ ปฏิเสธ → UPDATE RoleRequestDB.status='rejected' เท่านั้น
      </div>

      <div className={s.actions}>
        <Btn variant="secondary" full onClick={onClose}>ยกเลิก</Btn>
        <Btn variant="red"       full onClick={handleReject}>❌ ปฏิเสธ</Btn>
        <Btn variant="green"     full onClick={handleApprove}>✅ อนุมัติ</Btn>
      </div>
    </Modal>
  )
}

/* ══ Teacher: Inline approve/reject ══════════════ */
export function InlineReview({ request, reviewer }) {
  const { approveRequest, rejectRequest } = useRoleRequest()
  return (
    <div style={{ display:'flex', gap:6 }}>
      <Btn variant="red" size="xs" onClick={() => { rejectRequest(request.id, reviewer); toast(`❌ ปฏิเสธ ${request.username} — UPDATE RoleRequestDB.status = rejected`) }}>ปฏิเสธ</Btn>
      <Btn variant="green" size="xs" onClick={() => { approveRequest(request.id, reviewer); toast(`✅ อนุมัติ ${request.username} — UPDATE UserprofileDB + INSERT ActivityDB`) }}>อนุมัติ</Btn>
    </div>
  )
}
