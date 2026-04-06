import { Router, Request, Response } from 'express';
import { getFreeWeather, getPremiumWeather } from '../services/mockWeather';

const router = Router();

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
