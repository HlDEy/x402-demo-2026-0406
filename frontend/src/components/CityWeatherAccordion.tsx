import { useState } from 'react';

const cities = [
  { name: 'Tokyo',   weather: '快晴', icon: '🌞', condition: 'clear' },
  { name: 'Seoul',   weather: '晴れ', icon: '☀️', condition: 'sunny' },
  { name: 'Jakarta', weather: '曇り', icon: '☁️', condition: 'cloudy' },
  { name: 'Kyoto',   weather: '雨',   icon: '🌧️', condition: 'rainy' },
  { name: 'Paris',   weather: '嵐',   icon: '⛈️', condition: 'stormy' },
  { name: 'Osaka',   weather: '竜巻', icon: '🌪️', condition: 'tornado' },
];

const urgencyColor: Record<string, string> = {
  clear:   '#888',
  sunny:   '#888',
  cloudy:  '#888',
  rainy:   '#60a5fa',
  stormy:  '#f87171',
  tornado: '#f87171',
};

const urgencyLabel: Record<string, string> = {
  clear:   'Skip しやすい',
  sunny:   'Skip しやすい',
  cloudy:  'urgency次第',
  rainy:   'Buy になりやすい',
  stormy:  '必ず Buy',
  tornado: '必ず Buy',
};

export default function CityWeatherAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      marginTop: '1.5rem',
      border: '1px solid #2a2a2a',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: '100%',
          background: '#1a1a1a',
          border: 'none',
          color: '#aaa',
          padding: '0.9rem 1.25rem',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
        }}
      >
        <span>都市ごとの天気一覧（デモ用）</span>
        <span style={{ fontSize: '0.7rem' }}>{open ? '▲ 閉じる' : '▼ 開く'}</span>
      </button>

      {open && (
        <div style={{ background: '#111', padding: '1rem 1.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.75rem' }}>
            Location欄にそのまま入力して使用できます
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: '#555', textAlign: 'left' }}>
                <th style={{ padding: '0.4rem 0.75rem 0.4rem 0', fontWeight: 400 }}>都市</th>
                <th style={{ padding: '0.4rem 0.75rem', fontWeight: 400 }}>天気</th>
                <th style={{ padding: '0.4rem 0', fontWeight: 400 }}>Claudeの傾向</th>
              </tr>
            </thead>
            <tbody>
              {cities.map(({ name, weather, icon, condition }) => (
                <tr key={name} style={{ borderTop: '1px solid #1e1e1e' }}>
                  <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', color: '#e0e0e0', fontFamily: 'monospace' }}>
                    {name}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>
                    {icon} {weather}
                  </td>
                  <td style={{ padding: '0.5rem 0', color: urgencyColor[condition], fontSize: '0.8rem' }}>
                    {urgencyLabel[condition]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
