# ADR-002: Use ERC-5192 for Soulbound Diplomas

## Status

Accepted

## Context

DNC-CertiTrust requires non-transferable digital diplomas. Options: custom implementation or ERC-5192 standard.

## Decision

Use ERC-5192 (Minimal Soulbound NFTs) which extends ERC-721 with a `locked()` function.

Benefits:
- Standard interface for wallet/explorer compatibility
- Clear intent: tokens are permanently locked
- ERC-165 interface detection
- Override `transferFrom`, `safeTransferFrom`, `approve`, `setApprovalForAll` to revert

## Consequences

- Tokens cannot be transferred once minted
- Compatible with existing ERC-721 infrastructure (block explorers, wallets)
- Burn functionality preserved for revocation
- Mapping `owner => tokenId[]` for query optimization

## References

- https://eips.ethereum.org/EIPS/eip-5192
