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

  const prompt = `あなたは自律的に判断するAIエージェントです。
以下の状況でプレミアム天気データを購入すべきか、あなた自身の判断で決めてください。

現在の情報：
- 無料天気データ：${weather}
- 緊急度：${urgency}（low / medium / high / critical）
- プレミアムデータの価格：${price} USDC
- 予算上限：${budget} USDC

条件：予算を超える支払いはできません。それ以外はあなたの判断に委ねます。

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
