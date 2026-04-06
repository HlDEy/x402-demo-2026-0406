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

  const prompt = `あなたは天気データの購入を判断するAIエージェントです。
以下の状況でプレミアム天気データを購入すべきか判断してください。

現在の情報：
- 無料天気データ：${weather}
- 緊急度：${urgency}（low / medium / high / critical）
- プレミアムデータの価格：${price} USDC
- 予算上限：${budget} USDC

判断基準：
- stormy・tornado などの異常気象は緊急度に関わらず購入する
- rainy は緊急度が high 以上なら購入する（low・medium なら不要）
- cloudy・sunny・clear は緊急度が high 以上でないと購入不要
- 予算を超える支払いは絶対にしない

注意：無料データの情報量について言及しないこと。天気の深刻度と緊急度のみを理由にすること。

理由は「〜と判断しました」「〜のため購入します」のような、AIエージェントとして自然な日本語の一文で書いてください。

JSONのみで回答し、他のテキストは一切含めないこと：
{"buy": true, "reason": "ここに理由"}`;

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
