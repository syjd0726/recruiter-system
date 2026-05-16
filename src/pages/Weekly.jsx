import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'

const STAGES = ['찾기', '합자', '육따기', '영따기', '복음방', '센확', '수신']

const STAGE_COLORS = {
  '찾기': '#22C55E', '합자': '#F59E0B', '육따기': '#F97316',
  '영따기': '#EF4444', '복음방': '#A855F7', '센확': '#6366F1', '수신': '#0EA5E9',
}

function getWeekNo(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1)
  return Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7)
}

export default function Weekly({ go }) {
  const [tab, setTab] = useState('weekly')
  const [month, setMonth] = useState('2026-05')
  const [termType, setTermType] = useState('청년')
  const [weekNo, setWeekNo] = useState(getWeekNo())
  const [goals, setGoals] = useState({})
  const [achieved, setAchieved] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [month, termType, weekNo])

  async function loadData() {
    setLoading(true)
    try {
      // 목표 불러오기
      const { data: goalData } = await supabase
        .from('goals')
        .select('*')
        .eq('term_month', month)
        .eq('term_type', termType)
        .eq('week_no', weekNo)
        .eq('region', '요한2조')
        .single()

      if (goalData) {
        setGoals({
          weekly: goalData.weekly_goals || {},
          daily: goalData.daily_goals || {},
        })
      } else {
        setGoals({ weekly: {}, daily: {} })
      }

      // 이번 주 달성 불러오기
      const today = new Date()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const { data: reports } = await supabase
        .from('meet_reports')
        .select('stage_to')
        .eq('report_type', '전광판')
        .eq('is_cancelled', false)
        .gte('report_date', weekStart.toISOString().split('T')[0])
        .lte('report_date', weekEnd.toISOString().split('T')[0])

      if (reports) {
        const counts = {}
        reports.forEach(r => {
          counts[r.stage_to] = (counts[r.stage_to] || 0) + 1
        })
        setAchieved(counts)
      }

      // 누적 달성 불러오기 (탭이 accum일 때)
      const { data: allReports } = await supabase
        .from('meet_reports')
        .select('stage_to')
        .eq('report_type', '전광판')
        .eq('is_cancelled', false)

      if (allReports) {
        const counts = {}
        allReports.forEach(r => {
          counts[r.stage_to] = (counts[r.stage_to] || 0) + 1
        })
        setAchieved(counts)
      }

    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  function getPct(stage) {
    const goal = goals.weekly?.[stage] || 0
    const done = achieved[stage] || 0
    if (goal === 0) return 0
    return Math.min(Math.round(done / goal * 100), 100)
  }

  function getPctColor(pct) {
    if (pct >= 100) return '#22C55E'
    if (pct >= 50) return '#F59E0B'
    return '#EF4444'
  }

  const today = new Date().toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 네비 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px', borderBottom: '1px solid #2E3250' }}>
        <div onClick={() => go('home')} style={{ fontSize: 13, color: '#4F8EF7', cursor: 'pointer' }}>← 홈</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>달성 현황</div>
        <div style={{ width: 40 }} />
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', background: '#1A1D27', borderBottom: '1px solid #2E3250' }}>
        {[['weekly', '📅 주간 달성'], ['accum', '📊 누적 달성']].map(([key, label]) => (
          <div
            key={key}
            onClick={() => setTab(key)}
            style={{ flex: 1, padding: '10px 6px', textAlign: 'center', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: tab === key ? '#4F8EF7' : '#8B92B8', borderBottom: tab === key ? '2px solid #4F8EF7' : '2px solid transparent' }}
          >
            {label}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 개강 선택 */}
        <div style={{ display: 'flex', gap: 6 }}>
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={{ flex: 1, background: '#1A1D27', border: '1px solid #4F8EF7', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#4F8EF7', fontFamily: 'inherit' }}
          >
            {['2026-03', '2026-04', '2026-05', '2026-06'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={termType}
            onChange={e => setTermType(e.target.value)}
            style={{ flex: 1, background: '#1A1D27', border: '1px solid #4F8EF7', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#4F8EF7', fontFamily: 'inherit' }}
          >
            {['청년', '협력교회', '자정부'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* 주차 선택 (주간 달성 탭만) */}
        {tab === 'weekly' && (
          <div style={{ display: 'flex', gap: 5 }}>
            {[1, 2, 3, 4].map(w => (
              <div
                key={w}
                onClick={() => setWeekNo(w)}
                style={{ flex: 1, padding: '6px 4px', borderRadius: 7, fontSize: 10, fontWeight: 700, textAlign: 'center', cursor: 'pointer', border: weekNo === w ? '1px solid #4F8EF7' : '1px solid #2E3250', background: weekNo === w ? '#4F8EF7' : '#1A1D27', color: weekNo === w ? 'white' : '#8B92B8' }}
              >
                {w}주
              </div>
            ))}
          </div>
        )}

        {/* 달성 현황 바 */}
        <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1px', marginBottom: 2 }}>
          {tab === 'weekly' ? `${month} ${termType} · ${weekNo}주차 주간 달성` : `${month} ${termType} · 개강 누적 달성`}
        </div>

        {STAGES.map(s => {
          const goal = goals.weekly?.[s] || 0
          const done = achieved[s] || 0
          const pct = getPct(s)
          const color = getPctColor(pct)

          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 7, borderBottom: '1px solid rgba(46,50,80,0.35)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, width: 48, flexShrink: 0, color: '#E8EAFF' }}>{s}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 5, background: '#22263A', borderRadius: 3, overflow: 'hidden', marginBottom: 2 }}>
                  <div style={{ height: '100%', borderRadius: 3, background: color, width: `${pct}%`, transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: 9, color: '#8B92B8', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color }}>{done}명</span>
                  <span>목표 {goal}명</span>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, width: 36, textAlign: 'right', flexShrink: 0, color }}>{pct}%</div>
            </div>
          )
        })}

        {/* 오늘 일일 달성 (주간 탭만) */}
        {tab === 'weekly' && (
          <div style={{ background: '#22263A', border: '1px solid #2E3250', borderRadius: 9, padding: '10px 12px' }}>
            <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1px', marginBottom: 7 }}>오늘 일일 달성 · {today}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {STAGES.map(s => {
                const goal = goals.daily?.[s] || 0
                const done = achieved[s] || 0
                const ok = done >= goal && goal > 0
                return (
                  <div key={s} style={{ padding: '4px 9px', borderRadius: 7, fontSize: 10, fontWeight: 700, border: `1px solid ${ok ? '#22C55E' : '#2E3250'}`, background: ok ? 'rgba(34,197,94,0.1)' : '#1A1D27', color: ok ? '#22C55E' : '#8B92B8' }}>
                    {s} {done}/{goal} {ok ? '✓' : ''}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 누적 요약 (누적 탭만) */}
        {tab === 'accum' && (
          <div style={{ background: '#22263A', border: '1px solid #2E3250', borderRadius: 9, display: 'flex' }}>
            {[
              [STAGES.filter(s => (achieved[s] || 0) >= (goals.weekly?.[s] || 1)).length, '단계 달성', '#22C55E'],
              [STAGES.filter(s => (achieved[s] || 0) > 0 && (achieved[s] || 0) < (goals.weekly?.[s] || 1)).length, '진행 중', '#F59E0B'],
              [STAGES.filter(s => (achieved[s] || 0) === 0).length, '미달성', '#EF4444'],
            ].map(([num, lbl, color]) => (
              <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', borderLeft: lbl !== '단계 달성' ? '1px solid #2E3250' : 'none' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color }}>{num}</div>
                <div style={{ fontSize: 9, color: '#8B92B8', marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ fontSize: 9, color: '#4B5380', textAlign: 'center' }}>목표 수정은 청년회 관리자 웹에서</div>
      </div>

      {/* 하단 네비 */}
      <div style={{ display: 'flex', borderTop: '1px solid #2E3250', background: '#1A1D27' }}>
        {[['🏠', '홈', 'home'], ['📅', '일정', 'meetList'], ['👥', '목록', 'dataList'], ['⚙️', '설정', 'home']].map(([icon, label, target]) => (
          <div key={label} onClick={() => go(target)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px 6px', fontSize: 8, color: '#4B5380', gap: 2, cursor: 'pointer' }}>
            <div style={{ fontSize: 16 }}>{icon}</div>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}