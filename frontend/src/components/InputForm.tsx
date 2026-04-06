import { useState, useEffect } from 'react';
import { AgentRequest, Urgency } from '../types';

interface Props {
  onSubmit: (req: AgentRequest) => void;
  disabled: boolean;
}

const card: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: 10,
  padding: '1.5rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  color: '#888',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#111',
  border: '1px solid #333',
  borderRadius: 6,
  color: '#e0e0e0',
  padding: '0.5rem 0.75rem',
  fontSize: '0.95rem',
};

const readonlyStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'default',
};

export default function InputForm({ onSubmit, disabled }: Props) {
  const [location, setLocation] = useState('Tokyo');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [actualPrice, setActualPrice] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [overScenario, setOverScenario] = useState(false);

  useEffect(() => {
    fetch('/api/agent/price')
      .then((r) => r.json())
      .then((d) => setActualPrice(d.price))
      .catch(() => setActualPrice(0.01));

    fetch('/api/agent/balance')
      .then((r) => r.json())
      .then((d) => setBalance(d.balance))
      .catch(() => setBalance(null));
  }, []);

  const handleSubmit = () => {
    onSubmit({
      location,
      urgency,
      budget: balance ?? 0.1,
      overridePrice: overScenario ? 999 : undefined,
    });
  };

  return (
    <div style={card}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelStyle}>Location</label>
          <input
            style={inputStyle}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Tokyo"
            disabled={disabled}
          />
        </div>

        <div>
          <label style={labelStyle}>Urgency</label>
          <select
            style={inputStyle}
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as Urgency)}
            disabled={disabled}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>実際の価格（バックエンド設定）</label>
          <div style={{ ...readonlyStyle, color: '#60a5fa', fontWeight: 600 }}>
            {actualPrice !== null ? `$${actualPrice} USDC` : '読込中...'}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Budget（ウォレット残高）</label>
          <div style={{ ...readonlyStyle, color: '#40c080', fontWeight: 600 }}>
            {balance !== null ? `$${balance.toFixed(2)} USDC` : '読込中...'}
          </div>
        </div>
      </div>

      {/* 予算超過シナリオ チェックボックス */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: overScenario ? '#a78bfa' : '#666',
        fontSize: '0.88rem',
        userSelect: 'none',
      }}>
        <input
          type="checkbox"
          checked={overScenario}
          onChange={(e) => setOverScenario(e.target.checked)}
          disabled={disabled}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#7c3aed' }}
        />
        予算超過シナリオ ($999) ― Claudeに価格$999として判断させる
      </label>

      {/* Run Agent ボタン（右寄せ） */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          style={{
            padding: '0.75rem 2rem',
            background: disabled ? '#333' : overScenario ? '#7c3aed' : '#2563eb',
            color: disabled ? '#666' : '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {disabled ? 'Running...' : 'Run Agent'}
        </button>
      </div>
    </div>
  );
}
