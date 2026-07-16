#!/bin/bash
set -e

echo "=== DNC-CertiTrust Test Suite ==="

# Run all tests
echo "[1/3] Running unit tests..."
forge test -vvv

# Run coverage
echo "[2/3] Running coverage report..."
forge coverage --report lcov

# Run gas report
echo "[3/3] Running gas report..."
forge test --gas-report

echo "=== All tests complete ==="
