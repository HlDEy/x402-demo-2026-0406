interface Props {
  logs: string[];
}

const colorMap: Record<string, string> = {
  '[Agent]': '#f0c040',
  '[Claude]': '#a78bfa',
  '[Free API]': '#60a5fa',
  '[API]': '#f87171',
  '[Error]': '#f05040',
};

function lineColor(line: string): string {
  for (const [prefix, color] of Object.entries(colorMap)) {
    if (line.startsWith(prefix)) return color;
  }
  return '#888';
}

export default function LogDisplay({ logs }: Props) {
  if (logs.length === 0) return null;

  return (
    <div
      style={{
        background: '#111',
        border: '1px solid #2a2a2a',
        borderRadius: 10,
        padding: '1.25rem',
        marginTop: '1.25rem',
        fontFamily: 'monospace',
        fontSize: '0.82rem',
      }}
    >
      <p style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
        Agent Log
      </p>
      {logs.map((line, i) => (
        <div key={i} style={{ color: lineColor(line), lineHeight: 1.7 }}>
          {line}
        </div>
      ))}
    </div>
  );
}
