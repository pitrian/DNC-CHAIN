pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract DNCAccessControl is AccessControl, Pausable {
    bytes32 public constant AUTHORITY_ROLE = keccak256("AUTHORITY_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    bytes32 public constant EDUCATION_ROLE = keccak256("EDUCATION_ROLE");
    bytes32 public constant SCIENCE_TECH_ROLE = keccak256("SCIENCE_TECH_ROLE");

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

    modifier onlyEducation() {
        _checkRole(EDUCATION_ROLE);
        _;
    }

    modifier onlyScienceTech() {
        _checkRole(SCIENCE_TECH_ROLE);
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

    function grantEducationRole(address account) external onlyAdmin {
        if (hasRole(EDUCATION_ROLE, account)) {
            revert AlreadyHasRole(EDUCATION_ROLE, account);
        }
        _grantRole(EDUCATION_ROLE, account);
        emit RoleGrantedWithLabel(EDUCATION_ROLE, account, "EDUCATION");
    }

    function revokeEducationRole(address account) external onlyAdmin {
        _revokeRole(EDUCATION_ROLE, account);
        emit RoleRevokedWithLabel(EDUCATION_ROLE, account, "EDUCATION");
    }

    function grantScienceTechRole(address account) external onlyAdmin {
        if (hasRole(SCIENCE_TECH_ROLE, account)) {
            revert AlreadyHasRole(SCIENCE_TECH_ROLE, account);
        }
        _grantRole(SCIENCE_TECH_ROLE, account);
        emit RoleGrantedWithLabel(SCIENCE_TECH_ROLE, account, "SCIENCE_TECH");
    }

    function revokeScienceTechRole(address account) external onlyAdmin {
        _revokeRole(SCIENCE_TECH_ROLE, account);
        emit RoleRevokedWithLabel(SCIENCE_TECH_ROLE, account, "SCIENCE_TECH");
    }

    function isAuthority(address account) external view returns (bool) {
        return hasRole(AUTHORITY_ROLE, account);
    }

    function isUser(address account) external view returns (bool) {
        return hasRole(USER_ROLE, account);
    }

    function isEducation(address account) external view returns (bool) {
        return hasRole(EDUCATION_ROLE, account);
    }

    function isScienceTech(address account) external view returns (bool) {
        return hasRole(SCIENCE_TECH_ROLE, account);
    }

    error ZeroAddress();

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }

    function isPaused() external view returns (bool) {
        return paused();
    }
}
