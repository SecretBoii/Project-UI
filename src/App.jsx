import { useState } from 'react'
import { ToastProvider } from './components/UI'
import { ui } from './components/UI'
import { RoleRequestProvider } from './context/RoleRequestContext'

import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import AdminPage      from './pages/AdminPage'
import TeacherPage    from './pages/TeacherPage'
import StudentPage    from './pages/StudentPage'
import CodeEditorPage from './pages/CodeEditorPage'
import { ResultPage } from './pages/ResultSessionPages'

import s from './App.module.css'

const NAV = [
  { id:'login',    label:'① Login' },
  { id:'register', label:'② Register' },
  { id:'admin',    label:'③ Admin' },
  { id:'teacher',  label:'④ Teacher' },
  { id:'student',  label:'⑤ Student' },
]

export default function App() {
  const [page, setPage] = useState('login')

  return (
    <RoleRequestProvider>
      <ToastProvider />

      <div className={s.appTopbar}>
        <div className={s.appLogo}>
          <span className={s.appLogoIcon}>🐍</span>
          <span className={s.appLogoName}>PyLearn</span>
        </div>
        {NAV.map(t => (
          <button
            key={t.id}
            className={`${ui.navTab}${page === t.id ? ' ' + ui.navTabActive : ''}`}
            onClick={() => setPage(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.appContent}>
        {page === 'login'    && <LoginPage      onNavigate={setPage} />}
        {page === 'register' && <RegisterPage   onNavigate={setPage} />}
        {page === 'admin'    && <AdminPage      onNavigate={setPage} />}
        {page === 'teacher'  && <TeacherPage    onNavigate={setPage} />}
        {page === 'student'  && <StudentPage    onNavigate={setPage} />}
        {page === 'editor'   && <CodeEditorPage onNavigate={setPage} />}
        {page === 'result'   && <ResultPage     onNavigate={setPage} />}
      </div>
    </RoleRequestProvider>
  )
}
