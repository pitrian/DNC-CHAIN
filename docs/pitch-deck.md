# DNC-CertiTrust: Soulbound Diplomas on Blockchain
## Da Nang City — Digital Credential Integrity System

---

# The Problem
## Degree Fraud in Vietnam

- **~70,000** fake diplomas estimated in circulation (Ministry of Education)
- Paper-based verification: slow, costly, unreliable
- Current solutions: centralized databases, vulnerable to tampering
- Cross-institution verification requires manual coordination
- **Da Nang's 2728 Digital Transformation Initiative** targets this

---

# The Solution
## Soulbound Diplomas (ERC-5192)

- **Non-transferable** digital diplomas — bound to the graduate forever
- **Tamper-proof** on-chain verification
- **Zero gas cost** for verifiers (read-only queries)
- **Instant verification** via web portal or API
- **Open standard** — ERC-5192 compatible with any wallet

---

# Technology Stack

| Layer | Technology |
|-------|-----------|
| **Standard** | ERC-5192 (Soulbound), ERC-721URIStorage |
| **Blockchain** | Arbitrum Sepolia (Phase 1) → Hyperledger Besu (Phase 2) |
| **Smart Contracts** | Solidity 0.8.28, Foundry |
| **Frontend** | Next.js 14, Wagmi, RainbowKit, Viem |
| **Security** | OpenZeppelin, Slither, Foundry Fuzz Testing |

---

# Architecture

```
┌─────────────┐    ┌──────────────┐    ┌──────────────────┐
│   Issuer    │    │   Verifier   │    │   Degree Holder  │
│  (Ministry) │    │ (Employer)   │    │   (Graduate)     │
└──────┬──────┘    └──────┬───────┘    └────────┬─────────┘
       │                  │                     │
       ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────┐
│              DNC-CertiTrust Contracts                │
│  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │ DNCAccessControl│  │ DNCUniversityDegree.sol  │   │
│  │ (RBAC: ADMIN/   │  │ (ERC-5192 Soulbound,     │   │
│  │  AUTHORITY/USER)│  │  ERC-721URIStorage)      │   │
│  └─────────────────┘  └─────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐    │
│  │         DNCProofRegistry.sol                │    │
│  │  (Document hash registry, verify/revoke)    │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

# Smart Contract Design

## Three contracts, one mission

### `DNCAccessControl`
- Role-Based Access Control (DEFAULT_ADMIN, AUTHORITY, USER)
- Only AUTHORITY can mint diplomas and register proofs

### `DNCUniversityDegree`
- ERC-5192 Soulbound Token (locked transfers)
- `mintDegree(to, uri)` — only AUTHORITY
- `getDegreesByOwner(owner)` — query all diplomas

### `DNCProofRegistry`
- Hash-based document proof registration
- `registerProof(fileHash)` → `verifyProof(fileHash)` → `getProof(fileHash)`
- Full audit trail: `DocumentRegistered`, `DocumentVerified`, `DocumentRevoked`

---

# Security

| Measure | Status |
|---------|--------|
| OpenZeppelin audited base contracts | ✅ |
| Unit tests: 60 tests | ✅ 100% pass |
| Coverage: ProofRegistry 100%, SBT 100% | ✅ |
| Fuzz testing (Foundry) | ✅ |
| Slither static analysis (Phase 2) | 🔄 |
| Formal verification (Phase 3) | 📋 |

---

# Roadmap

```
Phase 1 — Hackathon (Now)
├─ Foundry Anvil + Arbitrum Sepolia
├─ Full frontend (Next.js + RainbowKit)
├─ 60 unit tests, 100% coverage
└─ Public GitHub (open source)

Phase 2 — Tiểu luận (Q3 2025)
├─ Hyperledger Besu QBFT (4 validators)
├─ On-chain permissioning
├─ Slither + Echidna fuzzing
└─ Docker Compose deployment

Phase 3 — Khóa luận (Q1 2026)
├─ ZKP integration (ZoKrates/SnarkJS)
├─ DNC-Audit Hub
├─ Cross-chain interoperability
└─ Production deployment
```

---

# Demo

### Live at: [dnc-certitrust.vercel.app](https://dnc-certitrust.vercel.app)

**Issuer Portal:**
1. Connect wallet (AUTHORITY role)
2. Upload diploma PDF
3. Enter graduate address
4. Mint Soulbound Diploma

**Verification Portal:**
1. Upload document
2. Auto-compute SHA-256 hash
3. Instant on-chain verification
4. See issuer, timestamp, status

---

# Impact

- **Da Nang first** Vietnamese city with blockchain-based diplomas
- **Aligned with** Đề án 2728 (Digital Transformation)
- **Open source** — other provinces can fork and adopt
- **Scalable** — from university to national level
- **Press narrative**: "Đà Nẵng tiên phong chống bằng giả bằng blockchain"

---

# Team

**Built for BLI Legal Tech Hackathon 2025**

- Smart contract development: Solidity, Foundry
- Frontend: Next.js, Wagmi, RainbowKit
- Testing: Foundry fuzz, unit tests
- Infrastructure: Docker, Besu, Arbitrum

---

# Call to Action

### Try it now:
- GitHub: [github.com/anomalyco/dnc-chain](https://github.com/anomalyco/dnc-chain)
- Demo: [dnc-certitrust.vercel.app](https://dnc-certitrust.vercel.app)
- Contract: Arbitrum Sepolia (deploying soon)

### Contact:
- 📧 [Your Email]
- 🔗 [Your LinkedIn]

---

# Thank You

## DNC-CertiTrust
### Soulbound Diplomas for a Trustworthy Future

*Da Nang City — Digital Transformation Initiative (Đề án 2728)*

**#BLILegalTech #Soulbound #ERC5192 #DaNang #Blockchain**
