#!/usr/bin/env bash
set -euo pipefail

BESU_IMAGE="hyperledger/besu:24.12.1"
NETWORK_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_DIR="$NETWORK_DIR/config"
DATA_DIR="$NETWORK_DIR/data"

echo "=== DNC-CertiTrust Besu QBFT Network Setup ==="
echo ""

# Pull Besu image
echo "Pulling Besu image..."
docker pull "$BESU_IMAGE" 2>/dev/null || true

# Generate keys for each node
for i in 1 2 3 4; do
  NODE_DIR="$DATA_DIR/node$i"
  mkdir -p "$NODE_DIR"

  if [ ! -f "$NODE_DIR/key" ]; then
    echo "Generating key for node$i..."
    # Generate 32-byte hex private key
    KEY=$(openssl rand -hex 32)
    echo "$KEY" > "$NODE_DIR/key"
    echo "$KEY"

    # Generate node ID (public key)
    docker run --rm \
      -v "$NODE_DIR:/data" \
      "$BESU_IMAGE" \
      --node-private-key-file=/data/key \
      public-key export \
      --to-eth-address 2>/dev/null \
      > "$NODE_DIR/address" || true
  fi

  if [ -f "$NODE_DIR/address" ]; then
    ADDRESS=$(cat "$NODE_DIR/address")
  else
    ADDRESS="0x0000000000000000000000000000000000000000"
  fi

  # Get enode ID
  docker run --rm \
    -v "$NODE_DIR:/data" \
    "$BESU_IMAGE" \
    --node-private-key-file=/data/key \
    public-key export 2>/dev/null \
    > "$NODE_DIR/enode-id" || echo "pending" > "$NODE_DIR/enode-id"

  ENODE_ID=$(cat "$NODE_DIR/enode-id")
  echo "  node$i address: $ADDRESS"
  echo "  node$i enode:   ${ENODE_ID:0:20}..."

  export "NODE${i}_ADDRESS=$ADDRESS"
  export "NODE${i}_ENODE_ID=$ENODE_ID"
done

echo ""
echo "Generating genesis.json..."

cat > "$CONFIG_DIR/genesis.json" << GENESIS_EOF
{
  "config": {
    "chainId": 2025,
    "londonBlock": 0,
    "qbft": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4
    },
    "ethash": {}
  },
  "nonce": "0x0",
  "timestamp": "0x0",
  "extraData": "0x",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "alloc": {
    "${NODE1_ADDRESS:-0x0000000000000000000000000000000000000001}": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "${NODE2_ADDRESS:-0x0000000000000000000000000000000000000002}": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "${NODE3_ADDRESS:-0x0000000000000000000000000000000000000003}": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    },
    "${NODE4_ADDRESS:-0x0000000000000000000000000000000000000004}": {
      "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
    }
  }
}
GENESIS_EOF

echo "  -> Genesis written to $CONFIG_DIR/genesis.json"

# Generate .env for docker-compose
cat > "$NETWORK_DIR/.env" << ENV_EOF
NODE1_NODEID=${NODE1_ENODE_ID:-pending}
NODE2_NODEID=${NODE2_ENODE_ID:-pending}
NODE3_NODEID=${NODE3_ENODE_ID:-pending}
NODE4_NODEID=${NODE4_ENODE_ID:-pending}
ENV_EOF

echo "  -> .env written for docker-compose"
echo ""
echo "=== Setup Complete ==="
echo ""
echo "QBFT Validators:"
for i in 1 2 3 4; do
  ADDR=$(cat "$DATA_DIR/node$i/address" 2>/dev/null || echo "pending")
  echo "  Validator $i: $ADDR"
done
echo ""
echo "To start the network:"
echo "  cd besu-network && docker compose up -d"
echo ""
echo "To monitor logs:"
echo "  docker compose logs -f"
