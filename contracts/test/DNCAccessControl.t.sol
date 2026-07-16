pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/DNCAccessControl.sol";

contract DNCAccessControlTest is Test {
    DNCAccessControl public accessControl;

    address public admin = makeAddr("admin");
    address public authority = makeAddr("authority");
    address public user = makeAddr("user");
    address public stranger = makeAddr("stranger");

    event RoleGrantedWithLabel(
        bytes32 indexed role, address indexed account, string roleLabel
    );
    event RoleRevokedWithLabel(
        bytes32 indexed role, address indexed account, string roleLabel
    );

    function setUp() public {
        accessControl = new DNCAccessControl(admin);
    }

    function test_Constructor_SetsAdmin() public {
        assertTrue(accessControl.hasRole(accessControl.DEFAULT_ADMIN_ROLE(), admin));
    }

    function test_Constructor_RevertZeroAddress() public {
        vm.expectRevert(DNCAccessControl.ZeroAddress.selector);
        new DNCAccessControl(address(0));
    }

    function test_GrantAuthorityRole() public {
        vm.expectEmit(true, true, true, true);
        emit RoleGrantedWithLabel(
            accessControl.AUTHORITY_ROLE(), authority, "AUTHORITY"
        );
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);

        assertTrue(accessControl.hasRole(
            accessControl.AUTHORITY_ROLE(), authority
        ));
        assertTrue(accessControl.isAuthority(authority));
    }

    function test_GrantAuthorityRole_RevertNotAdmin() public {
        vm.expectRevert(
            abi.encodeWithSelector(DNCAccessControl.NotAdmin.selector, stranger)
        );
        vm.prank(stranger);
        accessControl.grantAuthorityRole(authority);
    }

    function test_GrantAuthorityRole_RevertAlreadyHasRole() public {
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);

        vm.expectRevert(
            abi.encodeWithSelector(
                DNCAccessControl.AlreadyHasRole.selector,
                accessControl.AUTHORITY_ROLE(), authority
            )
        );
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);
    }

    function test_RevokeAuthorityRole() public {
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);
        assertTrue(accessControl.isAuthority(authority));

        vm.expectEmit(true, true, true, true);
        emit RoleRevokedWithLabel(
            accessControl.AUTHORITY_ROLE(), authority, "AUTHORITY"
        );
        vm.prank(admin);
        accessControl.revokeAuthorityRole(authority);

        assertFalse(accessControl.isAuthority(authority));
    }

    function test_RevokeAuthorityRole_RevertNotAdmin() public {
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);

        vm.expectRevert(
            abi.encodeWithSelector(DNCAccessControl.NotAdmin.selector, stranger)
        );
        vm.prank(stranger);
        accessControl.revokeAuthorityRole(authority);
    }

    function test_GrantUserRole() public {
        vm.expectEmit(true, true, true, true);
        emit RoleGrantedWithLabel(
            accessControl.USER_ROLE(), user, "USER"
        );
        vm.prank(admin);
        accessControl.grantUserRole(user);

        assertTrue(accessControl.isUser(user));
        assertTrue(accessControl.hasRole(
            accessControl.USER_ROLE(), user
        ));
    }

    function test_GrantUserRole_RevertNotAdmin() public {
        vm.expectRevert(
            abi.encodeWithSelector(DNCAccessControl.NotAdmin.selector, stranger)
        );
        vm.prank(stranger);
        accessControl.grantUserRole(user);
    }

    function test_GrantUserRole_RevertAlreadyHasRole() public {
        vm.prank(admin);
        accessControl.grantUserRole(user);

        vm.expectRevert(
            abi.encodeWithSelector(
                DNCAccessControl.AlreadyHasRole.selector,
                accessControl.USER_ROLE(), user
            )
        );
        vm.prank(admin);
        accessControl.grantUserRole(user);
    }

    function test_RevokeUserRole() public {
        vm.prank(admin);
        accessControl.grantUserRole(user);
        assertTrue(accessControl.isUser(user));

        vm.prank(admin);
        accessControl.revokeUserRole(user);
        assertFalse(accessControl.isUser(user));
    }

    function test_RevokeUserRole_RevertNotAdmin() public {
        vm.expectRevert(
            abi.encodeWithSelector(DNCAccessControl.NotAdmin.selector, stranger)
        );
        vm.prank(stranger);
        accessControl.revokeUserRole(user);
    }

    function test_AuthorityCannotGrantRole() public {
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);

        vm.expectRevert(
            abi.encodeWithSelector(DNCAccessControl.NotAdmin.selector, authority)
        );
        vm.prank(authority);
        accessControl.grantAuthorityRole(stranger);
    }

    function test_AuthorityCannotRevokeRole() public {
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);

        vm.expectRevert(
            abi.encodeWithSelector(DNCAccessControl.NotAdmin.selector, authority)
        );
        vm.prank(authority);
        accessControl.revokeAuthorityRole(authority);
    }

    function test_RoleIndependence_AuthorityNotUser() public {
        vm.prank(admin);
        accessControl.grantAuthorityRole(authority);
        assertTrue(accessControl.isAuthority(authority));
        assertFalse(accessControl.isUser(authority));
    }

    function test_RoleIndependence_UserNotAuthority() public {
        vm.prank(admin);
        accessControl.grantUserRole(user);
        assertTrue(accessControl.isUser(user));
        assertFalse(accessControl.isAuthority(user));
    }

    function test_MultipleAuthorities() public {
        address authority2 = address(0x5);

        vm.startPrank(admin);
        accessControl.grantAuthorityRole(authority);
        accessControl.grantAuthorityRole(authority2);
        vm.stopPrank();

        assertTrue(accessControl.isAuthority(authority));
        assertTrue(accessControl.isAuthority(authority2));
    }

    function test_DefaultAdminCanManageRoles() public {
        assertTrue(
            accessControl.hasRole(
                accessControl.DEFAULT_ADMIN_ROLE(), admin
            )
        );
    }
}
