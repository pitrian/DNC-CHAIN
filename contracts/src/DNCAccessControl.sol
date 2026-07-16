pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DNCAccessControl is AccessControl {
    bytes32 public constant AUTHORITY_ROLE = keccak256("AUTHORITY_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    event RoleGrantedWithLabel(
        bytes32 indexed role, address indexed account, string roleLabel
    );
    event RoleRevokedWithLabel(
        bytes32 indexed role, address indexed account, string roleLabel
    );

    error AlreadyHasRole(bytes32 role, address account);
    error NotAdmin(address account);

    constructor(address admin) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    modifier onlyAdmin() {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert NotAdmin(msg.sender);
        }
        _;
    }

    modifier onlyAuthority() {
        _checkRole(AUTHORITY_ROLE);
        _;
    }

    function grantAuthorityRole(address account) external onlyAdmin {
        if (hasRole(AUTHORITY_ROLE, account)) {
            revert AlreadyHasRole(AUTHORITY_ROLE, account);
        }
        _grantRole(AUTHORITY_ROLE, account);
        emit RoleGrantedWithLabel(AUTHORITY_ROLE, account, "AUTHORITY");
    }

    function revokeAuthorityRole(address account) external onlyAdmin {
        _revokeRole(AUTHORITY_ROLE, account);
        emit RoleRevokedWithLabel(AUTHORITY_ROLE, account, "AUTHORITY");
    }

    function grantUserRole(address account) external onlyAdmin {
        if (hasRole(USER_ROLE, account)) {
            revert AlreadyHasRole(USER_ROLE, account);
        }
        _grantRole(USER_ROLE, account);
        emit RoleGrantedWithLabel(USER_ROLE, account, "USER");
    }

    function revokeUserRole(address account) external onlyAdmin {
        _revokeRole(USER_ROLE, account);
        emit RoleRevokedWithLabel(USER_ROLE, account, "USER");
    }

    function isAuthority(address account) external view returns (bool) {
        return hasRole(AUTHORITY_ROLE, account);
    }

    function isUser(address account) external view returns (bool) {
        return hasRole(USER_ROLE, account);
    }

    error ZeroAddress();
}
