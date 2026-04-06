import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import agentRouter from './routes/agent';

const app = express();
const PORT = process.env.PORT || 3002;

if (!process.env.WALLET_PRIVATE_KEY) {
  console.error('Missing WALLET_PRIVATE_KEY in .env');
  process.exit(1);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in .env');
  process.exit(1);
}

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/agent', agentRouter);

app.listen(PORT, () => {
  console.log(`[Agent] Listening on http://localhost:${PORT}`);
  console.log(`[Agent] Provider URL: ${process.env.PROVIDER_URL || 'http://localhost:3001'}`);
});
