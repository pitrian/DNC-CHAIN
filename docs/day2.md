# DNC-CertiTrust — Day 2 Log

> **Date:** Jul 16–18, 2026
> **Focus:** Frontend completion, TypeScript fixes, local deploy, Besu prep

---

## Summary

Day 2 focused on completing the frontend (fixing TypeScript errors, improving error handling), deploying to Anvil local, setting up the GitHub repo, and preparing Phase 2 infrastructure (Besu QBFT).

---

## Tasks Completed

### 1. Frontend — npm install & TypeScript fixes

| Task | Detail | Status |
|------|--------|--------|
| Install npm deps | `cd frontend && npm install` | ✅ |
| Fix tsconfig | `target: "es5"` → `"es2020"` (BigInt support) | ✅ |
| Fix issuer.tsx | Remove `{ args: [...] }` wrapper, call hooks directly | ✅ |
| Fix verifier.tsx | Replace `verifyProof` write tx with `useProofData` read hook (gasless) | ✅ |
| Fix useContract.ts | Add `useProofData` hook for `getProof` read | ✅ |
| TypeScript | `npx tsc --noEmit` passes with **0 errors** | ✅ |

### 2. Frontend — Error handling improvements

| Task | Detail | Status |
|------|--------|--------|
| Transaction tracking | issuer.tsx: `useWaitForTransactionReceipt` for confirmations | ✅ |
| Tx hash exposure | Hooks return `txHash` from `useWriteContract` | ✅ |
| Proof read (gasless) | verifier.tsx: read proof data without writing a transaction | ✅ |
| Error messages | Show revert reason instead of generic "failed" | ✅ |

### 3. Frontend — Chain configuration

| Task | Detail | Status |
|------|--------|--------|
| WalletConnect ID | Set `bd3720a513eeaf9382a663b7139a3eac` in `.env.local` | ✅ |
| Chain config | `_app.tsx`: use `hardhat` chain for Anvil (chain ID 31337) | ✅ |
| Env vars | `NEXT_PUBLIC_*` populated with deployed contract addresses | ✅ |
| Dev mode | `npm run dev` starts successfully | ✅ |

### 4. GitHub

| Task | Detail | Status |
|------|--------|--------|
| Repo | Created at `https://github.com/pitrian/DNC-CHAIN` | ✅ |
| Push | Code pushed to `main` branch | ✅ |
| .gitignore | Added contracts/broadcast, besu-network/data, besu-network/.env | ✅ |

### 5. Deploy to Anvil local

| Task | Detail | Status |
|------|--------|--------|
| Anvil | Started on `localhost:8545`, chain ID 31337 | ✅ |
| Deploy script | `forge script DeployLocalScript` | ✅ |
| DNCAccessControl | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | ✅ |
| DNCProofRegistry | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` | ✅ |
| DNCUniversityDegree | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | ✅ |

### 6. Pitch Deck

| Task | Detail | Status |
|------|--------|--------|
| Slides | `docs/pitch-deck.md` — 14 slides, Marp format | ✅ |
| Content | Problem, Solution, Architecture, Roadmap, Demo, Impact, CTA | ✅ |

### 7. Besu QBFT Network (Phase 2 prep)

| Task | Detail | Status |
|------|--------|--------|
| Docker Compose | `besu-network/docker-compose.yml` — 4 validator nodes | ✅ |
| Setup script | `besu-network/scripts/setup.sh` — key generation + genesis builder | ✅ |
| README | `besu-network/README.md` — full usage guide | ✅ |
| .gitignore | Excludes generated keys/data | ✅ |

---

## Known Issues

| Issue | Note |
|-------|------|
| SIGBUS on `next build` | WSL2 RAM constraint (3.6GB). Use `npm run dev` instead. |
| Arbitrum Sepolia deploy | Pending — need faucet ETH first. |
| Production frontend | Pending — need to deploy to Vercel. |

---

## Deployment Addresses (Anvil Local)

| Contract | Address |
|----------|---------|
| **DNCAccessControl** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **DNCProofRegistry** | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **DNCUniversityDegree** | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| **Anvil RPC** | `http://localhost:8545` |
| **Chain ID** | `31337` |

---

## Quick Start (After This Session)

```bash
# Terminal 1: Anvil
anvil

# Terminal 2: Deploy contracts
cd contracts
forge script script/Deploy.s.sol:DeployLocalScript \
  --rpc-url http://localhost:8545 --broadcast

# Terminal 3: Frontend
cd frontend
npm run dev
# → http://localhost:3000
```

---

## Repository

- **GitHub:** `https://github.com/pitrian/DNC-CHAIN`
- **Branch:** `main`

---

<p align="center">
  <i>Next: Deploy to Arbitrum Sepolia + Vercel</i>
</p>
