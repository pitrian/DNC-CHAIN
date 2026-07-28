# DNC-CertiTrust — Day 4 Log

> **Date:** Jul 28, 2026
> **Focus:** Hoàn thiện SP1 + SP2 — role-based issuer portal, tra cứu & thu hồi, dark theme

---

## Summary

Day 4 restructured the monolithic issuer page into 3 role-based pages, added revocation/lookup UI across all issuer portals, converted remaining light-theme pages to dark theme, and polished the FileUploader UX. The focus was on completing SP1 (Document Proof Registry) and SP2 (Degree Verification) to a production-ready state.

---

## Tasks Completed

### 1. Issuer Portal Restructuring

| Task | Detail | Status |
|------|--------|--------|
| Split page | `pages/issuer.tsx` → `pages/issuer/{index,education,science,authority}.tsx` | ✅ |
| Hub page | `/issuer` — role cards showing available portals based on user's roles | ✅ |
| Education page | `/issuer/education` — `EDUCATION_ROLE` \|\| `AUTHORITY_ROLE`, emerald theme | ✅ |
| Science page | `/issuer/science` — `SCIENCE_TECH_ROLE` \|\| `AUTHORITY_ROLE`, blue theme | ✅ |
| Authority page | `/issuer/authority` — `AUTHORITY_ROLE` only, amber/gold premium theme | ✅ |
| Granular routes | `ProtectedRoute` updated with `'education'`, `'science'`, `'authority'` roles | ✅ |
| Dynamic accent | `IssuerLayout` detects route path and applies emerald/blue/amber theming | ✅ |

### 2. Revocation & Lookup UI

| Task | Detail | Status |
|------|--------|--------|
| `useDegreesByOwner` hook | Read contract `getDegreesByOwner(address)` → `bigint[]` token IDs | ✅ |
| `useDegreeTokenURI` hook | Read contract `tokenURI(tokenId)` → metadata URI string | ✅ |
| `useDegreeLocked` hook | Read contract `locked(tokenId)` → bool (always true for soulbound) | ✅ |
| Education lookup | Input owner address → list token IDs with URI + lock status + Revoke button | ✅ |
| Science lookup | Input file hash → show proof details (timestamp, issuer, revoked) + Revoke button | ✅ |
| Authority lookup | Both degree lookup (by owner) and proof lookup (by hash) in collapsible sections | ✅ |
| Tx confirmation | `useWaitForTransactionReceipt` for burn/revoke transactions with status messages | ✅ |

### 3. Dark Theme Conversion

| Task | Detail | Status |
|------|--------|--------|
| `de-an.tsx` | Full conversion: `text-dnc-blue-900` → `text-slate-100`, `bg-amber-50/white` → `card`/`bg-*-500/5` | ✅ |
| `verifier.tsx` | Full conversion: light green/yellow/red result cards → dark theme variants with `bg-*-500/10` | ✅ |

### 4. FileUploader Improvements

| Task | Detail | Status |
|------|--------|--------|
| File info display | Shows filename + human-readable size + SHA-256 hash after successful upload | ✅ |
| Remove button | "Xoá file" button to clear uploaded file and reset state | ✅ |
| Visual feedback | Hash displayed in monospace font with copy-friendly styling | ✅ |

### 5. Shared Components

| Task | Detail | Status |
|------|--------|--------|
| `BatchIssuance.tsx` | Extracted from old issuer page, supports `accent` prop (emerald/blue/amber) | ✅ |
| `RoleBadge.tsx` | Shared role indicator component | ✅ |
| `RoleBanner.tsx` | Shared role summary banner with address display | ✅ |

### 6. Code Cleanup & TypeScript

| Task | Detail | Status |
|------|--------|--------|
| Unicode fixes | All `\uxxxx` escapes replaced with proper UTF-8 Vietnamese text | ✅ |
| TypeScript check | `npx tsc --noEmit` passes with 0 errors | ✅ |
| Git push | Committed and pushed to `main` | ✅ |

---

## Files Created / Modified

| File | Change |
|------|--------|
| `frontend/src/pages/issuer/index.tsx` | **New** — issuer hub with role cards |
| `frontend/src/pages/issuer/education.tsx` | **New** — education role page with mint + lookup/revoke |
| `frontend/src/pages/issuer/science.tsx` | **New** — science role page with register proof + lookup/revoke |
| `frontend/src/pages/issuer/authority.tsx` | **New** — authority role page with all features + lookup/revoke |
| `frontend/src/components/IssuerLayout.tsx` | **New** — dynamic accent layout |
| `frontend/src/components/ProtectedRoute.tsx` | Updated — granular role checks |
| `frontend/src/components/BatchIssuance.tsx` | Updated — `accent` prop support |
| `frontend/src/components/FileUploader.tsx` | Updated — file info + remove button |
| `frontend/src/components/RoleBadge.tsx` | **New** — role indicator |
| `frontend/src/components/RoleBanner.tsx` | **New** — role summary banner |
| `frontend/src/hooks/useContract.ts` | Updated — added `useDegreesByOwner`, `useDegreeTokenURI`, `useDegreeLocked` |
| `frontend/src/pages/de-an.tsx` | Rewritten — dark theme conversion |
| `frontend/src/pages/verifier.tsx` | Rewritten — dark theme conversion |

---

## Deployment Addresses (Anvil Local)

| Contract | Address |
|----------|---------|
| **DNCAccessControl** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **DNCProofRegistry** | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |
| **DNCUniversityDegree** | `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9` |
| **Anvil RPC** | `http://127.0.0.1:8545` |
| **Chain ID** | `31337` |

---

## Repository

- **GitHub:** `https://github.com/pitrian/DNC-CHAIN`
- **Branch:** `main`
- **Commit:** `4f5dc4c` — "hoàn thiện SP1+SP2: tra cứu & thu hồi văn bằng/bằng chứng, dark theme cho verifier & đề án"

---

## Next Steps

1. Deploy to Arbitrum Sepolia (need faucet ETH)
2. Deploy frontend to Vercel
3. Store actual diploma PDF/IPFS and reference in NFT metadata
4. Add Besu QBFT network (Phase 2)

---

<p align="center">
  <i>Next: Arbitrum Sepolia deployment + Vercel</i>
</p>
