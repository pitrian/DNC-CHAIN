import { useMemo, useEffect } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { getAddress } from 'viem';

const ACCESS_CONTROL_ABI = [
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isAuthority',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isUser',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isEducation',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isScienceTech',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'grantAuthorityRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'revokeAuthorityRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'grantUserRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'revokeUserRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'grantEducationRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'revokeEducationRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'grantScienceTechRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'revokeScienceTechRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isPaused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const PROOF_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'fileHash', type: 'bytes32' }],
    name: 'registerProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'fileHash', type: 'bytes32' }],
    name: 'verifyProof',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'fileHash', type: 'bytes32' },
    ],
    name: 'getProof',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'fileHash', type: 'bytes32' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
          { internalType: 'address', name: 'issuer', type: 'address' },
          { internalType: 'bool', name: 'revoked', type: 'bool' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'fileHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'issuer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'DocumentRegistered',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'fileHash', type: 'bytes32' }],
    name: 'revokeProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'fileHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'verifier',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'valid',
        type: 'bool',
      },
    ],
    name: 'DocumentVerified',
    type: 'event',
  },
] as const;

const DEGREE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'uri', type: 'string' },
    ],
    name: 'mintDegree',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'locked',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'getDegreesByOwner',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'burnDegree',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'issuer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'DegreeMinted',
    type: 'event',
  },
] as const;

const CONFIG = {
  accessControlAddress: (process.env.NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
  proofRegistryAddress: (process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
  degreeAddress: (process.env.NEXT_PUBLIC_DEGREE_ADDRESS ||
    '0x0000000000000000000000000000000000000000') as `0x${string}`,
};

export function useContracts() {
  return useMemo(() => CONFIG, []);
}

export function useIsAuthority(address: `0x${string}` | undefined) {
  const { accessControlAddress } = useContracts();

  const { data: isAuthority, isLoading, error } = useReadContract({
    address: accessControlAddress,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'isAuthority',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (error) console.error('[useIsAuthority]', error);
  }, [error]);

  return { isAuthority: !!isAuthority, isLoading };
}

const DEFAULT_ADMIN = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;

export function useIsAdmin(address: `0x${string}` | undefined) {
  const { accessControlAddress } = useContracts();

  const { data: isAdmin, isLoading, error } = useReadContract({
    address: accessControlAddress,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'hasRole',
    args: address ? [DEFAULT_ADMIN, address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    if (error) console.error('[useIsAdmin]', error);
  }, [error]);

  return { isAdmin: !!isAdmin, isLoading };
}

export function useIsEducation(address: `0x${string}` | undefined) {
  const { accessControlAddress } = useContracts();

  const { data: isEducation, isLoading, error } = useReadContract({
    address: accessControlAddress,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'isEducation',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    if (error) console.error('[useIsEducation]', error);
  }, [error]);

  return { isEducation: !!isEducation, isLoading };
}

export function useIsScienceTech(address: `0x${string}` | undefined) {
  const { accessControlAddress } = useContracts();

  const { data: isScienceTech, isLoading, error } = useReadContract({
    address: accessControlAddress,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'isScienceTech',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    if (error) console.error('[useIsScienceTech]', error);
  }, [error]);

  return { isScienceTech: !!isScienceTech, isLoading };
}

export function useAccessControl() {
  const { accessControlAddress } = useContracts();
  const { data: txHash, writeContract } = useWriteContract();

  return {
    txHash,
    grantAuthorityRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'grantAuthorityRole',
        args: [account],
      }),
    revokeAuthorityRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'revokeAuthorityRole',
        args: [account],
      }),
    grantUserRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'grantUserRole',
        args: [account],
      }),
    revokeUserRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'revokeUserRole',
        args: [account],
      }),
    grantEducationRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'grantEducationRole',
        args: [account],
      }),
    revokeEducationRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'revokeEducationRole',
        args: [account],
      }),
    grantScienceTechRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'grantScienceTechRole',
        args: [account],
      }),
    revokeScienceTechRole: (account: `0x${string}`) =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'revokeScienceTechRole',
        args: [account],
      }),
  };
}

export function useProofRegistry() {
  const { proofRegistryAddress } = useContracts();
  const { data: txHash, writeContract } = useWriteContract();

  return {
    txHash,
    registerProof: (fileHash: `0x${string}`) =>
      writeContract({
        address: proofRegistryAddress,
        abi: PROOF_REGISTRY_ABI,
        functionName: 'registerProof',
        args: [fileHash],
      }),
    verifyProof: (fileHash: `0x${string}`) =>
      writeContract({
        address: proofRegistryAddress,
        abi: PROOF_REGISTRY_ABI,
        functionName: 'verifyProof',
        args: [fileHash],
      }),
  };
}

export function useProofData(fileHash: `0x${string}` | undefined) {
  const { proofRegistryAddress } = useContracts();

  const { data, isLoading, error } = useReadContract({
    address: proofRegistryAddress,
    abi: PROOF_REGISTRY_ABI,
    functionName: 'getProof',
    args: fileHash ? [fileHash] : undefined,
    query: {
      enabled: !!fileHash && fileHash !== '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
  });

  return {
    proof: data as { fileHash: `0x${string}`; timestamp: bigint; issuer: `0x${string}`; revoked: boolean } | undefined,
    isLoading,
    error,
  };
}

export function useDegreeContract() {
  const { degreeAddress } = useContracts();
  const { data: txHash, writeContract } = useWriteContract();

  return {
    txHash,
    mintDegree: (to: `0x${string}`, uri: string) =>
      writeContract({
        address: degreeAddress,
        abi: DEGREE_ABI,
        functionName: 'mintDegree',
        args: [to, uri],
      }),
  };
}

export function useDegreesByOwner(owner: `0x${string}` | undefined) {
  const { degreeAddress } = useContracts();
  const { data, isLoading, error } = useReadContract({
    address: degreeAddress,
    abi: DEGREE_ABI,
    functionName: 'getDegreesByOwner',
    args: owner ? [owner] : undefined,
    query: { enabled: !!owner },
  });
  useEffect(() => { if (error) console.error('[useDegreesByOwner]', error); }, [error]);
  return { tokenIds: (data || []) as bigint[], isLoading, error };
}

export function useDegreeTokenURI(tokenId: bigint | undefined) {
  const { degreeAddress } = useContracts();
  const { data, isLoading, error } = useReadContract({
    address: degreeAddress,
    abi: DEGREE_ABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });
  useEffect(() => { if (error) console.error('[useDegreeTokenURI]', error); }, [error]);
  return { uri: data as string | undefined, isLoading, error };
}

export function useDegreeLocked(tokenId: bigint | undefined) {
  const { degreeAddress } = useContracts();
  const { data, isLoading, error } = useReadContract({
    address: degreeAddress,
    abi: DEGREE_ABI,
    functionName: 'locked',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });
  useEffect(() => { if (error) console.error('[useDegreeLocked]', error); }, [error]);
  return { locked: !!data, isLoading, error };
}

export function usePauseControl() {
  const { accessControlAddress } = useContracts();
  const { data: txHash, writeContract } = useWriteContract();

  return {
    txHash,
    pause: () =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'pause',
        args: [],
      }),
    unpause: () =>
      writeContract({
        address: accessControlAddress,
        abi: ACCESS_CONTROL_ABI,
        functionName: 'unpause',
        args: [],
      }),
  };
}

export function useIsSystemPaused() {
  const { accessControlAddress } = useContracts();
  const { data, isLoading } = useReadContract({
    address: accessControlAddress,
    abi: ACCESS_CONTROL_ABI,
    functionName: 'isPaused',
    args: [],
  });
  return { isPaused: !!data, isLoading };
}

export function useRevokeDegree() {
  const { degreeAddress } = useContracts();
  const { data: txHash, writeContract } = useWriteContract();
  return {
    txHash,
    burnDegree: (tokenId: bigint) =>
      writeContract({
        address: degreeAddress,
        abi: DEGREE_ABI,
        functionName: 'burnDegree',
        args: [tokenId],
      }),
  };
}

export function useRevokeProof() {
  const { proofRegistryAddress } = useContracts();
  const { data: txHash, writeContract } = useWriteContract();
  return {
    txHash,
    revokeProof: (fileHash: `0x${string}`) =>
      writeContract({
        address: proofRegistryAddress,
        abi: PROOF_REGISTRY_ABI,
        functionName: 'revokeProof',
        args: [fileHash],
      }),
  };
}

export { ACCESS_CONTROL_ABI, PROOF_REGISTRY_ABI, DEGREE_ABI };
