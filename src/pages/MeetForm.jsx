export default function MeetForm({ go }) {
  return (
    <div style={{ padding: 20, color: '#E8EAFF' }}>
      <button onClick={() => go('meetList')} style={{ background: 'none', border: 'none', color: '#4F8EF7', cursor: 'pointer', marginBottom: 16 }}>← 목록</button>
      <h2>만남 보고 폼</h2>
      <p style={{ color: '#8B92B8', marginTop: 8 }}>준비 중...</p>
    </div>
  )
}