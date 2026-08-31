export default function AnswerButtons({
  onAnswer,
  person
}: {
  onAnswer: (n: 1 | 2) => void;
  person: string;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
      <button
        onClick={() => onAnswer(1)}
        style={{
          flex: 1,
          padding: '16px 8px',
          borderRadius: 12,
          border: '2px solid #0fe7f2',
          background: 'rgba(15,231,242,0.15)',
          color: '#0fe7f2',
          fontWeight: 'bold',
          fontSize: 18,
          cursor: 'pointer'
        }}
      >
        Jawaban 1
      </button>
      <button
        onClick={() => onAnswer(2)}
        style={{
          flex: 1,
          padding: '16px 8px',
          borderRadius: 12,
          border: '2px solid #fa0af6',
          background: 'rgba(250,10,246,0.15)',
          color: '#fa0af6',
          fontWeight: 'bold',
          fontSize: 18,
          cursor: 'pointer'
        }}
      >
        Jawaban 2
      </button>
    </div>
  );
}
