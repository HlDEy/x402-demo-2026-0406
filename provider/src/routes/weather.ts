import { Router, Request, Response } from 'express';
import { getFreeWeather, getPremiumWeather } from '../services/mockWeather';
import { PREMIUM_PRICE } from '../config';

const router = Router();

router.get('/price', (_req: Request, res: Response) => {
  res.json({ price: PREMIUM_PRICE });
});

router.get('/free', (req: Request, res: Response) => {
  const location = (req.query.location as string) || 'Tokyo';
  res.json(getFreeWeather(location));
});

// x402ミドルウェアで保護（index.tsで設定）
router.get('/premium', (req: Request, res: Response) => {
  const location = (req.query.location as string) || 'Tokyo';
  res.json(getPremiumWeather(location));
});

export default router;
