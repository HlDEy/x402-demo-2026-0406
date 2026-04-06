import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface DecisionInput {
  weather: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  price: number;
  budget: number;
}

export interface DecisionOutput {
  buy: boolean;
  reason: string;
}

export async function decideWithClaude(input: DecisionInput): Promise<DecisionOutput> {
  const { weather, urgency, price, budget } = input;

  const prompt = `あなたはプレミアム天気データを購入するか判断するAIエージェントです。

現在の情報：
- 無料天気データ：${weather}
- 緊急度：${urgency}
- プレミアムデータの価格：${price} USDC
- 予算上限：${budget} USDC

判断基準：
- 緊急度が「critical（最重要）」の場合は天気・価格・予算に関わらず必ず購入する
- 快晴・晴れで緊急度が低い場合、無料データで十分
- 緊急度が高い場合、プレミアムデータは価値がある
- 予算を絶対に超えてはいけない（ただしcriticalの場合は例外）
- 雨天かつ緊急度が中・高の場合は購入する
- 嵐・竜巻の場合は緊急度に関わらず必ず購入する（安全確保のため詳細情報が必須）

JSONのみで回答し、他のテキストは一切含めないこと：
{"buy": true, "reason": "日本語で簡潔な理由"}`;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected Claude response type');

  const raw = content.text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(raw);
  return { buy: Boolean(parsed.buy), reason: String(parsed.reason) };
}
