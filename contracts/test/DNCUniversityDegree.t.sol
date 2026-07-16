pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/DNCAccessControl.sol";
import "../src/DNCUniversityDegree.sol";

contract DNCUniversityDegreeTest is Test {
    DNCAccessControl public accessControl;
    DNCUniversityDegree public degree;

    address public admin = makeAddr("admin");
    address public authority = makeAddr("authority");
    address public student = makeAddr("student");
    address public stranger = makeAddr("stranger");

    string public constant TEST_URI =
        "https://dnc-certitrust.vercel.app/api/metadata/1";
    string public constant TOKEN_NAME = "DNC University Degree";
    string public constant TOKEN_SYMBOL = "DNCD";

    event DegreeMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed issuer,
        string uri,
        uint256 timestamp
    );
    event DegreeBurned(
        uint256 indexed tokenId,
        address indexed burner,
        uint256 timestamp
    );

    function setUp() public {
        accessControl = new DNCAccessControl(admin);
        degree = new DNCUniversityDegree(
            address(accessControl), TOKEN_NAME, TOKEN_SYMBOL
        );

        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);
    }

    function test_Constructor() public {
        assertEq(degree.name(), TOKEN_NAME);
        assertEq(degree.symbol(), TOKEN_SYMBOL);
        assertEq(degree.totalSupply(), 0);
    }

    function test_Constructor_RevertZeroAddress() public {
        vm.expectRevert(DNCUniversityDegree.ZeroAddress.selector);
        new DNCUniversityDegree(address(0), TOKEN_NAME, TOKEN_SYMBOL);
    }

    function test_MintDegree() public {
        vm.prank(authority);
        vm.expectEmit(true, true, true, true);
        emit DegreeMinted(1, student, authority, TEST_URI, block.timestamp);
        uint256 tokenId = degree.mintDegree(student, TEST_URI);

        assertEq(tokenId, 1);
        assertEq(degree.ownerOf(tokenId), student);
        assertEq(degree.totalSupply(), 1);
        assertEq(degree.tokenURI(tokenId), TEST_URI);
    }

    function test_MintDegree_IncrementsTokenId() public {
        vm.startPrank(authority);
        uint256 firstId = degree.mintDegree(student, TEST_URI);
        uint256 secondId = degree.mintDegree(student, "uri2");
        vm.stopPrank();

        assertEq(firstId, 1);
        assertEq(secondId, 2);
    }

    function test_MintDegree_RevertNonAuthority() public {
        vm.prank(stranger);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCUniversityDegree.Unauthorized.selector, stranger
            )
        );
        degree.mintDegree(student, TEST_URI);
    }

    function test_MintDegree_RevertZeroAddress() public {
        vm.prank(authority);
        vm.expectRevert(DNCUniversityDegree.ZeroAddress.selector);
        degree.mintDegree(address(0), TEST_URI);
    }

    function test_MintDegree_RevertEmptyURI() public {
        vm.prank(authority);
        vm.expectRevert(DNCUniversityDegree.EmptyURI.selector);
        degree.mintDegree(student, "");
    }

    function test_Soulbound_TransferReverts() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        vm.prank(student);
        vm.expectRevert(
            DNCUniversityDegree.SoulboundNonTransferable.selector
        );
        degree.transferFrom(student, stranger, 1);
    }

    function test_Soulbound_SafeTransferReverts() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        vm.prank(student);
        vm.expectRevert(
            DNCUniversityDegree.SoulboundNonTransferable.selector
        );
        degree.safeTransferFrom(student, stranger, 1);
    }

    function test_Soulbound_ApprovalReverts() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        vm.prank(student);
        vm.expectRevert(
            DNCUniversityDegree.SoulboundApprovalNotAllowed.selector
        );
        degree.approve(stranger, 1);
    }

    function test_Soulbound_SetApprovalForAllReverts() public {
        vm.prank(student);
        vm.expectRevert(
            DNCUniversityDegree.SoulboundApprovalNotAllowed.selector
        );
        degree.setApprovalForAll(stranger, true);
    }

    function test_Locked() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        assertTrue(degree.locked(1));
    }

    function test_Locked_RevertNonExistent() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCUniversityDegree.TokenDoesNotExist.selector, 1
            )
        );
        degree.locked(1);
    }

    function test_BurnDegree_ByOwner() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        vm.prank(student);
        vm.expectEmit(true, true, true, true);
        emit DegreeBurned(1, student, block.timestamp);
        degree.burnDegree(1);

        vm.expectRevert();
        degree.ownerOf(1);
        assertEq(degree.totalSupply(), 1);
    }

    function test_BurnDegree_ByAuthority() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        vm.prank(authority);
        degree.burnDegree(1);
    }

    function test_BurnDegree_ByAdmin() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        vm.prank(admin);
        degree.burnDegree(1);
    }

    function test_BurnDegree_RevertStranger() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        vm.prank(stranger);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCUniversityDegree.Unauthorized.selector, stranger
            )
        );
        degree.burnDegree(1);
    }

    function test_BurnDegree_RevertNonExistent() public {
        vm.prank(admin);
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCUniversityDegree.TokenDoesNotExist.selector, 1
            )
        );
        degree.burnDegree(1);
    }

    function test_GetDegreeIssuer() public {
        vm.prank(authority);
        degree.mintDegree(student, TEST_URI);

        assertEq(degree.getDegreeIssuer(1), authority);
    }

    function test_GetDegreeIssuer_RevertNonExistent() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                DNCUniversityDegree.TokenDoesNotExist.selector, 1
            )
        );
        degree.getDegreeIssuer(1);
    }

    function test_GetDegreesByOwner() public {
        vm.startPrank(authority);
        degree.mintDegree(student, TEST_URI);
        degree.mintDegree(student, "uri2");
        vm.stopPrank();

        uint256[] memory tokens = degree.getDegreesByOwner(student);
        assertEq(tokens.length, 2);
        assertEq(tokens[0], 1);
        assertEq(tokens[1], 2);
    }

    function test_SupportsInterface_ERC5192() public {
        assertTrue(
            degree.supportsInterface(type(IERC5192).interfaceId)
        );
    }

    function test_SupportsInterface_ERC721() public {
        assertTrue(
            degree.supportsInterface(0x80ac58cd)
        );
    }

    function test_GetApproved_ReturnsZero() public {
        assertEq(
            degree.getApproved(1), address(0)
        );
    }

    function test_IsApprovedForAll_ReturnsFalse() public {
        assertFalse(
            degree.isApprovedForAll(student, stranger)
        );
    }
}
