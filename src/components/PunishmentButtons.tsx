const PUNISHMENTS = [
  'Push up 10 kali!',
  'Nyanyi lagu daerah 1 bait!',
  'Ceritakan pengalaman memalukan!',
  'Joget 30 detik!',
  'Bayar denda Rp 5.000 ke kas!',
];

export default function PunishmentButtons({
  onPunishment,
  onJoget
}: {
  onPunishment: (t: string) => void;
  onJoget?: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ textAlign: 'center', color: '#f44', fontWeight: 'bold', margin: 0 }}>Pilih hukuman:</p>
      {PUNISHMENTS.map((p, i) => (
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
      {onJoget && (
        <button
          onClick={onJoget}
          style={{
            padding: 12,
            borderRadius: 10,
            border: '1px solid #f5a30c',
            background: 'rgba(245,163,12,0.2)',
            color: '#f5a30c',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 'bold'
          }}
        >
          💃 Joget 3 menit
        </button>
      )}
    </div>
  );
}
