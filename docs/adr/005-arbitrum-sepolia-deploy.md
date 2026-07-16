# ADR-005: Deploy Contracts to Arbitrum Sepolia

## Status

Accepted

## Context

Hackathon requires a deployed smart contract that judges can interact with. Options: Anvil (local), Ethereum Sepolia, Arbitrum Sepolia.

## Decision

Deploy to Arbitrum Sepolia.

Benefits:
- Public test network: judges can verify without local setup
- Fast block times (~1-2 seconds)
- Negligible gas costs (testnet ETH from faucet)
- Arbitrum Sepolia block explorer for transparency
- EVM-compatible (same Solidity code as local Anvil)
- Can verify contracts on Arbiscan Sepolia

## Consequences

- Requires testnet ETH from faucet
- Transaction latency (~1-2s vs instant for Anvil)
- Need to maintain deployer wallet

## References

- https://docs.arbitrum.io/for-devs/concepts/public-chains
