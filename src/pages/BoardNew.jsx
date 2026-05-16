import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSystemSettings } from '../hooks/useSupabase'
import { PrimaryBtn, OutlineBtn, Field, SelectBox, TextInput, ChipGroup, GangSelect, InfoNote } from '../components/UI'

const STAGES = ['찾기', '합자', '육따기', '영따기', '복음방', '센확', '수신']

const PURPOSES_BY_STAGE = {
  '찾기': ['친교(정보파악)', '인터뷰', '상담', '동아리'],
  '합자': ['상담', '육따기'],
  '육따기': ['육따기 굳히기', '영따기', '특강'],
  '영따기': ['영따기 굳히기', '복음방', '개강진 면접', '특강', '프리뷰파티'],
  '복음방': ['개강진 면접', '복음방'],
  '센확': ['OT', '개강진 면접', '프리뷰파티'],
  '수신': ['수강신청서'],
}

export default function BoardNew({ go }) {
  const { settings } = useSystemSettings()
  const [month, setMonth] = useState('2026-05')
  const [termType, setTermType] = useState('청년')
  const [stage, setStage] = useState('찾기')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [recruitType, setRecruitType] = useState('')
  const [inducer, setInducer] = useState('')
  const [teacher, setTeacher] = useState('')
  const [nextMeetAt, setNextMeetAt] = useState('')
  const [purpose, setPurpose] = useState('')
  const [bokumRound, setBokumRound] = useState('')
  const [loading, setLoading] = useState(false)
  const [dbMatch, setDbMatch] = useState(null)
  const [done, setDone] = useState([])

  const recruitTypes = settings.recruit_types || ['노방', '통신', 'UP', '묵대', '가족', '지인']
  const isNewStage = stage === '찾기'
  const purposes = PURPOSES_BY_STAGE[stage] || []

  function handleStageChange(s) {
    setStage(s)
    setPurpose('')
    setBokumRound('')
  }

  function handlePurposeChange(p) {
    setPurpose(p)
    setBokumRound('')
  }

  // 최종 저장될 만남 목적
  const finalPurpose = purpose === '복음방' && bokumRound
    ? `복음방 ${bokumRound}`
    : purpose

  async function checkDuplicate() {
    if (!name || !contact) return
    const { data } = await supabase
      .from('people')
      .select('*')
      .eq('contact', contact)
      .limit(1)
    if (data && data.length > 0) {
      setDbMatch(data[0])
    } else {
      setDbMatch(null)
      alert('DB에 동일한 연락처가 없어요 — 신규 등록해요!')
    }
  }

  async function handleSubmit() {
    if (!name || !recruitType || !finalPurpose) {
      alert('이름, 섭외 유형, 만남 목적은 필수예요')
      return
    }
    if (purpose === '복음방' && !bokumRound) {
      alert('복음방 회차를 선택해주세요')
      return
    }
    if (!isNewStage && !teacher) {
      alert('합자 이상은 교사가 필수예요')
      return
    }
    setLoading(true)
    try {
      let personId

      if (isNewStage) {
        const { data: person, error } = await supabase
          .from('people')
          .insert({
            name,
            contact,
            stage: '찾기',
            status: '보유',
            term_month: month,
            term_type: termType,
            recruit_type: recruitType,
            inducer,
            current_teacher: teacher || null,
          })
          .select()
          .single()
        if (error) throw error
        personId = person.id
      }

      await supabase.from('meet_reports').insert({
        person_id: personId,
        report_type: '전광판',
        report_date: new Date().toISOString().split('T')[0],
        stage_from: isNewStage ? 'DB' : stage,
        stage_to: stage,
        purpose: finalPurpose,
        teacher,
        next_meet_at: nextMeetAt || null,
        next_meet_purpose: finalPurpose,
      })

      setDone(prev => [...prev, { name, stage, purpose: finalPurpose }])
      resetForm()
      alert('⚡ 전광판 보고 완료!')
    } catch (e) {
      alert('오류: ' + e.message)
    }
    setLoading(false)
  }

  function resetForm() {
    setName('')
    setContact('')
    setRecruitType('')
    setInducer('')
    setTeacher('')
    setNextMeetAt('')
    setPurpose('')
    setBokumRound('')
    setDbMatch(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px', borderBottom: '1px solid #2E3250' }}>
        <div onClick={() => go('home')} style={{ fontSize: 13, color: '#4F8EF7', cursor: 'pointer' }}>← 홈</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>전광판 보고</div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {done.map((d, i) => (
          <div key={i} style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 9, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ fontSize: 16 }}>✅</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#22C55E' }}>{d.name} {d.stage} 보고 완료</div>
              <div style={{ fontSize: 10, color: '#8B92B8' }}>{d.purpose} · 방금 발송</div>
            </div>
          </div>
        ))}

        <div>
          <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>개강 선택</div>
          <GangSelect
            month={month} type={termType}
            onMonthChange={setMonth} onTypeChange={setTermType}
            months={['2026-03', '2026-04', '2026-05', '2026-06']}
          />
        </div>

        <div>
          <div style={{ fontSize: 9, color: '#4B5380', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>단계</div>
          <ChipGroup options={STAGES} selected={stage} onSelect={handleStageChange} />
        </div>

        {isNewStage
          ? <InfoNote>✦ 찾기는 신규 — 이름·연락처 입력</InfoNote>
          : <InfoNote color="yellow">✦ 합자 이상 — 교사 필수</InfoNote>
        }

        <Field label="이름 *">
          <TextInput value={name} onChange={setName} placeholder="섭외자 이름" />
        </Field>

        <Field label="연락처">
          <TextInput value={contact} onChange={setContact} placeholder="010-0000-0000" />
          {contact.length > 9 && (
            <div onClick={checkDuplicate} style={{ fontSize: 10, color: '#4F8EF7', cursor: 'pointer', marginTop: 3 }}>
              DB 중복 확인 →
            </div>
          )}
        </Field>

        {dbMatch && (
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, marginBottom: 7 }}>⚠️ DB에 같은 연락처가 있어요</div>
            <div style={{ background: '#22263A', borderRadius: 8, padding: '7px 9px', marginBottom: 7 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{dbMatch.name}</div>
              <div style={{ fontSize: 10, color: '#8B92B8' }}>{dbMatch.contact} · {dbMatch.stage} · {dbMatch.recruit_type}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setName(dbMatch.name); setContact(dbMatch.contact); setDbMatch(null) }}
                style={{ flex: 1, padding: 7, borderRadius: 7, background: '#4F8EF7', color: 'white', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                같은 사람 — 이번 개강으로 이동
              </button>
              <button onClick={() => setDbMatch(null)}
                style={{ flex: 1, padding: 7, borderRadius: 7, background: '#22263A', color: '#8B92B8', border: '1px solid #2E3250', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                다른 사람
              </button>
            </div>
          </div>
        )}

        <Field label="섭외 유형 *">
          <SelectBox value={recruitType} onChange={setRecruitType} options={recruitTypes} placeholder="선택하세요" />
        </Field>

        <div style={{ display: 'flex', gap: 6 }}>
          <Field label="인도자">
            <TextInput value={inducer} onChange={setInducer} placeholder="인도자" />
          </Field>
          <Field label={isNewStage ? '교사 (선택)' : '교사 *'}>
            <TextInput value={teacher} onChange={setTeacher} placeholder={isNewStage ? '선택' : '필수'} />
          </Field>
        </div>

        <Field label="다음 만남 일시">
          <input
            type="datetime-local"
            value={nextMeetAt}
            onChange={e => setNextMeetAt(e.target.value)}
            style={{ background: '#1A1D27', border: '1px solid #2E3250', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#E8EAFF', fontFamily: 'inherit', width: '100%' }}
          />
        </Field>

        <Field label="만남 목적 *">
          <SelectBox value={purpose} onChange={handlePurposeChange} options={purposes} placeholder="선택하세요" />
        </Field>

        {stage === '복음방' && purpose === '복음방' && (
  <Field label="복음방 회차 *">
    <ChipGroup
      options={['1회차', '2회차', '3회차', '4회차', '5회차', '6회차']}
      selected={bokumRound}
      onSelect={setBokumRound}
    />
  </Field>
)}

        {/* 최종 목적 미리보기 */}
        {finalPurpose && (
          <div style={{ fontSize: 11, color: '#8B92B8', padding: '6px 10px', background: '#22263A', borderRadius: 7 }}>
            📌 저장될 만남 목적: <span style={{ color: '#4F8EF7', fontWeight: 700 }}>{finalPurpose}</span>
          </div>
        )}

        <PrimaryBtn onClick={handleSubmit} disabled={loading}>
          {loading ? '저장 중...' : '⚡ 전광판 보고 발송'}
        </PrimaryBtn>
        <OutlineBtn onClick={resetForm}>
          + 다음 사람 추가 보고
        </OutlineBtn>
      </div>

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