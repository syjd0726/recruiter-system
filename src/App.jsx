import { useState } from 'react'
import Home from './pages/Home.jsx'
import BoardNew from './pages/BoardNew.jsx'
import BoardUp from './pages/BoardUp.jsx'
import DataList from './pages/DataList.jsx'
import MeetList from './pages/MeetList.jsx'
import MeetForm from './pages/MeetForm.jsx'
import DbReg from './pages/DbReg.jsx'
import Dropout from './pages/Dropout.jsx'
import Weekly from './pages/Weekly.jsx'

const SCREENS = {
  home: Home,
  boardNew: BoardNew,
  boardUp: BoardUp,
  dataList: DataList,
  meetList: MeetList,
  meetForm: MeetForm,
  dbReg: DbReg,
  dropout: Dropout,
  weekly: Weekly,
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [params, setParams] = useState({})

  function go(screenName, p = {}) {
    setScreen(screenName)
    setParams(p)
  }

  const Screen = SCREENS[screen] || Home

  return (
    <div style={{
      background: '#0F1117',
      minHeight: '100vh',
      maxWidth: 430,
      margin: '0 auto',
      fontFamily: 'sans-serif',
      color: '#E8EAFF',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Screen go={go} params={params} />
    </div>
  )
}