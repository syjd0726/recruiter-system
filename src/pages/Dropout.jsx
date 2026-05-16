import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { usePeople } from '../hooks/useSupabase'
import { Loading, Empty, GangSelect, DangerBtn } from '../components/UI'

const REASONS = ['본인 거부', '연락 두절', '이사/전출', '타 교회', '기타']

export default function Dropout({ go }) {
  const [month, setMonth] = useState('2026-05')
  const [termType, setTermType] = useState('청년')
  const [selected, setSelected] = useState(null)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const { people, loading: listLoading } = usePeople({
    term_month: month,
    term_type: termType,
    status: '보유',
  })

  async function handleDropout() {
    if (!selected) {
      alert('섭외자를 선택해주세요')
      return
    }
    if (!reason) {
      alert('탈락 사유를 선택해주세요')
      return
    }
    if (!window.confirm(`${selected.name}님을 탈락 처리할까요?`)) return

    setLoading(true)
    try {
      await supabase
        .from('people')
        .update({ status: '탈락' })
        .eq('id', selected.id)
      alert('❌ 탈락 처리 완료. 데이터는 보존됩니다.')
      setSelected(null)
      setReason('')
    } catch (e) {
      alert('오류: ' + e.message)
    }
    setLoading(false)
  }

  async function handleLongTerm() {
    if (!selected) {
      alert('섭외자를 선택해주세요')
      return
    }
    if (!window.confirm(`${selected.name}님을 장기 데이터로 분류할까요?`)) return

    setLoading(true)
    try {
      await supabase
        .from('people')
        .update({ status: '장기' })
        .eq('id', selected.id)
      alert('📦 장기 데이터로 분류 완료.')
      setSelected(null)
      setReason('')
    } catch (e) {
      alert('오류: ' + e.message)
    }
    setLoading(false)
  }

  const STAGE_COLORS = {
    '찾기': '#22C55E', '합자': '#F59E0B', '육따기': '#F97316',
    '영따기': '#EF4444', '복음방': '#A855F7', '센확': '#6366F1', '수신': '#0EA5E9',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 네비 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px', borderBottom: '1px solid #2E3250' }}>
        <div onClick={() => go('home')} style={{ fontSize: 13, color: '#4F8EF7', cursor: 'pointer' }}>← 홈</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>탈락 처리</div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 개강 선택 */}
        <div>
          <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>개강 선택</div>
          <GangSelect
            month={month} type={termType}
            onMonthChange={setMonth} onTypeChange={setTermType}
            months={['2026-03', '2026-04', '2026-05', '2026-06']}
          />
        </div>

        {/* 섭외자 선택 */}
        <div>
          <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>섭외자 선택</div>
          {listLoading ? <Loading /> : people.length === 0 ? <Empty message="보유 데이터가 없어요" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {people.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelected(selected?.id === p.id ? null : p)}
                  style={{
                    background: selected?.id === p.id ? 'rgba(239,68,68,0.04)' : '#1A1D27',
                    border: selected?.id === p.id ? '1px solid rgba(239,68,68,0.4)' : '1px solid #2E3250',
                    borderRadius: 9, padding: '10px 12px',
                    display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
                    border: selected?.id === p.id ? '2px solid #EF4444' : '2px solid #2E3250',
                    background: selected?.id === p.id ? '#EF4444' : 'transparent',
                  }} />
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: STAGE_COLORS[p.stage] || '#4B5380',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 900, color: 'white',
                  }}>
                    {p.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: '#8B92B8' }}>{p.stage} · {month} {termType}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 탈락 사유 */}
        <div>
          <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>탈락 사유</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {REASONS.map(r => (
              <div
                key={r}
                onClick={() => setReason(r)}
                style={{
                  padding: '6px 11px', borderRadius: 16, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  border: reason === r ? '1px solid #EF4444' : '1px solid #2E3250',
                  background: reason === r ? 'rgba(239,68,68,0.12)' : '#1A1D27',
                  color: reason === r ? '#EF4444' : '#8B92B8',
                }}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        {/* 장기 분류 */}
        <button
          onClick={handleLongTerm}
          disabled={loading}
          style={{ background: '#1A1D27', border: '1px solid #2E3250', color: '#8B92B8', borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center', width: '100%' }}
        >
          📦 장기 데이터로 분류
        </button>

        {/* 탈락 확정 */}
        <button
          onClick={handleDropout}
          disabled={loading}
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center', width: '100%' }}
        >
          ❌ 탈락 처리 확정
        </button>

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