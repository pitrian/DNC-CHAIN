# ADR-001: Choose Foundry over Hardhat

## Status

Accepted

## Context

Choose a development framework for smart contract development. Options: Hardhat (JavaScript) and Foundry (Solidity-native).

## Decision

Use Foundry because:

- Tests are written in Solidity, not JavaScript/TypeScript
- `forge coverage` provides built-in coverage reports
- `anvil` is a fast local node for testing
- `cast` CLI enables direct interaction with contracts
- `forge test` is 10x faster than Hardhat tests
- Native fuzz testing support

## Consequences

- Faster development iteration
- Tests are more readable for Solidity developers
- Smaller dependency footprint
- No need for JavaScript toolchain for contract development
- Some Hardhat plugins (like tenderly) are not available

## References

- https://book.getfoundry.sh/
