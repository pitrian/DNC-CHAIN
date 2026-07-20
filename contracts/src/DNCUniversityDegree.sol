pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./DNCAccessControl.sol";

interface IERC5192 {
    function locked(uint256 tokenId) external view returns (bool);
}

contract DNCUniversityDegree is ERC721URIStorage, IERC5192 {
    DNCAccessControl public accessControl;

    uint256 private nextTokenId;
    string private baseURI;

    mapping(uint256 => address) private degreeIssuers;
    mapping(address => uint256[]) private ownerDegrees;

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

    error SoulboundNonTransferable();
    error SoulboundApprovalNotAllowed();
    error Unauthorized(address caller);
    error ZeroAddress();
    error TokenDoesNotExist(uint256 tokenId);
    error EmptyURI();

    constructor(
        address accessControlAddress,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        if (accessControlAddress == address(0)) revert ZeroAddress();
        accessControl = DNCAccessControl(accessControlAddress);
        nextTokenId = 1;
    }

    modifier onlyEducation() {
        if (!accessControl.isEducation(msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyAuthority() {
        if (!accessControl.isAuthority(msg.sender)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    function mintDegree(address to, string memory uri)
        external
        onlyEducation
        returns (uint256)
    {
        if (to == address(0)) revert ZeroAddress();
        if (bytes(uri).length == 0) revert EmptyURI();

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        degreeIssuers[tokenId] = msg.sender;
        ownerDegrees[to].push(tokenId);

        emit DegreeMinted(tokenId, to, msg.sender, uri, block.timestamp);
        return tokenId;
    }

    function burnDegree(uint256 tokenId) external {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist(tokenId);
        if (
            msg.sender != ownerOf(tokenId)
                && !accessControl.hasRole(
                    accessControl.DEFAULT_ADMIN_ROLE(), msg.sender
                )
                && !accessControl.isAuthority(msg.sender)
        ) {
            revert Unauthorized(msg.sender);
        }

        _burn(tokenId);
        delete degreeIssuers[tokenId];
        emit DegreeBurned(tokenId, msg.sender, block.timestamp);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist(tokenId);
        return true;
    }

    function getDegreeIssuer(uint256 tokenId)
        external
        view
        returns (address)
    {
        if (_ownerOf(tokenId) == address(0)) revert TokenDoesNotExist(tokenId);
        return degreeIssuers[tokenId];
    }

    function getDegreesByOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        return ownerDegrees[owner];
    }

    function totalSupply() external view returns (uint256) {
        return nextTokenId - 1;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundNonTransferable();
        }
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert SoulboundApprovalNotAllowed();
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert SoulboundApprovalNotAllowed();
    }

    function getApproved(uint256) public view override(ERC721, IERC721) returns (address) {
        return address(0);
    }

    function isApprovedForAll(address, address)
        public
        view
        override(ERC721, IERC721)
        returns (bool)
    {
        return false;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return interfaceId == type(IERC5192).interfaceId
            || super.supportsInterface(interfaceId);
    }
}
