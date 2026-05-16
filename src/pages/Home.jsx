import { useSystemSettings } from '../hooks/useSupabase'

const MENU = [
  { id: 'boardNew', icon: '⚡', name: '전광판 보고', desc: '단계 향상 달성', accent: true },
  { id: 'meetList', icon: '📖', name: '만남 결과 보고', desc: '오늘 만남 기록', badge: 3 },
  { id: 'dataList', icon: '👥', name: '보유 데이터', desc: '섭외자 목록' },
  { id: 'meetList', icon: '📅', name: '만남 일정', desc: '일정 확인·추가' },
  { id: 'dbReg', icon: '🗄️', name: 'DB 등록', desc: '대기 풀 추가' },
  { id: 'dropout', icon: '❌', name: '탈락 처리', desc: '상태 변경' },
]

export default function Home({ go }) {
  const { settings } = useSystemSettings()
  const focusStage = settings.focus_stage || '합자'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '12px 14px 10px', background: 'linear-gradient(135deg,#1A1D27,#1E2235)', borderBottom: '1px solid #2E3250' }}>
        <div style={{ fontSize: 10, color: '#8B92B8' }}>
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, marginTop: 2 }}>안녕하세요 👋</div>
        <div style={{ fontSize: 11, color: '#4F8EF7', marginTop: 2 }}>요한2조</div>
      </div>

      <div style={{ margin: '10px 14px 0', background: '#22263A', border: '1px solid #2E3250', borderRadius: 11, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderBottom: '1px solid #2E3250', background: 'rgba(79,142,247,0.05)' }}>
          <div style={{ fontSize: 10, color: '#4F8EF7', fontWeight: 700 }}>🎯 오늘의 집중 단계</div>
          <div style={{ fontSize: 9, color: '#4B5380' }}>관리자 설정</div>
        </div>
        <div style={{ padding: '6px 12px 4px', fontSize: 13, fontWeight: 900 }}>
          {focusStage} <span style={{ fontSize: 10, fontWeight: 400, color: '#8B92B8' }}>5월 청년</span>
        </div>
        <div style={{ display: 'flex' }}>
          {[['1', '오늘 달성', '#F59E0B'], ['4', '주간 부족', '#EF4444'], ['5', '목표', '#22C55E']].map(([num, lbl, color]) => (
            <div key={lbl} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', borderLeft: lbl !== '오늘 달성' ? '1px solid #2E3250' : 'none' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 9, color: '#8B92B8', marginTop: 3 }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: '#4B5380', padding: '5px 12px 8px' }}>주간 달성률 20% · 오늘 일일 목표 1명 미달</div>
      </div>

      <div
        onClick={() => go('meetList')}
        style={{ margin: '8px 14px 0', padding: '8px 12px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
      >
        <div style={{ fontSize: 11, color: '#FCA5A5' }}>⚠️ 만남 결과 미보고</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#EF4444' }}>3건</div>
          <div style={{ fontSize: 10, color: '#4F8EF7' }}>보고하기 ›</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, padding: '10px 14px 0' }}>
        {MENU.map((m, i) => (
          <div
            key={i}
            onClick={() => go(m.id)}
            style={{
              background: m.accent ? 'rgba(79,142,247,0.06)' : '#1A1D27',
              border: m.accent ? '1px solid rgba(79,142,247,0.4)' : '1px solid #2E3250',
              borderRadius: 12, padding: '12px 10px', cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{m.name}</div>
            <div style={{ fontSize: 9, color: '#8B92B8', marginTop: 1 }}>{m.desc}</div>
            {m.badge && (
              <div style={{ position: 'absolute', top: 8, right: 8, background: '#EF4444', color: 'white', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 7 }}>{m.badge}</div>
            )}
          </div>
        ))}
        <div
          onClick={() => go('weekly')}
          style={{ gridColumn: 'span 2', background: '#1A1D27', border: '1px solid #2E3250', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{ fontSize: 18 }}>🎯</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>주간 목표 확인</div>
            <div style={{ fontSize: 9, color: '#8B92B8', marginTop: 1 }}>합자 1/5 · 찾기 2/7</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', borderTop: '1px solid #2E3250', background: '#1A1D27' }}>
        {[['🏠', '홈', 'home'], ['📅', '일정', 'meetList'], ['👥', '목록', 'dataList'], ['⚙️', '설정', 'home']].map(([icon, label, target]) => (
          <div
            key={label}
            onClick={() => go(target)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px 6px', fontSize: 8, color: label === '홈' ? '#4F8EF7' : '#4B5380', gap: 2, cursor: 'pointer' }}
          >
            <div style={{ fontSize: 16 }}>{icon}</div>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}