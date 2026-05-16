export default function DataList({ go }) {
  return (
    <div style={{ padding: 20, color: '#E8EAFF' }}>
      <button onClick={() => go('home')} style={{ background: 'none', border: 'none', color: '#4F8EF7', cursor: 'pointer', marginBottom: 16 }}>← 홈</button>
      <h2>보유 데이터</h2>
      <p style={{ color: '#8B92B8', marginTop: 8 }}>준비 중...</p>
    </div>
  )
}