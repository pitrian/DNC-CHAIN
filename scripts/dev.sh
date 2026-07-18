#!/bin/bash
set -e
echo "Starting Anvil..."
anvil --host 0.0.0.0 --port 8545 &
ANVIL_PID=$!
echo "Anvil PID: $ANVIL_PID"

echo "Starting Next.js..."
cd /home/minhchung/dnc-chain/frontend
npx next dev -p 3000 &
NEXT_PID=$!
echo "Next.js PID: $NEXT_PID"

echo ""
echo "==========================================="
echo "  DNC-CertiTrust Local Dev Environment"
echo "==========================================="
echo "  Anvil:      http://localhost:8545"
echo "  Frontend:   http://localhost:3000"
echo "  Chain ID:   31337"
echo "==========================================="
echo "  Press Ctrl+C to stop all services"
echo "==========================================="
echo ""

trap "kill $ANVIL_PID $NEXT_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
