export default function BoardUp({ go }) {
  return (
    <div style={{ padding: 20, color: '#E8EAFF' }}>
      <button onClick={() => go('home')} style={{ background: 'none', border: 'none', color: '#4F8EF7', cursor: 'pointer', marginBottom: 16 }}>← 홈</button>
      <h2>전광판 보고 — 합자 이상</h2>
      <p style={{ color: '#8B92B8', marginTop: 8 }}>준비 중...</p>
    </div>
  )
}