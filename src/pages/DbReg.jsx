import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSystemSettings } from '../hooks/useSupabase'
import { PrimaryBtn, Field, TextInput, SelectBox, InfoNote } from '../components/UI'

export default function DbReg({ go }) {
  const { settings } = useSystemSettings()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [region, setRegion] = useState('요한2조')
  const [recruitType, setRecruitType] = useState('')
  const [inflowRoute, setInflowRoute] = useState('')
  const [inducer, setInducer] = useState('')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [dbMatch, setDbMatch] = useState(null)

  const recruitTypes = settings.recruit_types || ['노방', '통신', 'UP', '묵대', '가족', '지인']
  const inflowRoutes = ['직접입력', '구글폼', '자체웹', '시트', '기타']
  const regions = ['요한1조', '요한2조', '마가1조', '마가2조', '누가1조', '누가2조', '사도1조', '사도2조']

  async function checkDuplicate() {
    if (!contact) return
    const { data } = await supabase
      .from('people')
      .select('*')
      .eq('contact', contact)
      .limit(1)
    if (data && data.length > 0) {
      setDbMatch(data[0])
    } else {
      setDbMatch(null)
    }
  }

  async function handleSubmit() {
    if (!name || !contact) {
      alert('이름과 연락처는 필수예요')
      return
    }
    setLoading(true)
    try {
      await supabase.from('people').insert({
        name,
        contact,
        region,
        stage: 'DB',
        status: '보유',
        recruit_type: recruitType || null,
        inflow_route: inflowRoute || null,
        inducer: inducer || null,
        db_checklist: memo ? { memo } : {},
      })
      alert('🗄️ DB에 추가되었어요!')
      go('home')
    } catch (e) {
      alert('오류: ' + e.message)
    }
    setLoading(false)
  }

  async function handleRevive() {
    if (!dbMatch) return
    setLoading(true)
    try {
      await supabase
        .from('people')
        .update({ status: '보유', stage: 'DB' })
        .eq('id', dbMatch.id)
      alert('✅ 활성 복귀 완료!')
      go('home')
    } catch (e) {
      alert('오류: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 네비 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 10px', borderBottom: '1px solid #2E3250' }}>
        <div onClick={() => go('home')} style={{ fontSize: 13, color: '#4F8EF7', cursor: 'pointer' }}>← 홈</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>DB 등록</div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        <InfoNote>📋 활동 전 대기 풀에 추가합니다. 개강 편입은 전광판 보고(찾기)로 진행하세요.</InfoNote>

        <Field label="이름 *">
          <TextInput value={name} onChange={setName} placeholder="본명" />
        </Field>

        <Field label="연락처 *">
          <TextInput value={contact} onChange={setContact} placeholder="010-0000-0000" />
          {contact.length > 9 && (
            <div onClick={checkDuplicate} style={{ fontSize: 10, color: '#4F8EF7', cursor: 'pointer', marginTop: 3 }}>
              중복 확인 →
            </div>
          )}
        </Field>

        {/* 중복 감지 */}
        {dbMatch && (
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, marginBottom: 7 }}>⚠️ 연락처 일치 — 이미 등록된 분인지 확인하세요</div>
            <div style={{ background: '#22263A', borderRadius: 8, padding: '7px 9px', marginBottom: 7 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{dbMatch.name}</div>
              <div style={{ fontSize: 10, color: '#8B92B8' }}>{dbMatch.contact} · {dbMatch.stage} · {dbMatch.status}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleRevive}
                style={{ flex: 1, padding: 7, borderRadius: 7, background: '#4F8EF7', color: 'white', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                동일인 — 활성 복귀
              </button>
              <button
                onClick={() => setDbMatch(null)}
                style={{ flex: 1, padding: 7, borderRadius: 7, background: '#22263A', color: '#8B92B8', border: '1px solid #2E3250', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                다른 사람
              </button>
            </div>
          </div>
        )}

        <Field label="지역">
          <SelectBox value={region} onChange={setRegion} options={regions} />
        </Field>

        <Field label="섭외 유형">
          <SelectBox value={recruitType} onChange={setRecruitType} options={recruitTypes} placeholder="선택하세요" />
        </Field>

        <Field label="유입 경로">
          <SelectBox value={inflowRoute} onChange={setInflowRoute} options={inflowRoutes} placeholder="선택하세요" />
        </Field>

        <Field label="인도자">
          <TextInput value={inducer} onChange={setInducer} placeholder="인도자 이름" />
        </Field>

        <Field label="메모 (선택)">
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="특이사항"
            rows={3}
            style={{ background: '#1A1D27', border: '1px solid #2E3250', borderRadius: 8, padding: '9px 12px', fontSize: 12, color: '#E8EAFF', fontFamily: 'inherit', width: '100%', resize: 'none' }}
          />
        </Field>

        <PrimaryBtn onClick={handleSubmit} disabled={loading}>
          {loading ? '저장 중...' : 'DB에 추가'}
        </PrimaryBtn>
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