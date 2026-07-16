#!/bin/bash
set -e

echo "=== DNC-CertiTrust Local Deployment ==="

# Start Anvil in background
echo "[1/4] Starting Anvil local node..."
anvil --block-time 2 &
ANVIL_PID=$!
sleep 2

# Deploy contracts
echo "[2/4] Deploying contracts..."
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --broadcast \
    -vvv

echo "[3/4] Exporting contract addresses..."
echo "Check broadcast/ directory for deployed addresses."

echo "[4/4] Done!"
echo "Local node running at http://localhost:8545"
echo "Press Ctrl+C to stop."

wait $ANVIL_PID
