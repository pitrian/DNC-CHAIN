# DNC-CertiTrust — Day 3 Log

> **Date:** Jul 20, 2026
> **Focus:** Real-time events, NFT metadata, Proof Registry UI, bug fixes

---

## Summary

Day 3 focused on fixing real-time event watching (replaced wagmi `useWatchContractEvent` with custom polling hook), adding NFT metadata API for wallet display, creating Proof Registry viewer, and fixing contract redeployment after Anvil restart.

---

## Tasks Completed

### 1. Wagmi/RainbowKit config overhaul

| Task | Detail | Status |
|------|--------|--------|
| Explicit config | Switched `getDefaultConfig` → `createConfig` + `connectorsForWallets` | ✅ |
| Explicit transports | Added hardcoded `transports` mapping (chain ID → RPC URL) | ✅ |
| Custom chain | `anvilLocal` via `defineChain` with `http://127.0.0.1:8545` | ✅ |

### 2. NFT metadata API

| Task | Detail | Status |
|------|--------|--------|
| API route | `pages/api/metadata/[hash].ts` — returns ERC-721 compliant JSON | ✅ |
| SVG placeholder | Auto-generated DNC badge SVG with chain info | ✅ |
| Local URI | `issuer.tsx`: changed metadata URI from `vercel.app` → `window.location.origin` | ✅ |

### 3. Real-time event polling (replace `useWatchContractEvent`)

| Task | Detail | Status |
|------|--------|--------|
| New hook | `hooks/useEventPoller.ts` — uses `usePublicClient` + `getLogs` + `setInterval` (2s) | ✅ |
| DegreeCard | Replaced `useWatchContractEvent(DegreeMinted)` with `useEventPoller` | ✅ |
| EventStream | Replaced 3 `useWatchContractEvent` calls with `useEventPoller` | ✅ |
| Auto-refetch | Added `refetchInterval: 3000` to `getDegreesByOwner` | ✅ |

### 4. Proof Registry Card (dashboard)

| Task | Detail | Status |
|------|--------|--------|
| Component | `components/ProofRegistryCard.tsx` — lookup + event feed | ✅ |
| Lookup | Input file hash → `getProof` → show issuer, timestamp, status | ✅ |
| Recent registrations | Polls `DocumentRegistered` events, deduped by fileHash | ✅ |
| Recent verifications | Polls `DocumentVerified` events, shows valid/invalid badge | ✅ |
| Dashboard | Added `ProofRegistryCard` between DegreeCard and Network Stats | ✅ |

### 5. EventStream improvements

| Task | Detail | Status |
|------|--------|--------|
| DegreeMinted | Added `DegreeMinted` event to EventStream (purple badge, shows token ID) | ✅ |
| Badge colors | Added purple for `minted`, fixed badge styling | ✅ |

### 6. Bug fixes

| Task | Detail | Status |
|------|--------|--------|
| Anvil restart | Redeployed contracts (Anvil ephemeral — lost state on restart) | ✅ |
| Wrong deployer | Used Foundry default sender accidentally, redeployed with `--private-key 0xac09..` | ✅ |
| useProofData | Exposed `error` field from `useReadContract` | ✅ |

---

## Known Issues

| Issue | Note |
|-------|------|
| Anvil ephemeral | Restart loses contract state — must redeploy. Consider `anvil --state anvil-state` for persistence. |
| Arbitrum Sepolia deploy | Pending — need faucet ETH first. |
| Production frontend | Pending — need to deploy to Vercel. |
| NFT metadata | Basic SVG placeholder only. No actual diploma PDF/image stored. |

---

## Deployment Addresses (Anvil Local)

| Contract | Address |
|----------|---------|
| **DNCAccessControl** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **DNCProofRegistry** | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **DNCUniversityDegree** | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| **Anvil RPC** | `http://127.0.0.1:8545` |
| **Chain ID** | `31337` |

---

## Quick Start (After This Session)

```bash
# Terminal 1: Anvil (persistent state)
anvil --state anvil-state

# Terminal 2: Deploy contracts
cd contracts
forge script script/Deploy.s.sol:DeployLocalScript \
  --rpc-url http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

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

## Next Steps

1. Add `--state anvil-state` to Anvil command for persistence across restarts
2. Deploy to Arbitrum Sepolia (need faucet ETH)
3. Deploy frontend to Vercel
4. Store actual diploma PDF/IPFS and reference in NFT metadata
5. Add Besu QBFT network (Phase 2)
6. Add issuer filtering to ProofRegistryCard

---

<p align="center">
  <i>Next: Arbitrum Sepolia deployment + Vercel</i>
</p>
