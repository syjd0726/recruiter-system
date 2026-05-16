// 공통 버튼
export function PrimaryBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#2E3250' : 'linear-gradient(135deg, #4F8EF7, #7C3AED)',
        color: disabled ? '#4B5380' : 'white',
        border: 'none', borderRadius: 10, padding: '13px',
        fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'center', width: '100%',
      }}
    >
      {children}
    </button>
  )
}

// 점선 버튼
export function OutlineBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#1A1D27', border: '1px dashed #2E3250',
        color: '#8B92B8', borderRadius: 10, padding: '10px',
        fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
        cursor: 'pointer', textAlign: 'center', width: '100%',
      }}
    >
      {children}
    </button>
  )
}

// 위험 버튼
export function DangerBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid rgba(239,68,68,0.35)',
        color: '#EF4444', borderRadius: 10, padding: '12px',
        fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
        cursor: 'pointer', textAlign: 'center', width: '100%',
      }}
    >
      {children}
    </button>
  )
}

// 인풋 필드
export function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && <div style={{ fontSize: 10, color: '#8B92B8', fontWeight: 500 }}>{label}</div>}
      {children}
    </div>
  )
}

// 드롭다운처럼 보이는 선택 박스
export function SelectBox({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#1A1D27', border: '1px solid #2E3250',
        borderRadius: 8, padding: '9px 12px', fontSize: 12,
        color: value ? '#E8EAFF' : '#4B5380', fontFamily: 'inherit',
        width: '100%', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234B5380' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  )
}

// 텍스트 인풋
export function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: '#1A1D27', border: '1px solid #2E3250',
        borderRadius: 8, padding: '9px 12px', fontSize: 12,
        color: '#E8EAFF', fontFamily: 'inherit', width: '100%',
      }}
    />
  )
}

// 텍스트 에어리어
export function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        background: '#1A1D27', border: '1px solid #2E3250',
        borderRadius: 8, padding: '9px 12px', fontSize: 12,
        color: '#E8EAFF', fontFamily: 'inherit', width: '100%',
        resize: 'none',
      }}
    />
  )
}

// 칩 선택
export function ChipGroup({ options, selected, onSelect, multi = false }) {
  const isSelected = (opt) => multi
    ? selected?.includes(opt)
    : selected === opt

  const handleClick = (opt) => {
    if (multi) {
      const arr = selected || []
      onSelect(arr.includes(opt) ? arr.filter(o => o !== opt) : [...arr, opt])
    } else {
      onSelect(opt)
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {options.map(opt => (
        <div
          key={opt}
          onClick={() => handleClick(opt)}
          style={{
            padding: '6px 12px', borderRadius: 16, fontSize: 11,
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
            border: isSelected(opt) ? '1px solid #4F8EF7' : '1px solid #2E3250',
            background: isSelected(opt) ? '#4F8EF7' : '#1A1D27',
            color: isSelected(opt) ? 'white' : '#8B92B8',
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  )
}

// 개강 선택 (월 + 성격)
export function GangSelect({ month, type, onMonthChange, onTypeChange, months, types }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <select
        value={month}
        onChange={e => onMonthChange(e.target.value)}
        style={{
          flex: 1, background: '#1A1D27', border: '1px solid #4F8EF7',
          borderRadius: 8, padding: '8px 12px', fontSize: 12,
          fontWeight: 700, color: '#4F8EF7', fontFamily: 'inherit',
        }}
      >
        <option value="">월 선택</option>
        {(months || []).map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select
        value={type}
        onChange={e => onTypeChange(e.target.value)}
        style={{
          flex: 1, background: '#1A1D27', border: '1px solid #4F8EF7',
          borderRadius: 8, padding: '8px 12px', fontSize: 12,
          fontWeight: 700, color: '#4F8EF7', fontFamily: 'inherit',
        }}
      >
        <option value="">성격 선택</option>
        {(types || ['청년', '협력교회', '자정부']).map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  )
}

// 로딩 스피너
export function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ color: '#4B5380', fontSize: 12 }}>불러오는 중...</div>
    </div>
  )
}

// 빈 상태
export function Empty({ message = '데이터가 없어요' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ color: '#4B5380', fontSize: 12 }}>{message}</div>
    </div>
  )
}

// 섹션 구분 레이블
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 9, color: '#4B5380', letterSpacing: '1.5px',
      textTransform: 'uppercase', padding: '4px 0',
      borderTop: '1px solid #2E3250', marginTop: 2,
    }}>
      {children}
    </div>
  )
}

// 정보 노트
export function InfoNote({ children, color = 'blue' }) {
  const colors = {
    blue: { bg: 'rgba(79,142,247,0.06)', border: 'rgba(79,142,247,0.18)', text: '#4F8EF7' },
    yellow: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.18)', text: '#F59E0B' },
    red: { bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.22)', text: '#FCA5A5' },
  }
  const c = colors[color] || colors.blue
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 8, padding: '8px 11px', fontSize: 10, color: c.text,
    }}>
      {children}
    </div>
  )
}