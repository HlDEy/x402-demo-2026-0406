import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import LogDisplay from './components/LogDisplay';
import CityWeatherAccordion from './components/CityWeatherAccordion';
import { AgentRequest, AgentResponse, Status } from './types';

export default function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (req: AgentRequest) => {
    setStatus('thinking');
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      const data: AgentResponse & { error?: string } = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Unknown error');
        setStatus('error');
        if (data.logs) setResult({ ...data, freeWeather: data.freeWeather ?? { weather: 'cloudy' }, decision: data.decision ?? { buy: false, reason: '' }, premiumWeather: null, paid: false });
        return;
      }

      // Show paying status briefly if payment was made
      if (data.paid) {
        setStatus('paying');
        await new Promise((r) => setTimeout(r, 800));
      }

      setResult(data);
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  };

  const statusLabel: Record<Status, string> = {
    idle: 'Ready',
    thinking: 'Claude is thinking...',
    paying: 'Paying via x402...',
    done: 'Done',
    error: 'Error',
  };

  const statusColor: Record<Status, string> = {
    idle: '#888',
    thinking: '#f0c040',
    paying: '#40a0f0',
    done: '#40c080',
    error: '#f05040',
  };

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
          x402 AI Agent Demo
        </h1>
        <p style={{ color: '#888', marginTop: '0.4rem', fontSize: '0.9rem' }}>
          Claude decides autonomously whether to pay for premium weather data via x402
        </p>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: statusColor[status],
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span style={{ color: statusColor[status], fontSize: '0.9rem' }}>{statusLabel[status]}</span>
      </div>

      <InputForm onSubmit={run} disabled={status === 'thinking' || status === 'paying'} />

      {error && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#2a1010', borderRadius: 8, color: '#f05040', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {result && <ResultDisplay result={result} />}
      {result?.logs && <LogDisplay logs={result.logs} />}
      <CityWeatherAccordion />
    </div>
  );
}
