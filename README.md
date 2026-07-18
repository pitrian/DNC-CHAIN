# DNC-CertiTrust

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-000000.svg)](https://book.getfoundry.sh/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue)](https://soliditylang.org/)
[![Tests](https://img.shields.io/badge/Tests-60%20passed-brightgreen)](contracts/test/)
[![Coverage](https://img.shields.io/badge/Coverage-100%25%20core%20contracts-brightgreen)](contracts/test/)
[![GitHub](https://img.shields.io/badge/GitHub-pitrian%2FDNC--CHAIN-181717?logo=github)](https://github.com/pitrian/DNC-CHAIN)

> **Da Nang City CertiTrust** — A permissioned blockchain-based diploma and document verification system built for Da Nang City's digital government infrastructure (DNC-Chain / Đề án 2728).

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Architecture](#solution-architecture)
- [Tech Stack](#tech-stack)
- [Smart Contracts](#smart-contracts)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Security](#security)
- [Roadmap](#roadmap)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

DNC-CertiTrust is a **Soulbound Diploma (SBT)** system on permissioned blockchain infrastructure, designed to eliminate degree fraud and streamline document verification for Da Nang City's smart government initiative.

It aligns with **Đề án 2728/QĐ-UBND** (Da Nang City's Blockchain Development Strategy to 2030) and the **DNC-Chain** (Da Nang City Chain) permissioned blockchain platform.

### Key Features

- 🔐 **Soulbound Diplomas** — Non-transferable digital degrees (ERC-5192)
- 🏛️ **RBAC** — Role-based access control (Admin / Authority / User)
- 📄 **Document Proof Registry** — Tamper-proof hash-based verification
- 🔍 **Public Verification** — Anyone can verify document authenticity
- 🛡️ **Soulbound by Design** — Tokens cannot be transferred or approved
- 🔗 **Permissioned Ready** — Built for Hyperledger Besu QBFT migration

---

## Problem Statement

In Vietnam, **degree fraud is a critical issue**:

- An estimated **40% of degrees** submitted to employers may be forged
- Manual verification takes **3-5 business days** per document
- No unified, tamper-proof registry exists for public documents
- Current digital solutions still rely on centralized databases

DNC-CertiTrust solves this by putting **document hashes on an immutable blockchain**, allowing instant, trustless verification.

---

## Solution Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │  Issuer  │  │ Verifier │  │       Dashboard          │  │
│  │  Portal  │  │  Portal  │  │    (Event Viewer)        │  │
│  └────┬─────┘  └────┬─────┘  └────────────┬─────────────┘  │
│       │             │                      │                │
│       └─────────────┼──────────────────────┘                │
│                     │ WalletConnect (Wagmi + RainbowKit)    │
├─────────────────────┼───────────────────────────────────────┤
│            Smart Contract Layer (Solidity 0.8.28)          │
│  ┌──────────────────┼──────────────────────────────────┐    │
│  │     DNCUniversityDegree.sol  (ERC-5192 SBT)         │    │
│  │     DNCProofRegistry.sol      (Document Proof)      │    │
│  │     DNCAccessControl.sol      (RBAC)                │    │
│  └──────────────────┼──────────────────────────────────┘    │
├─────────────────────┼───────────────────────────────────────┤
│          Blockchain Layer (EVM-compatible)                   │
│  ┌──────────────────┼──────────────────────────────────┐    │
│  │  Phase 1: Arbitrum Sepolia  (Hackathon MVP)          │    │
│  │  Phase 2: Hyperledger Besu QBFT  (Production)        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Issuer (Sở GD&ĐT)
  │ 1. Connect wallet (AUTHORITY_ROLE)
  │ 2. Upload diploma file
  │ 3. Client-side SHA-256 hashing (Web Crypto API)
  │ 4. Submit transaction: mintDegree(student, hashURI)
  ▼
Smart Contract
  │ 5. Verify issuer has AUTHORITY_ROLE
  │ 6. Mint Soulbound Token (non-transferable)
  │ 7. Emit DegreeMinted event
  ▼
Verifier (Employer)
  │ 8. Drop file into verification portal
  │ 9. Client-side SHA-256 hashing
  │ 10. Call verifyProof(hash)
  │ 11. Receive: exists ✓ | issuer | timestamp
  ▼
Result: Authentic ✓ or Not Found ✗
```

---

## Tech Stack

### Phase 1: Hackathon MVP

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Smart Contracts** | Solidity 0.8.28, OpenZeppelin v5 | Core business logic |
| **Development** | Foundry (forge, anvil, cast) | Contract development & testing |
| **Blockchain** | Arbitrum Sepolia | Public testnet deployment |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS | Web application |
| **Wallet** | Wagmi, RainbowKit, Viem | Wallet connection & blockchain interaction |
| **Hashing** | Web Crypto API | Client-side SHA-256 |

### Phase 2: Production

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Blockchain** | Hyperledger Besu (QBFT) | Permissioned Layer 1 |
| **Consensus** | QBFT (Istanbul BFT variant) | Byzantine fault tolerance |
| **Validators** | 4+ validator nodes | Enterprise-grade consensus |
| **Permissioning** | On-chain contracts | Node & account allowlisting |
| **Monitoring** | Prometheus, Grafana | Network observability |
| **Block Explorer** | BlockScout | Transaction transparency |

### Phase 3: Advanced Security

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Zero-Knowledge Proofs** | ZoKrates / SnarkJS | Privacy-preserving verification |
| **Fuzzing** | Foundry (invariant), Echidna | Security testing |
| **Audit** | DNC-Audit Hub, Slither | Automated security analysis |

---

## Smart Contracts

### DNCAccessControl.sol

Role-based access control for the DNC ecosystem.

```
Roles:
  DEFAULT_ADMIN_ROLE ── Sở KH&CN Đà Nẵng (grant/revoke roles)
  AUTHORITY_ROLE     ── Sở GD&ĐT, other departments (mint diplomas)
  USER_ROLE          ── Citizens, businesses (verify only)
```

**Key Functions:**
| Function | Access | Description |
|----------|--------|-------------|
| `grantAuthorityRole(address)` | ADMIN | Add an issuing authority |
| `revokeAuthorityRole(address)` | ADMIN | Remove an issuing authority |
| `grantUserRole(address)` | ADMIN | Register a user |
| `isAuthority(address)` | Public | Check if address has authority |
| `isUser(address)` | Public | Check if address is registered user |

### DNCProofRegistry.sol

Tamper-proof document hash registry.

**Core Data Structure:**
```solidity
struct ProofInfo {
    bytes32 fileHash;      // SHA-256 hash of document
    uint256 timestamp;     // Registration timestamp
    address issuer;        // Issuing authority address
    bool revoked;          // Whether proof has been revoked
}
```

**Key Functions:**
| Function | Access | Description |
|----------|--------|-------------|
| `registerProof(bytes32)` | AUTHORITY | Register document hash |
| `verifyProof(bytes32)` | Public | Check document validity |
| `revokeProof(bytes32)` | ADMIN / AUTHORITY | Revoke a registered proof |
| `getProof(bytes32)` | Public | Get full proof details |

### DNCUniversityDegree.sol

Soulbound Diploma token (ERC-5192 + ERC-721URIStorage).

**Key Properties:**
- **Non-transferable**: All transfer/approve functions revert
- **Mint-only**: Only AUTHORITY can mint
- **Burn**: Owner, AUTHORITY, or ADMIN can burn
- **Metadata**: ERC-721 URI storage for diploma metadata
- **Interface**: ERC-165 + IERC5192 (`locked() → true`)

**Key Functions:**
| Function | Access | Description |
|----------|--------|-------------|
| `mintDegree(address, string)` | AUTHORITY | Mint a new soulbound diploma |
| `burnDegree(uint256)` | Owner / AUTHORITY / ADMIN | Burn a diploma |
| `locked(uint256)` | Public | Check if token is locked (always true) |
| `getDegreeIssuer(uint256)` | Public | Get the issuer of a diploma |
| `getDegreesByOwner(address)` | Public | List all diplomas owned by address |

---

## Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) >= 18.x
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

### Install

```bash
# Clone the repository
git clone https://github.com/pitrian/DNC-CHAIN.git
cd DNC-CHAIN

# Install Foundry dependencies
cd contracts
forge install
forge build
```

### Run Tests

```bash
cd contracts

# Run all tests
forge test -vvv

# Run with gas report
forge test --gas-report

# Run coverage
forge coverage
```

### Deploy Locally

**Terminal 1:** Start Anvil
```bash
anvil --host 0.0.0.0 --port 8545
```

**Terminal 2:** Deploy contracts
```bash
cd contracts
forge script script/Deploy.s.sol:DeployLocalScript \
    --rpc-url http://localhost:8545 \
    --broadcast
```

### Deploy to Arbitrum Sepolia (Pending)

```bash
cd contracts

# Set up environment
export DEPLOYER_PRIVATE_KEY=your_private_key_here

# Deploy
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url https://sepolia-rollup.arbitrum.io/rpc \
    --broadcast
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Local Dev (All in One)

```bash
./scripts/dev.sh
```

---

## Deployment

### Anvil Local (Development)

| Contract | Address |
|----------|---------|
| DNCAccessControl | `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519` |
| DNCProofRegistry | `0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496` |
| DNCUniversityDegree | `0x34A1D3fff3958843C43aD80F30b94c510645C316` |

### Arbitrum Sepolia (Pending — need faucet ETH)

| Contract | Address | Explorer |
|----------|---------|----------|
| DNCAccessControl | `0x...` | — |
| DNCProofRegistry | `0x...` | — |
| DNCUniversityDegree | `0x...` | — |

**Frontend:** Local — `http://localhost:3000`

---

## API Reference

### Smart Contract Events

```solidity
// DNCAccessControl
event RoleGrantedWithLabel(bytes32 indexed role, address indexed account, string roleLabel);
event RoleRevokedWithLabel(bytes32 indexed role, address indexed account, string roleLabel);

// DNCProofRegistry
event DocumentRegistered(bytes32 indexed fileHash, address indexed issuer, uint256 timestamp);
event DocumentVerified(bytes32 indexed fileHash, address indexed verifier, bool valid);
event DocumentRevoked(bytes32 indexed fileHash, address indexed revoker, uint256 timestamp);

// DNCUniversityDegree
event DegreeMinted(uint256 indexed tokenId, address indexed recipient, address indexed issuer, string uri, uint256 timestamp);
event DegreeBurned(uint256 indexed tokenId, address indexed burner, uint256 timestamp);
```

### JSON-RPC (via Viem)

```typescript
// Verify a document
const receipt = await publicClient.simulateContract({
  address: proofRegistryAddress,
  abi: DNCProofRegistryABI,
  functionName: 'verifyProof',
  args: [fileHash],
});

// Check if a degree is authentic
const owner = await publicClient.readContract({
  address: degreeAddress,
  abi: DNCUniversityDegreeABI,
  functionName: 'ownerOf',
  args: [tokenId],
});
```

---

## Security

### Smart Contract Security

- **Access Control**: OpenZeppelin's `AccessControl` with 3-tier role hierarchy
- **Soulbound**: All transfer and approval functions revert
- **Input Validation**: Zero-address checks, empty hash checks
- **Event-driven**: All state changes emit events for transparency
- **Test Coverage**:
  - DNCAccessControl: 92.9% lines covered
  - DNCProofRegistry: 100% lines covered
  - DNCUniversityDegree: 100% lines covered

### Known Considerations

- Contracts use `cancun` EVM version (compatible with Arbitrum Sepolia)
- Gasless transactions for authority wallets (Phase 2)
- Upgradeable via UUPS pattern (planned for Phase 2)

---

## Roadmap

### Phase 1 — Hackathon MVP (Jul-Aug 2026)
- [x] Smart contract development (AccessControl, ProofRegistry, SBT)
- [x] Unit tests (60 tests, 100% core coverage)
- [x] Frontend (Issuer portal, Verifier portal, Dashboard)
- [x] Deploy to local Anvil
- [x] Pitch deck ([docs/pitch-deck.md](docs/pitch-deck.md))
- [ ] Deploy to Arbitrum Sepolia (need faucet ETH)
- [ ] Demo video
- [ ] BLI Legal Tech Hackathon submission

### Phase 2 — Undergraduate Thesis (Sep-Dec 2026)
- [x] Besu QBFT Docker Compose template ([besu-network/](besu-network/))
- [ ] Migrate to Hyperledger Besu QBFT (4 validators)
- [ ] M1 Bridge (VBSN interoperability)
- [ ] M7 Data Sanitization Hub
- [ ] SP3 Digital Twin, SP4 Medical Records
- [ ] UUPS upgradeable contracts
- [ ] Foundry coverage > 95%
- [ ] Slither + static analysis
- [ ] Thesis paper

### Phase 3 — Graduation Thesis (2027)
- [ ] Zero-Knowledge Proofs (ZoKrates/SnarkJS)
- [ ] Fuzzing & invariant testing
- [ ] DNC-Audit Hub (automated security scanning)
- [ ] SP5-SP10 products (Data Exchange, RWA, City Loyalty)
- [ ] Complete security audit report
- [ ] Thesis defense

---

## Project Structure

```
dnc-certitrust/
├── contracts/                    # Foundry smart contracts
│   ├── src/
│   │   ├── DNCAccessControl.sol    # Role-based access control
│   │   ├── DNCProofRegistry.sol    # Document proof registry
│   │   └── DNCUniversityDegree.sol # Soulbound diploma (ERC-5192)
│   ├── test/                     # Foundry tests
│   │   ├── DNCAccessControl.t.sol
│   │   ├── DNCProofRegistry.t.sol
│   │   └── DNCUniversityDegree.t.sol
│   ├── script/                   # Deployment scripts
│   │   └── Deploy.s.sol
│   ├── foundry.toml
│   └── lib/                      # Dependencies (git submodules)
├── frontend/                     # Next.js web application
│   └── src/
│       ├── pages/
│       │   ├── index.tsx          # Landing page
│       │   ├── issuer.tsx         # Authority portal (mint)
│       │   ├── verifier.tsx       # Public verification portal
│       │   └── dashboard.tsx      # Event viewer (real-time)
│       ├── components/
│       └── utils/
├── besu-network/                 # Hyperledger Besu QBFT (Phase 2)
│   ├── docker-compose.yml        # 4 validator nodes
│   ├── scripts/setup.sh          # Key generation & genesis builder
│   └── README.md
├── docs/                         # Documentation
│   ├── adr/                      # Architecture Decision Records
│   ├── pitch-deck.md             # Hackathon pitch (14 slides)
│   └── day2.md                   # Day 2 development log
├── scripts/                      # Utility scripts
│   └── dev.sh                    # Start local dev environment
├── README.md                     # This file
└── PROJECT_LOG.md                # Development log
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Solidity: Solc 0.8.28, OpenZeppelin v5 conventions
- Tests: Every contract function must have corresponding tests
- Coverage: Minimum 95% for production contracts
- Documentation: Update README and ADR for any architecture changes

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Da Nang City People's Committee** — Đề án 2728/QĐ-UBND
- **Sở KH&CN Đà Nẵng** — Project guidance
- **1Matrix / VBA** — VBSN architecture
- **Hyperledger Besu** — Enterprise blockchain framework
- **OpenZeppelin** — Secure smart contract libraries

---

<p align="center">
  Built with ❤️ for Da Nang City's Digital Government Initiative
</p>
