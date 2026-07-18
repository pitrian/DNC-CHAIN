# DNC-CertiTrust Project Log

> **Da Nang City CertiTrust** — Soulbound Diploma Verification System

---

## Project Info

| Field | Value |
|-------|-------|
| **Full Name** | DNC-CertiTrust (Da Nang City CertiTrust) |
| **Mission** | Chống gian lận văn bằng trên blockchain chính phủ Đà Nẵng |
| **Stack** | Solidity 0.8.28, Foundry, Next.js, Wagmi, RainbowKit, Viem |
| **Blockchain** | Hardhat/Anvil (Hackathon) → Besu QBFT (TLTN) → Besu + ZKP (KLTN) |
| **Deploy Target** | Arbitrum Sepolia (Hackathon) |
| **License** | MIT |
| **Repository** | [GitHub](https://github.com/pitrian/DNC-CHAIN) |

---

## Phase 1: Hackathon MVP (Jul-Aug 2026)

### Milestones

| Milestone | Target | Status | Note |
|-----------|--------|--------|------|
| W1: Contracts + Tests | Jul 13 | ✅ | 60 tests, 100% coverage (core) |
| W2: Frontend + Local Deploy | Jul 20 | 🔄 | Frontend complete, deployed to Anvil |
| W3: Arbitrum + Vercel | Jul 27 | ⬜ | Pending faucet ETH |
| W4: Đóng gói Hackathon | Aug 3 | ⬜ | |

### ✅ Completed Tasks

| Date | Task | Detail | By |
|------|------|--------|----|
| Jul 7 | Init Foundry project | forge init, install OpenZeppelin | AI |
| Jul 7 | Write DNCAccessControl.sol | 3 roles: ADMIN, AUTHORITY, USER | AI |
| Jul 7 | Write DNCProofRegistry.sol | Document hash registry | AI |
| Jul 7 | Write DNCUniversityDegree.sol | ERC-5192 Soulbound Diploma | AI |
| Jul 7 | Write tests (AccessControl) | 18 tests, all passing | AI |
| Jul 7 | Write tests (ProofRegistry) | 17 tests, all passing | AI |
| Jul 7 | Write tests (SBT) | 25 tests, all passing | AI |
| Jul 7 | Write Deploy.s.sol | Local + Arbitrum Sepolia deploy scripts | AI |
| Jul 7 | Configure foundry.toml | Solc 0.8.28, optimizer, Cancun EVM | AI |
| Jul 7 | Write ADR docs | 5 architecture decision records | AI |
| Jul 7 | Write README.md | Full project documentation | AI |
| Jul 7 | Write PROJECT_LOG.md | This file | AI |
| Jul 16 | npm install + fix TypeScript | 0 TS errors, tsconfig fix | AI |
| Jul 16 | Error handling improvements | Tx tracking, proof read hook | AI |
| Jul 16 | Create pitch deck | docs/pitch-deck.md (14 slides) | AI |
| Jul 16 | Create Besu QBFT config | Docker Compose 4 validators | AI |
| Jul 16 | Push to GitHub | github.com/pitrian/DNC-CHAIN | AI |
| Jul 18 | Setup WalletConnect ID | .env.local configured | AI |
| Jul 18 | Deploy to Anvil local | 3 contracts deployed | AI |

### ⬜ Pending Tasks

| Task | Priority |
|------|----------|
| Design logo (Cầu Rồng + blockchain) | MEDIUM |
| Deploy to Arbitrum Sepolia (cần faucet) | HIGH |
| Deploy frontend to Vercel | HIGH |
| Set up Slither static analysis | MEDIUM |

---

## Phase 2: Tiểu luận Tốt nghiệp (Sep-Dec 2026)

### ⬜ Step 1: Migrate lên Besu QBFT

| Task | Status |
|------|--------|
| Docker Compose 4 validators | ⬜ |
| QBFT genesis config | ⬜ |
| Permissioning (node + account) | ⬜ |
| Deploy contracts lên Besu | ⬜ |

### ⬜ Step 2: Module mở rộng

| Task | Status |
|------|--------|
| M1 Bridge (VBSN mock) | ⬜ |
| M7 Data Sanitization Hub | ⬜ |
| UUPS upgradeable pattern | ⬜ |

### ⬜ Step 3: Sản phẩm mới

| Task | Status |
|------|--------|
| SP3 Digital Twin | ⬜ |
| SP4 Medical Records | ⬜ |

### ⬜ Step 4: Bảo mật + TLTN

| Task | Status |
|------|--------|
| Foundry coverage > 95% | ⬜ |
| Slither static analysis | ⬜ |
| Viết Tiểu luận tốt nghiệp | ⬜ |
| Bảo vệ TLTN | ⬜ |

---

## Phase 3: Khóa luận Tốt nghiệp (2027)

### ⬜ ZKP Module

| Task | Status |
|------|--------|
| ZoKrates circuit design | ⬜ |
| Solidity Verifier contract | ⬜ |
| Integration with SBT | ⬜ |

### ⬜ Fuzzing & Invariant Testing

| Task | Status |
|------|--------|
| Foundry fuzz tests | ⬜ |
| Invariant tests (RBAC) | ⬜ |
| Echidna (optional) | ⬜ |

### ⬜ DNC-Audit Hub

| Task | Status |
|------|--------|
| Auto-analyzer tool | ⬜ |
| SBT audit pass certificate | ⬜ |
| Third-party contract scanner | ⬜ |

### ⬜ Sản phẩm Tầng 3 & Tầng 4

| Task | Status |
|------|--------|
| SP5 Data Exchange | ⬜ |
| SP7 Loyalty Token (ERC-20) | ⬜ |
| SP8-SP10 Sandbox | ⬜ |

### ⬜ KLTN + Bảo vệ

| Task | Status |
|------|--------|
| Chương ZKP | ⬜ |
| Chương Audit | ⬜ |
| Audit Report | ⬜ |
| Bảo vệ KLTN | ⬜ |

---

## Test Results

### Latest: Jul 7, 2026 — 60/60 tests passing

```
DNCAccessControl.t.sol    : 18 passed, 0 failed
DNCProofRegistry.t.sol     : 17 passed, 0 failed
DNCUniversityDegree.t.sol  : 25 passed, 0 failed
──────────────────────────────────────────────
Total                      : 60 passed, 0 failed
```

### Coverage

| Contract | Lines | Statements | Branches | Functions |
|----------|-------|------------|----------|-----------|
| DNCAccessControl | 92.86% | 95.45% | 100% | 88.89% |
| DNCProofRegistry | 100% | 100% | 100% | 100% |
| DNCUniversityDegree | 100% | 100% | 100% | 100% |

---

## Architecture Decision Records

| ID | Title | Status |
|----|-------|--------|
| ADR-001 | Foundry over Hardhat | ✅ Accepted |
| ADR-002 | ERC-5192 Soulbound Standard | ✅ Accepted |
| ADR-003 | Wagmi + RainbowKit | ✅ Accepted |
| ADR-004 | Web Crypto API for Hashing | ✅ Accepted |
| ADR-005 | Arbitrum Sepolia Deploy | ✅ Accepted |
| ADR-006 | Besu QBFT Migration Plan | ⬜ Pending |

---

## Test Accounts (Local Anvil)

| Role | Address | Private Key |
|------|---------|-------------|
| DEFAULT_ADMIN | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| AUTHORITY (issue) | `0x...` | `0x...` |
| USER (verify) | `0x...` | `0x...` |

> **Note:** Never commit real private keys. Use `.env` files.

---

## Deployment Addresses

### Anvil Local (Development)

| Contract | Address |
|----------|---------|
| DNCAccessControl | `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519` |
| DNCProofRegistry | `0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496` |
| DNCUniversityDegree | `0x34A1D3fff3958843C43aD80F30b94c510645C316` |

### Arbitrum Sepolia (Pending)

| Contract | Address | Explorer |
|----------|---------|----------|
| DNCAccessControl | `0x...` | ... |
| DNCProofRegistry | `0x...` | ... |
| DNCUniversityDegree | `0x...` | ... |

### Frontend

- Local: `http://localhost:3000`
- Production: `https://dnc-certitrust.vercel.app` (chưa deploy)

---

## Weekly Snapshot

| Week | Date Range | Focus | Tasks Done | Tests |
|------|------------|-------|------------|-------|
| W1 | Jul 7-13 | Foundry + Contracts | 12/12 | 60 ✅ |
| W2 | Jul 14-20 | Frontend + Deploy | 5/8 | - |
| W3 | Jul 21-27 | Integration | 0/6 | - |
| W4 | Jul 28-Aug 3 | Hackathon Submit | 0/5 | - |

---

<p align="center">
  <i>Last updated: July 18, 2026</i>
</p>
