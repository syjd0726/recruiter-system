import { useTodayMeetings } from '../hooks/useSupabase'
import { Loading, Empty } from '../components/UI'

function formatTime(timeStr) {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

function isYesterday(dateStr) {
  if (!dateStr) return false
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateStr === yesterday.toISOString().split('T')[0]
}

export default function MeetList({ go }) {
  const { meetings, loading } = useTodayMeetings()

  const today = new Date().toISOString().split('T')[0]
  const todayMeetings = meetings.filter(m => m.report_date === today)
  const yesterdayMeetings = meetings.filter(m => isYesterday(m.report_date) && !m.result)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 네비 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px', borderBottom: '1px solid #2E3250' }}>
        <div onClick={() => go('home')} style={{ fontSize: 13, color: '#4F8EF7', cursor: 'pointer' }}>← 홈</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>만남 결과 보고</div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* 미제출 경고 배너 */}
        {yesterdayMeetings.length > 0 && (
          <div style={{ margin: '8px 14px 0', padding: '8px 12px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 8, fontSize: 10, color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: 5 }}>
            ⚠️ 어제 만남 결과 {yesterdayMeetings.length}건 미제출
          </div>
        )}

        <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>

          {loading ? <Loading /> : (
            <>
              {/* 어제 미제출 */}
              {yesterdayMeetings.length > 0 && (
                <>
                  <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 0', borderTop: '1px solid #2E3250' }}>
                    어제 미제출
                  </div>
                  {yesterdayMeetings.map(m => (
                    <MeetCard key={m.id} meet={m} overdue onClick={() => go('meetForm', { meet: m })} />
                  ))}
                </>
              )}

              {/* 오늘 예정 */}
              <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 0', borderTop: yesterdayMeetings.length > 0 ? '1px solid #2E3250' : 'none', marginTop: yesterdayMeetings.length > 0 ? 2 : 0 }}>
                오늘 예정 ({todayMeetings.length}건)
              </div>

              {todayMeetings.length === 0
                ? <Empty message="오늘 예정된 만남이 없어요" />
                : todayMeetings.map(m => (
                  <MeetCard key={m.id} meet={m} onClick={() => go('meetForm', { meet: m })} />
                ))
              }

              {/* 예정 없는 만남 추가 */}
              <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 0', borderTop: '1px solid #2E3250', marginTop: 2 }}>
                예정 없는 만남
              </div>
              <button
                onClick={() => go('meetForm', {})}
                style={{ background: '#1A1D27', border: '1px dashed #2E3250', color: '#8B92B8', borderRadius: 10, padding: 10, fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center' }}
              >
                + 만남 일정 추가 후 보고
              </button>
            </>
          )}
        </div>
      </div>

      {/* 하단 네비 */}
      <div style={{ display: 'flex', borderTop: '1px solid #2E3250', background: '#1A1D27' }}>
        {[['🏠', '홈', 'home'], ['📅', '일정', 'meetList'], ['👥', '목록', 'dataList'], ['⚙️', '설정', 'home']].map(([icon, label, target]) => (
          <div key={label} onClick={() => go(target)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px 6px', fontSize: 8, color: label === '일정' ? '#4F8EF7' : '#4B5380', gap: 2, cursor: 'pointer' }}>
            <div style={{ fontSize: 16 }}>{icon}</div>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function MeetCard({ meet, overdue, onClick }) {
  const person = meet.people || {}
  const people_chain = [person.inducer, person.current_teacher, person.current_servant].filter(Boolean).join(' / ')
  const isDone = meet.result === '완료'

  return (
    <div
      onClick={onClick}
      style={{
        background: overdue ? 'rgba(239,68,68,0.04)' : '#1A1D27',
        border: overdue ? '1px solid rgba(239,68,68,0.3)' : '1px solid #2E3250',
        borderRadius: 10, padding: '9px 11px',
        display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer',
      }}
    >
      {/* 시간 */}
      <div style={{ textAlign: 'center', flexShrink: 0, width: 36 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: overdue ? '#EF4444' : '#4F8EF7', lineHeight: 1.1 }}>
          {overdue ? '어제' : meet.report_time ? meet.report_time.slice(0, 5) : '—'}
        </div>
        <div style={{ fontSize: 8, color: '#8B92B8' }}>
          {!overdue && meet.report_time ? (parseInt(meet.report_time) < 12 ? '오전' : '오후') : ''}
        </div>
      </div>

      {/* 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 900 }}>{person.name || '—'}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4F8EF7', marginTop: 1 }}>
          {people_chain || '—'}
        </div>
        <div style={{ fontSize: 10, color: '#8B92B8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {person.stage} · {meet.purpose} · {meet.meet_place || ''}
        </div>
      </div>

      {/* 버튼 */}
      <button
        style={{
          padding: '5px 10px', borderRadius: 7, fontSize: 10, fontWeight: 700,
          border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, marginTop: 2,
          background: isDone ? 'rgba(34,197,94,0.13)' : '#4F8EF7',
          color: isDone ? '#22C55E' : 'white',
        }}
      >
        {isDone ? '완료✓' : '보고'}
      </button>
    </div>
  )
}