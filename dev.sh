#!/bin/bash
# .env 設定済みの前提でサーバーを起動するスクリプト

DIR="$(cd "$(dirname "$0")" && pwd)"

# .env の存在チェック
if grep -q "your_" "$DIR/provider/.env" 2>/dev/null || [ ! -f "$DIR/provider/.env" ]; then
  echo "provider/.env が未設定です。先に bash start.sh を実行してください。"
  exit 1
fi
if grep -q "your_" "$DIR/agent/.env" 2>/dev/null || [ ! -f "$DIR/agent/.env" ]; then
  echo "agent/.env が未設定です。先に bash start.sh を実行してください。"
  exit 1
fi

echo "サーバーを起動中..."

osascript -e "tell application \"Terminal\"
  activate
  do script \"echo '=== Provider (port 3001) ===' && cd '$DIR/provider' && npm run dev\"
end tell"

sleep 1

osascript -e "tell application \"Terminal\"
  activate
  do script \"echo '=== Agent (port 3002) ===' && cd '$DIR/agent' && npm run dev\"
end tell"

sleep 1

osascript -e "tell application \"Terminal\"
  activate
  do script \"echo '=== Frontend (port 5173) ===' && cd '$DIR/frontend' && npm run dev\"
end tell"

sleep 3

open http://localhost:5173

echo "起動しました！"
echo "   Provider: http://localhost:3001"
echo "   Agent:    http://localhost:3002"
echo "   Frontend: http://localhost:5173"
