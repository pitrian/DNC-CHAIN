# ADR-004: Use Web Crypto API for Client-Side Hashing

## Status

Accepted

## Context

Need to hash files on the client before sending to blockchain. Options: `js-sha256` library or native Web Crypto API.

## Decision

Use Web Crypto API (`crypto.subtle.digest('SHA-256', data)`).

Benefits:
- Built into all modern browsers
- Zero dependency
- Type-safe with TypeScript
- No bundle size impact
- Faster than JS libraries (native implementation)

## Consequences

- Only works in HTTPS or localhost (secure context requirement)
- Async API (Promise-based)
- Not available in older browsers (acceptable for government/enterprise use)

## Implementation

```typescript
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

## References

- https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
