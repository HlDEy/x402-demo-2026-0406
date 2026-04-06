# x402 AI Agent Demo v2

x402-demoの改善版。**Provider（API提供者）** と **Agent（AIエージェント）** を別サーバーに分離し、本来のx402の思想に近い構成にしたデモです。

---

## v1との違い

| | v1（x402-demo） | v2（このリポジトリ） |
|--|----------------|------------------|
| サーバー数 | 1つ | 3つ（provider / agent / frontend） |
| ウォレット管理 | 1つの.envに両方 | provider/.env と agent/.env に分離 |
| Claudeの場所 | サービス内 | Agent側のみ |
| APIキー | 1つ | 2つ（役割を分離） |

---

## アーキテクチャ

```
【Provider Server :3001】          【Agent Server :3002】
  天気APIを提供・販売                  ユーザー側のAIエージェント
  EVM_ADDRESS（受取）                  WALLET_PRIVATE_KEY（支払）
                              ←──     ANTHROPIC_API_KEY（Claude判断）
  /weather/free  → 無料              /agent/run → フロントから呼ばれる
  /weather/premium → x402保護
        ↑
    Base Sepolia（テストUSDC）

【Frontend :5173】
  ユーザーの操作画面 → Agent Serverに接続
```

---

## セットアップ手順

### 1. クローン

```bash
git clone https://github.com/HlDEy/x402-demo-2026-0406.git
cd x402-demo-2026-0406
```

### 2. Node.js の確認

```bash
node -v   # 18以上であればOK
```

### 3. .env ファイルの作成

**Provider側** (`provider/.env`)：

```bash
cp provider/.env.example provider/.env
```

| 変数 | 内容 |
|------|------|
| `EVM_ADDRESS` | 受取ウォレットのアドレス（0x...） |

**Agent側** (`agent/.env`)：

```bash
cp agent/.env.example agent/.env
```

| 変数 | 内容 |
|------|------|
| `WALLET_PRIVATE_KEY` | 支払いウォレットの秘密鍵（Base Sepolia専用） |
| `ANTHROPIC_API_KEY` | Anthropic APIキー（Claude判断用） |

### 4. テスト用トークンの取得（初回のみ）

`WALLET_PRIVATE_KEY` のアドレスに対して：

1. テストETH → https://www.alchemy.com/faucets/base-sepolia
2. テストUSDC → https://faucet.circle.com（Base Sepoliaを選択）

### 5. 起動

```bash
bash start.sh
```

3つのターミナルが自動で開き、ブラウザが起動します。

---

## 技術スタック

| 区分 | 技術 |
|------|------|
| フロントエンド | React + Vite + TypeScript |
| Provider | Node.js + Express + @x402/express |
| Agent | Node.js + Express + @x402/fetch + Claude API |
| AI判断 | claude-haiku-4-5-20251001 |
| ウォレット操作 | viem |
| チェーン | Base Sepolia |
| 通貨 | テストUSDC |
