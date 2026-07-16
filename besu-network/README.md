# DNC-CertiTrust — Hyperledger Besu QBFT Network

Permissioned blockchain network for Phase 2 of the DNC-CertiTrust project.

## Architecture

- **4 QBFT validator nodes** (Docker containers)
- **Chain ID:** 2025
- **Block time:** 2 seconds
- **Consensus:** QBFT (Istanbul 2.0)
- **Gas limit:** 2^63-1

## Prerequisites

- Docker & Docker Compose v2
- OpenSSL

## Quick Start

```bash
# 1. Generate keys and genesis file
cd besu-network
./scripts/setup.sh

# 2. Start the network
docker compose up -d

# 3. Check logs
docker compose logs -f

# 4. Check node status
curl http://localhost:8545 \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## RPC Endpoints

| Node | JSON-RPC | WebSocket |
|------|----------|-----------|
| node1 | http://localhost:8545 | ws://localhost:8546 |
| node2 | http://localhost:8546 | (internal) |
| node3 | http://localhost:8547 | (internal) |
| node4 | http://localhost:8548 | (internal) |

## Deploy Smart Contracts

```bash
# Set RPC URL
export RPC_URL=http://localhost:8545

# Deploy using Foundry
cd contracts
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key <deployer-key> \
  --broadcast
```

## Network Details

- **Consensus:** QBFT (Byzantine Fault Tolerant)
- **Validators:** 4 (tolerates 1 faulty node)
- **Block period:** 2 seconds
- **Epoch length:** 30,000 blocks
- **Permissioning:** On-chain (planned)

## Directory Structure

```
besu-network/
├── config/
│   └── genesis.json          # QBFT genesis config
├── data/
│   ├── node1/key             # Node 1 private key
│   ├── node1/address         # Node 1 validator address
│   ├── node1/enode-id        # Node 1 enode URL
│   ├── node2/...
│   ├── node3/...
│   └── node4/...
├── scripts/
│   └── setup.sh              # Key generation & genesis builder
├── docker-compose.yml        # Docker Compose orchestration
├── .env                      # Enode IDs for bootnode config
└── README.md                 # This file
```
