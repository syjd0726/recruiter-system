import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { PrimaryBtn, Field, TextInput, TextArea, SelectBox, ChipGroup } from '../components/UI'

const RESULT_OPTIONS = ['완료', '연기', '취소']

export default function MeetForm({ go, params }) {
  const meet = params?.meet || {}
  const person = meet.people || {}

  const [result, setResult] = useState('완료')
  const [timeStart, setTimeStart] = useState('')
  const [timeEnd, setTimeEnd] = useState('')
  const [place, setPlace] = useState(meet.meet_place || '')
  const [content, setContent] = useState('')
  const [fruit, setFruit] = useState('')
  const [nextMeetAt, setNextMeetAt] = useState('')
  const [nextPlace, setNextPlace] = useState('')
  const [nextPurpose, setNextPurpose] = useState('')
  const [loading, setLoading] = useState(false)

  // 단계별 체크항목
  const stage = person.stage || ''
  const checkItems = {
    '합자': [{ id: 'sangdam', label: '상담일보', required: true }, { id: 'fixday', label: '고정요일 확정', required: false }],
    '육따기': [{ id: 'edu', label: '교육일보', required: true }, { id: 'center', label: '센터 인지', required: false }],
    '영따기': [{ id: 'follow', label: '따체리', required: true }, { id: 'bible', label: '성경교재 인지', required: false }],
    '센확': [{ id: 'confirm', label: '센터확답', required: true }],
    '수신': [{ id: 'apply', label: '수강신청서', required: true }],
  }
  const currentChecks = checkItems[stage] || []
  const [checks, setChecks] = useState({})

  function toggleCheck(id) {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const NEXT_PURPOSES = ['친교(정보파악)', '인터뷰', '상담', '동아리', '육따기', '영따기', '육따기 굳히기', '영따기 굳히기', '복음방', '개강진 면접', 'OT', '프리뷰파티']

  async function handleSubmit() {
    if (!content) {
      alert('만남 내용은 필수예요')
      return
    }
    if (!fruit) {
      alert('열매/느낀점은 필수예요')
      return
    }
    setLoading(true)
    try {
      await supabase.from('meet_reports').insert({
        person_id: meet.person_id || null,
        report_type: '만남결과',
        report_date: new Date().toISOString().split('T')[0],
        meet_time_start: timeStart || null,
        meet_time_end: timeEnd || null,
        meet_place: place || null,
        meet_content: content,
        meet_fruit: fruit,
        result,
        checklist_data: checks,
        next_meet_at: nextMeetAt || null,
        next_meet_place: nextPlace || null,
        next_meet_purpose: nextPurpose || null,
        purpose: meet.purpose || null,
        teacher: person.current_teacher || null,
      })

      // 다음 만남 일시 people 테이블에도 업데이트
      if (nextMeetAt && meet.person_id) {
        await supabase
          .from('people')
          .update({ next_meet_at: nextMeetAt })
          .eq('id', meet.person_id)
      }

      alert('📖 만남 결과 저장 완료!')
      go('meetList')
    } catch (e) {
      alert('오류: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 네비 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px', borderBottom: '1px solid #2E3250' }}>
        <div onClick={() => go('meetList')} style={{ fontSize: 13, color: '#4F8EF7', cursor: 'pointer' }}>← 목록</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>만남 보고</div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 섭외자 헤더 */}
        <div style={{ background: '#22263A', border: '1px solid #4F8EF7', borderRadius: 10, padding: '11px 13px' }}>
          <div style={{ fontSize: 15, fontWeight: 900 }}>{person.name || '섭외자'}</div>
          <div style={{ fontSize: 11, color: '#4F8EF7', fontWeight: 700, marginTop: 2 }}>
            {[person.inducer, person.current_teacher, person.current_servant].filter(Boolean).join(' / ') || '—'}
          </div>
          <div style={{ fontSize: 10, color: '#8B92B8', marginTop: 3 }}>
            {stage} 단계 · {meet.purpose || ''}
          </div>
        </div>

        {/* 만남 결과 */}
        <Field label="만남 결과">
          <div style={{ display: 'flex', gap: 6 }}>
            {RESULT_OPTIONS.map(r => (
              <div
                key={r}
                onClick={() => setResult(r)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  border: result === r
                    ? r === '완료' ? '1px solid #22C55E' : r === '연기' ? '1px solid #F59E0B' : '1px solid #EF4444'
                    : '1px solid #2E3250',
                  background: result === r
                    ? r === '완료' ? 'rgba(34,197,94,0.12)' : r === '연기' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'
                    : '#1A1D27',
                  color: result === r
                    ? r === '완료' ? '#22C55E' : r === '연기' ? '#F59E0B' : '#EF4444'
                    : '#8B92B8',
                  textAlign: 'center', cursor: 'pointer',
                }}
              >
                {r === '완료' ? '✓ 완료' : r}
              </div>
            ))}
          </div>
        </Field>

        {/* 실제 만남 일시 */}
        <Field label="실제 만남 시간">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ background: '#22263A', border: '1px solid #2E3250', borderRadius: 7, padding: '8px 11px', fontSize: 11, color: '#8B92B8', flexShrink: 0 }}>
              {new Date().toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' })}
            </div>
            <input
              type="time"
              value={timeStart}
              onChange={e => setTimeStart(e.target.value)}
              style={{ flex: 1, background: '#1A1D27', border: '1px solid #4F8EF7', borderRadius: 7, padding: '8px 11px', fontSize: 12, fontWeight: 700, color: '#4F8EF7', fontFamily: 'inherit' }}
            />
            <span style={{ color: '#4B5380', fontSize: 11 }}>~</span>
            <input
              type="time"
              value={timeEnd}
              onChange={e => setTimeEnd(e.target.value)}
              style={{ flex: 1, background: '#1A1D27', border: '1px solid #2E3250', borderRadius: 7, padding: '8px 11px', fontSize: 12, color: '#8B92B8', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ fontSize: 9, color: '#4B5380', marginTop: 3 }}>날짜 고정 · 시작~종료 시간 입력</div>
        </Field>

        {/* 만남 장소 */}
        <Field label="만남 장소">
          <TextInput value={place} onChange={setPlace} placeholder="장소 입력" />
        </Field>

        {/* 만남 내용 */}
        <Field label="만남 내용 *">
          <TextArea value={content} onChange={setContent} placeholder="오늘 만남 내용을 입력해주세요" rows={3} />
        </Field>

        {/* 열매 / 느낀점 */}
        <Field label="열매 / 느낀점 *">
          <TextArea value={fruit} onChange={setFruit} placeholder="열매와 느낀점을 입력해주세요" rows={3} />
        </Field>

        {/* 단계별 체크항목 */}
        {currentChecks.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: '#8B92B8', fontWeight: 500, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>체크 항목</span>
              <span style={{ fontSize: 9, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', padding: '2px 7px', borderRadius: 10 }}>{stage} 단계</span>
            </div>
            {currentChecks.map(item => (
              <div key={item.id} style={{ background: '#1A1D27', border: '1px solid #2E3250', borderRadius: 8, marginBottom: 5, overflow: 'hidden' }}>
                <div
                  onClick={() => toggleCheck(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', cursor: 'pointer' }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                    background: checks[item.id] ? '#22C55E' : 'transparent',
                    border: checks[item.id] ? '2px solid #22C55E' : '2px solid #2E3250',
                    color: 'white',
                  }}>
                    {checks[item.id] ? '✓' : ''}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{item.label}</div>
                  <div style={{ fontSize: 9, color: item.required ? '#EF4444' : '#4B5380' }}>{item.required ? '필수' : '선택'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 다음 만남 */}
        <div style={{ background: '#22263A', border: '1px solid #2E3250', borderRadius: 9, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1px' }}>다음 만남</div>
          <Field label="일시">
            <input
              type="datetime-local"
              value={nextMeetAt}
              onChange={e => setNextMeetAt(e.target.value)}
              style={{ background: '#1A1D27', border: '1px solid #2E3250', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#E8EAFF', fontFamily: 'inherit', width: '100%' }}
            />
          </Field>
          <Field label="장소 (선택)">
            <TextInput value={nextPlace} onChange={setNextPlace} placeholder="장소" />
          </Field>
          <Field label="만남 목적">
            <SelectBox value={nextPurpose} onChange={setNextPurpose} options={NEXT_PURPOSES} placeholder="선택하세요" />
          </Field>
        </div>

        <PrimaryBtn onClick={handleSubmit} disabled={loading}>
          {loading ? '저장 중...' : '📖 만남 결과 저장'}
        </PrimaryBtn>
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