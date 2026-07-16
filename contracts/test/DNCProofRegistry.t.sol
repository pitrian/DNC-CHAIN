pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/DNCAccessControl.sol";
import "../src/DNCProofRegistry.sol";

contract DNCProofRegistryTest is Test {
    DNCAccessControl public accessControl;
    DNCProofRegistry public registry;

    address public admin = makeAddr("admin");
    address public authority = makeAddr("authority");
    address public user = makeAddr("user");
    address public stranger = makeAddr("stranger");

    bytes32 public constant TEST_HASH = keccak256("test-document-v1");
    bytes32 public constant ANOTHER_HASH = keccak256("another-document");

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

    function setUp() public {
        accessControl = new DNCAccessControl(admin);
        registry = new DNCProofRegistry(address(accessControl));

        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);
    }

    function test_Constructor_SetsAccessControl() public {
        assertEq(
            address(registry.accessControl()),
            address(accessControl)
        );
    }

    function test_Constructor_RevertZeroAddress() public {
        vm.expectRevert(DNCProofRegistry.ZeroAddress.selector);
        new DNCProofRegistry(address(0));
    }

    function test_RegisterProof() public {
        vm.prank(authority);
        vm.expectEmit(true, true, true, true);
        emit DocumentRegistered(TEST_HASH, authority, block.timestamp);
        registry.registerProof(TEST_HASH);

        assertTrue(registry.isRegistered(TEST_HASH));
    }

    function test_RegisterProof_RevertEmptyHash() public {
        vm.prank(authority);
        vm.expectRevert(DNCProofRegistry.EmptyHash.selector);
        registry.registerProof(bytes32(0));
    }

    function test_RegisterProof_RevertNonAuthority() public {
        vm.prank(stranger);
        vm.expectRevert(
            abi.encodeWithSelector(DNCProofRegistry.Unauthorized.selector, stranger)
        );
        registry.registerProof(TEST_HASH);
    }

    function test_RegisterProof_RevertDuplicate() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        vm.prank(authority);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCProofRegistry.ProofAlreadyExists.selector, TEST_HASH
            )
        );
        registry.registerProof(TEST_HASH);
    }

    function test_RegisterProof_StoresCorrectIssuer() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        DNCProofRegistry.ProofInfo memory proof = registry.getProof(TEST_HASH);
        assertEq(proof.issuer, authority);
        assertEq(proof.fileHash, TEST_HASH);
        assertFalse(proof.revoked);
        assertEq(proof.timestamp, block.timestamp);
    }

    function test_VerifyProof_ValidDocument() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        vm.prank(user);
        vm.expectEmit(true, true, true, true);
        emit DocumentVerified(TEST_HASH, user, true);
        bool result = registry.verifyProof(TEST_HASH);
        assertTrue(result);
    }

    function test_VerifyProof_RevokedDocument() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        vm.prank(authority);
        registry.revokeProof(TEST_HASH);

        vm.prank(user);
        bool result = registry.verifyProof(TEST_HASH);
        assertFalse(result);
    }

    function test_VerifyProof_RevertNonExistent() public {
        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCProofRegistry.ProofNotFound.selector, TEST_HASH
            )
        );
        registry.verifyProof(TEST_HASH);
    }

    function test_RevokeProof_ByAuthority() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        vm.prank(authority);
        vm.expectEmit(true, true, true, true);
        emit DocumentRevoked(TEST_HASH, authority, block.timestamp);
        registry.revokeProof(TEST_HASH);

        DNCProofRegistry.ProofInfo memory proof = registry.getProof(TEST_HASH);
        assertTrue(proof.revoked);
    }

    function test_RevokeProof_ByAdmin() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        vm.prank(admin);
        registry.revokeProof(TEST_HASH);

        DNCProofRegistry.ProofInfo memory proof = registry.getProof(TEST_HASH);
        assertTrue(proof.revoked);
    }

    function test_RevokeProof_RevertNonAuthorized() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        vm.prank(stranger);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCProofRegistry.Unauthorized.selector, stranger
            )
        );
        registry.revokeProof(TEST_HASH);
    }

    function test_RevokeProof_RevertNonExistent() public {
        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCProofRegistry.ProofNotFound.selector, TEST_HASH
            )
        );
        registry.revokeProof(TEST_HASH);
    }

    function test_RevokeProof_RevertAlreadyRevoked() public {
        vm.prank(authority);
        registry.registerProof(TEST_HASH);

        vm.prank(authority);
        registry.revokeProof(TEST_HASH);

        vm.prank(authority);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCProofRegistry.ProofAlreadyRevoked.selector, TEST_HASH
            )
        );
        registry.revokeProof(TEST_HASH);
    }

    function test_GetProof_RevertNonExistent() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCProofRegistry.ProofNotFound.selector, TEST_HASH
            )
        );
        registry.getProof(TEST_HASH);
    }

    function test_RegisterMultipleProofs() public {
        vm.startPrank(authority);
        registry.registerProof(TEST_HASH);
        registry.registerProof(ANOTHER_HASH);
        vm.stopPrank();

        assertTrue(registry.isRegistered(TEST_HASH));
        assertTrue(registry.isRegistered(ANOTHER_HASH));
    }
}
