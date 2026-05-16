import { useState } from 'react'
import { usePeople } from '../hooks/useSupabase'
import { Loading, Empty } from '../components/UI'

const STAGES = ['찾기', '합자', '육따기', '영따기', '복음방', '센확', '수신']

const STAGE_COLORS = {
  '찾기': '#22C55E',
  '합자': '#F59E0B',
  '육따기': '#F97316',
  '영따기': '#EF4444',
  '복음방': '#A855F7',
  '센확': '#6366F1',
  '수신': '#0EA5E9',
}

function getDday(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  return diff
}

function DdayBadge({ dateStr }) {
  const d = getDday(dateStr)
  if (d === null) return null
  const color = d <= 1 ? '#EF4444' : d <= 3 ? '#F59E0B' : '#22C55E'
  const bg = d <= 1 ? 'rgba(239,68,68,0.13)' : d <= 3 ? 'rgba(245,158,11,0.13)' : 'rgba(34,197,94,0.13)'
  return (
    <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4, color, background: bg, flexShrink: 0 }}>
      {d <= 0 ? '오늘' : `D-${d}`}
    </div>
  )
}

export default function DataList({ go }) {
  const [termMonth, setTermMonth] = useState('')
  const [termType, setTermType] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const { people, loading } = usePeople({
    term_month: termMonth || undefined,
    term_type: termType || undefined,
    stage: stageFilter || undefined,
  })

  // 단계별 그룹화 (윗 단계부터)
  const grouped = STAGES.slice().reverse().reduce((acc, s) => {
    const list = people.filter(p => p.stage === s)
    if (list.length > 0) acc[s] = list
    return acc
  }, {})

  // 단계별 인원 수
  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s] = people.filter(p => p.stage === s).length
    return acc
  }, {})

  // 목표 대비 달성률 (임시 고정값)
  const targetTotal = 7
  const achievedTotal = (stageCounts['영따기'] || 0) + (stageCounts['복음방'] || 0) + (stageCounts['센확'] || 0) + (stageCounts['수신'] || 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 네비 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px', borderBottom: '1px solid #2E3250' }}>
        <div onClick={() => go('home')} style={{ fontSize: 13, color: '#4F8EF7', cursor: 'pointer' }}>← 홈</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>보유 데이터</div>
        <div style={{ fontSize: 11, color: '#8B92B8' }}>{people.length}명</div>
      </div>

      {/* 필터 */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid #2E3250' }}>

        {/* 개강 필터 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <select
            value={termMonth}
            onChange={e => setTermMonth(e.target.value)}
            style={{ flex: 1, background: termMonth ? '#1A1D27' : '#1A1D27', border: termMonth ? '1px solid #4F8EF7' : '1px solid #2E3250', borderRadius: 7, padding: '7px 10px', fontSize: 11, fontWeight: 700, color: termMonth ? '#4F8EF7' : '#8B92B8', fontFamily: 'inherit' }}
          >
            <option value="">전체 개강월</option>
            {['2026-03', '2026-04', '2026-05', '2026-06'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={termType}
            onChange={e => setTermType(e.target.value)}
            style={{ flex: 1, background: '#1A1D27', border: termType ? '1px solid #4F8EF7' : '1px solid #2E3250', borderRadius: 7, padding: '7px 10px', fontSize: 11, fontWeight: 700, color: termType ? '#4F8EF7' : '#8B92B8', fontFamily: 'inherit' }}
          >
            <option value="">전체 유형</option>
            {['청년', '협력교회', '자정부'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* 목표 달성률 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#22263A', borderRadius: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: '#8B92B8' }}>영따기 이상 목표 달성률</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#F59E0B' }}>
            {achievedTotal}/{targetTotal} <span style={{ fontSize: 10, fontWeight: 400, color: '#8B92B8' }}>{Math.round(achievedTotal / targetTotal * 100)}%</span>
          </div>
        </div>

        {/* 단계별 현황 바 */}
        <div style={{ marginBottom: 8 }}>
          {STAGES.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
              <div style={{ fontSize: 9, fontWeight: 700, width: 40, flexShrink: 0, color: STAGE_COLORS[s] }}>{s}</div>
              <div style={{ flex: 1, height: 5, background: '#22263A', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: STAGE_COLORS[s], width: `${Math.min((stageCounts[s] || 0) / 10 * 100, 100)}%` }} />
              </div>
              <div style={{ fontSize: 9, color: '#8B92B8', width: 26, textAlign: 'right' }}>{stageCounts[s] || 0}명</div>
            </div>
          ))}
        </div>

        {/* 단계 필터 칩 */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['', ...STAGES].map(s => (
            <div
              key={s}
              onClick={() => setStageFilter(s)}
              style={{
                padding: '4px 9px', borderRadius: 14, fontSize: 10, fontWeight: 700,
                border: stageFilter === s ? '1px solid #4F8EF7' : '1px solid #2E3250',
                background: stageFilter === s ? '#22263A' : '#1A1D27',
                color: stageFilter === s ? '#E8EAFF' : '#8B92B8',
                cursor: 'pointer',
              }}
            >
              {s || '전체'}
            </div>
          ))}
        </div>
      </div>

      {/* 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? <Loading /> : people.length === 0 ? <Empty message="데이터가 없어요" /> : (
          Object.entries(grouped).map(([s, list]) => (
            <div key={s}>
              {/* 단계 그룹 헤더 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px 3px', fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: STAGE_COLORS[s], flexShrink: 0 }} />
                {s} · {list.length}명
              </div>

              {/* 사람 행 */}
              {list.map(person => (
                <div
                  key={person.id}
                  style={{ display: 'flex', alignItems: 'center', padding: '7px 14px', gap: 8, borderBottom: '1px solid rgba(46,50,80,0.4)', cursor: 'pointer' }}
                  onClick={() => go('personDetail', { person })}
                >
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: STAGE_COLORS[s], flexShrink: 0 }} />
                  <div style={{ fontSize: 12, fontWeight: 700, width: 50, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{person.name}</div>
                  <div style={{ fontSize: 10, color: '#8B92B8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {[person.inducer, person.current_teacher, person.current_servant].filter(Boolean).join('-') || '—'}
                  </div>
                  <div style={{ fontSize: 10, color: '#8B92B8', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {person.next_meet_at ? new Date(person.next_meet_at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' }) : '—'}
                  </div>
                  <DdayBadge dateStr={person.next_meet_at} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* 하단 네비 */}
      <div style={{ display: 'flex', borderTop: '1px solid #2E3250', background: '#1A1D27' }}>
        {[['🏠', '홈', 'home'], ['📅', '일정', 'meetList'], ['👥', '목록', 'dataList'], ['⚙️', '설정', 'home']].map(([icon, label, target]) => (
          <div key={label} onClick={() => go(target)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px 6px', fontSize: 8, color: label === '목록' ? '#4F8EF7' : '#4B5380', gap: 2, cursor: 'pointer' }}>
            <div style={{ fontSize: 16 }}>{icon}</div>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}