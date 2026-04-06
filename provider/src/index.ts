import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { HTTPFacilitatorClient } from '@x402/core/server';
import weatherRouter from './routes/weather';

const app = express();
const PORT = process.env.PORT || 3001;
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://x402.org/facilitator';
const EVM_ADDRESS = process.env.EVM_ADDRESS as `0x${string}`;

if (!EVM_ADDRESS) {
  console.error('Missing EVM_ADDRESS in .env');
  process.exit(1);
}

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });

// Agent serverからのリクエストを許可
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3002'] }));
app.use(express.json());

// /weather/premium を x402 で保護
app.use(
  paymentMiddleware(
    {
      'GET /weather/premium': {
        accepts: [
          {
            scheme: 'exact',
            price: '$0.01',
            network: 'eip155:84532', // Base Sepolia
            payTo: EVM_ADDRESS,
          },
        ],
        description: 'Premium weather data',
        mimeType: 'application/json',
      },
    },
    new x402ResourceServer(facilitatorClient).register('eip155:84532', new ExactEvmScheme()),
  ),
);

app.use('/weather', weatherRouter);

app.listen(PORT, () => {
  console.log(`[Provider] Listening on http://localhost:${PORT}`);
  console.log(`[Provider] Wallet: ${EVM_ADDRESS}`);
});
