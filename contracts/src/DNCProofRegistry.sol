pragma solidity ^0.8.28;

import "./DNCAccessControl.sol";

contract DNCProofRegistry {
    DNCAccessControl public accessControl;

    struct ProofInfo {
        bytes32 fileHash;
        uint256 timestamp;
        address issuer;
        bool revoked;
    }

    mapping(bytes32 => ProofInfo) private proofs;
    mapping(bytes32 => bool) private proofExists;

    event DocumentRegistered(
        bytes32 indexed fileHash,
        address indexed issuer,
        uint256 timestamp
    );
    event DocumentVerified(
        bytes32 indexed fileHash,
        address indexed verifier,
        bool valid
    );
    event DocumentRevoked(
        bytes32 indexed fileHash,
        address indexed revoker,
        uint256 timestamp
    );

    error ZeroAddress();
    error EmptyHash();
    error ProofAlreadyExists(bytes32 fileHash);
    error ProofNotFound(bytes32 fileHash);
    error ProofAlreadyRevoked(bytes32 fileHash);
    error Unauthorized(address caller);

    constructor(address accessControlAddress) {
        if (accessControlAddress == address(0)) revert ZeroAddress();
        accessControl = DNCAccessControl(accessControlAddress);
    }

    modifier onlyScienceTech() {
        if (!accessControl.isScienceTech(msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyAdminOrAuthority() {
        if (
            !accessControl.hasRole(
                accessControl.DEFAULT_ADMIN_ROLE(), msg.sender
            ) && !accessControl.isAuthority(msg.sender)
        ) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    function registerProof(bytes32 fileHash) external onlyScienceTech {
        if (fileHash == bytes32(0)) revert EmptyHash();
        if (proofExists[fileHash]) revert ProofAlreadyExists(fileHash);

        proofs[fileHash] = ProofInfo({
            fileHash: fileHash,
            timestamp: block.timestamp,
            issuer: msg.sender,
            revoked: false
        });
        proofExists[fileHash] = true;

        emit DocumentRegistered(fileHash, msg.sender, block.timestamp);
    }

    function verifyProof(bytes32 fileHash) external returns (bool) {
        if (!proofExists[fileHash]) revert ProofNotFound(fileHash);

        ProofInfo memory proof = proofs[fileHash];
        bool valid = !proof.revoked;

        emit DocumentVerified(fileHash, msg.sender, valid);
        return valid;
    }

    function revokeProof(bytes32 fileHash) external onlyAdminOrAuthority {
        if (!proofExists[fileHash]) revert ProofNotFound(fileHash);
        if (proofs[fileHash].revoked) revert ProofAlreadyRevoked(fileHash);

        proofs[fileHash].revoked = true;
        emit DocumentRevoked(fileHash, msg.sender, block.timestamp);
    }

    function getProof(bytes32 fileHash)
        external
        view
        returns (ProofInfo memory)
    {
        if (!proofExists[fileHash]) revert ProofNotFound(fileHash);
        return proofs[fileHash];
    }

    function isRegistered(bytes32 fileHash) external view returns (bool) {
        return proofExists[fileHash];
    }
}
