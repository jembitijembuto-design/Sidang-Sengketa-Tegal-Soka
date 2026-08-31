const REWARDS = [
  'Sertifikat virtual!',
  'Pujian dari seluruh peserta!',
  'Poin bonus +1!',
  'Boleh skip 1 pertanyaan berikutnya!',
];

export default function RewardButtons({ onReward }: { onReward: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ textAlign: 'center', color: '#0fe7f2', fontWeight: 'bold', margin: 0 }}>Pilih hadiah:</p>
      {REWARDS.map((r, i) => (
        <button
          key={i}
          onClick={() => onReward(r)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1px solid #0fe7f2',
            background: 'rgba(15,231,242,0.15)',
            color: '#aaffee',
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
