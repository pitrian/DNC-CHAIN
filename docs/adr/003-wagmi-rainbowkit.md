# ADR-003: Use Wagmi + RainbowKit for Wallet Connection

## Status

Pending (Phase 1)

## Context

Frontend needs wallet connection for issuers (AUTHORITY role). Options: ethers.js, Web3Modal, Wagmi + RainbowKit.

## Decision

Use Wagmi (React Hooks for Ethereum) + RainbowKit (Wallet connection UI).

Benefits:
- Type-safe with TypeScript
- WalletConnect v2 support
- Multiple wallet support (MetaMask, Rabby, Coinbase Wallet, etc.)
- Built-in hooks for contract reads/writes
- Auto-manages chain switching

## Consequences

- Added bundle size (~50KB gzipped)
- Simplified wallet integration
- Professional UI for hackathon judges
- Automatic chain configuration for Arbitrum Sepolia + Anvil

## References

- https://wagmi.sh/
- https://rainbowkit.com/
