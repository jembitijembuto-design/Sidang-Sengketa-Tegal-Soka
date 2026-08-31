const FORMAL = [
  'Anda wajib mengulang pernyataan sumpah!',
  'Sanksi administratif ringan!',
  'Peringatan tertulis dicatat!',
  'Wajib hadir di sidang berikutnya!',
];

export default function SidangNyataPunishment({ onPunishment }: { onPunishment: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ textAlign: 'center', color: '#fa1111', fontWeight: 'bold', margin: 0 }}>Sanksi Sidang:</p>
      {FORMAL.map((p, i) => (
        <button
          key={i}
          onClick={() => onPunishment(p)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1px solid #fa1111',
            background: 'rgba(250,17,17,0.15)',
            color: '#ffaaaa',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
