# DNC-CertiTrust — Day 3 Log

> **Date:** Jul 20, 2026
> **Focus:** Full DNC-CertiTrust ecosystem — events, multi-role, verify, wallet, analytics

---

## Summary

Day 3 completed all 3 pillars of the DNC-CertiTrust Tầng 1 ecosystem: real-time event watching & Proof Registry (Session 1), multi-role contract/frontend + public verify page + citizen wallet + public branding assets (Session 2), and analytics dashboard with monthly charts (Session 3).

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

### 6. Multi-Role contract & frontend (Session 2)

| Task | Detail | Status |
|------|--------|--------|
| Contract roles | Added `EDUCATION_ROLE` + `SCIENCE_TECH_ROLE` to `DNCAccessControl.sol` | ✅ |
| Modifiers | `DNCUniversityDegree.mintDegree` → `onlyEducation`, `DNCProofRegistry.registerProof` → `onlyScienceTech` | ✅ |
| Deploy script | Grants EDUCATION + SCIENCE_TECH roles to deployer | ✅ |
| Frontend hooks | `useIsEducation`, `useIsScienceTech` in `useContract.ts` | ✅ |
| Role-aware issuer | `issuer.tsx` shows mint/register buttons based on user roles | ✅ |
| Admin panel | `dashboard.tsx` AdminPanel adds per-role grant/revoke for AUTHORITY, EDUCATION, SCIENCE_TECH | ✅ |

### 7. Public assets & branding

| Task | Detail | Status |
|------|--------|--------|
| Logo SVG | `public/assets/logo.svg` — DNC branding shield | ✅ |
| Favicon | `public/favicon.svg` + `_document.tsx` | ✅ |
| Layout | `Layout.tsx` — logo in header, "My Wallet" nav link | ✅ |

### 8. Pillar 1 — Verify Public (verifier.tsx)

| Task | Detail | Status |
|------|--------|--------|
| UI | Vietnamese, DNC logo header, 3 visual states | ✅ |
| Valid | Green icon + "Tài liệu hợp lệ" with full proof details | ✅ |
| Not Found | Red "Không tìm thấy hồ sơ" | ✅ |
| Revoked | Yellow "Đã bị thu hồi" | ✅ |
| No wallet needed | Uses `useReadContract` without `useAccount` | ✅ |

### 9. Pillar 2 — Citizen Wallet (wallet.tsx)

| Task | Detail | Status |
|------|--------|--------|
| Wallet connect | RainbowKit in wallet page | ✅ |
| Degree list | Left panel — owned degrees from `getDegreesByOwner`, live-updated (5s) | ✅ |
| Degree detail | Right panel — metadata image, info, QR code, copy link | ✅ |

### 10. Analytics Dashboard

| Task | Detail | Status |
|------|--------|--------|
| Install recharts | `npm install recharts` | ✅ |
| Analytics hook | `hooks/useAnalyticsData.ts` — polls DegreeMinted, DocumentRegistered, DocumentVerified events | ✅ |
| Summary stats | 3 stat cards: total degrees, total proofs, total verifications | ✅ |
| Monthly chart | Combined bar chart: degrees & proofs per month via recharts `BarChart` | ✅ |
| Integration | `dashboard.tsx` — full-width Analytics section below main grid | ✅ |

### 11. TypeScript & cleanup

| Task | Detail | Status |
|------|--------|--------|
| TypeScript check | `npx tsc --noEmit` passes with 0 errors | ✅ |

---

## Known Issues

| Issue | Note |
|-------|------|
| Anvil ephemeral | Restart loses contract state — must redeploy. Consider `anvil --state anvil-state` for persistence. |
| Arbitrum Sepolia deploy | Pending — need faucet ETH first. |
| Production frontend | Pending — need to deploy to Vercel. |
| NFT metadata | Basic SVG placeholder only. No actual diploma PDF/image stored. |

---

## Deployment Addresses (Anvil Local — after multi-role redeploy)

| Contract | Address |
|----------|---------|
| **DNCAccessControl** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **DNCProofRegistry** | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |
| **DNCUniversityDegree** | `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` |
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

1. Deploy to Arbitrum Sepolia (need faucet ETH)
2. Deploy frontend to Vercel
3. Store actual diploma PDF/IPFS and reference in NFT metadata
4. Add Besu QBFT network (Phase 2)
5. Add issuer filtering to ProofRegistryCard
6. Add `--state anvil-state` to Anvil command for persistence across restarts

---

<p align="center">
  <i>Next: Arbitrum Sepolia deployment + Vercel</i>
</p>
