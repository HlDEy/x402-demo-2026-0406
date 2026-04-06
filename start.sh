#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "================================================"
echo "  x402 AI Agent Demo (Provider / Agent 分離)"
echo "================================================"
echo ""

if ! command -v node &> /dev/null; then
  echo "❌ Node.js がインストールされていません。"
  echo "   https://nodejs.org からLTS版をインストールしてください。"
  exit 1
fi

# Provider .env セットアップ
PROVIDER_ENV="$DIR/provider/.env"
if [ ! -f "$PROVIDER_ENV" ] || grep -q "your_" "$PROVIDER_ENV" 2>/dev/null; then
  echo "🏪 [Provider] ウォレット情報を入力してください。"
  echo ""
  read -p "Provider: 受取ウォレット アドレス (0x...): " EVM_ADDRESS
  echo ""
  cat > "$PROVIDER_ENV" << EOF
EVM_ADDRESS=$EVM_ADDRESS
FACILITATOR_URL=https://x402.org/facilitator
PORT=3001
EOF
  echo "✅ Provider設定を保存しました。"
  echo ""
fi

# Agent .env セットアップ
AGENT_ENV="$DIR/agent/.env"
if [ ! -f "$AGENT_ENV" ] || grep -q "your_" "$AGENT_ENV" 2>/dev/null; then
  echo "🤖 [Agent] APIキーとウォレット情報を入力してください。"
  echo ""
  read -p "Agent: 支払いウォレット 秘密鍵 (0x...): " WALLET_PRIVATE_KEY
  read -p "Agent: Anthropic API Key: " AGENT_ANTHROPIC_KEY
  echo ""
  cat > "$AGENT_ENV" << EOF
WALLET_PRIVATE_KEY=$WALLET_PRIVATE_KEY
ANTHROPIC_API_KEY=$AGENT_ANTHROPIC_KEY
PROVIDER_URL=http://localhost:3001
PORT=3002
EOF
  echo "✅ Agent設定を保存しました。"
  echo ""
fi

echo "📦 依存パッケージをインストール中..."
cd "$DIR/provider" && npm install --silent
cd "$DIR/agent" && npm install --silent
cd "$DIR/frontend" && npm install --silent
echo "✅ インストール完了"
echo ""

echo "🚀 サーバーを起動中..."

osascript -e "tell application \"Terminal\"
  activate
  do script \"echo '=== Provider (port 3001) ===' && cd '$DIR/provider' && npm run dev\"
end tell"

sleep 2

osascript -e "tell application \"Terminal\"
  activate
  do script \"echo '=== Agent (port 3002) ===' && cd '$DIR/agent' && npm run dev\"
end tell"

sleep 2

osascript -e "tell application \"Terminal\"
  activate
  do script \"echo '=== Frontend (port 5173) ===' && cd '$DIR/frontend' && npm run dev\"
end tell"

sleep 4

echo "🌐 ブラウザを開いています..."
open http://localhost:5173

echo ""
echo "✅ 起動しました！"
echo "   Provider: http://localhost:3001"
echo "   Agent:    http://localhost:3002"
echo "   Frontend: http://localhost:5173"
echo ""
echo "終了するには、各ターミナルで Command+C を押してください。"
