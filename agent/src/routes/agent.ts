import { Router, Request, Response } from 'express';
import { privateKeyToAccount } from 'viem/accounts';
import { x402Client, wrapFetchWithPayment } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { decideWithClaude } from '../services/aiDecision';
import { getUsdcBalance } from '../services/walletBalance';

export const PREMIUM_PRICE = 0.01;

const router = Router();

router.get('/price', (_req: Request, res: Response) => {
  res.json({ price: PREMIUM_PRICE });
});

router.get('/balance', async (_req: Request, res: Response) => {
  try {
    const balance = await getUsdcBalance();
    res.json({ balance });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

router.post('/run', async (req: Request, res: Response) => {
  const {
    location = 'Tokyo',
    urgency = 'medium',
    budget = 0.1,
    overridePrice,
  } = req.body;

  const priceForClaude = overridePrice ?? PREMIUM_PRICE;
  const PROVIDER_URL = process.env.PROVIDER_URL || 'http://localhost:3001';

  const logs: string[] = [];
  const log = (msg: string) => { console.log(msg); logs.push(msg); };

  try {
    // Step 1: Provider の無料天気を取得
    log('[Agent] Fetching free weather from Provider...');
    const freeRes = await fetch(`${PROVIDER_URL}/weather/free?location=${encodeURIComponent(location)}`);
    const freeWeather = await freeRes.json();
    log(`[Provider] Weather in ${location}: ${freeWeather.weather}`);

    // Step 2: Claude（Agent側）が判断
    log(`[Agent] Evaluating premium data (urgency=${urgency}, price=${priceForClaude} USDC, budget=${budget} USDC)`);
    const decision = await decideWithClaude({ weather: freeWeather.weather, urgency, price: priceForClaude, budget });
    log(`[Claude] Decision: ${decision.buy ? 'BUY' : 'SKIP'}`);
    log(`[Claude] Reason: ${decision.reason}`);

    if (!decision.buy) {
      return res.json({ freeWeather, decision, premiumWeather: null, paid: false, logs });
    }

    // Step 3: Agent のウォレットで自律支払い → Provider のプレミアムAPIを叩く
    log('[Agent] Requesting premium endpoint from Provider...');
    log('[Provider] 402 Payment Required');
    log('[Agent] Executing autonomous payment via x402...');

    const privateKey = process.env.WALLET_PRIVATE_KEY as `0x${string}`;
    const evmSigner = privateKeyToAccount(privateKey);
    const client = new x402Client();
    client.register('eip155:*', new ExactEvmScheme(evmSigner));
    const fetchWithPayment = wrapFetchWithPayment(fetch, client);

    const premiumUrl = `${PROVIDER_URL}/weather/premium?location=${encodeURIComponent(location)}`;
    const premiumResponse = await fetchWithPayment(premiumUrl);

    if (!premiumResponse.ok) throw new Error(`Premium API returned ${premiumResponse.status}`);

    const premiumWeather = await premiumResponse.json();
    log('[Agent] Payment confirmed. Premium data received from Provider.');

    return res.json({ freeWeather, decision, premiumWeather, paid: true, logs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`[Error] ${msg}`);
    return res.status(500).json({ error: msg, logs });
  }
});

export default router;
