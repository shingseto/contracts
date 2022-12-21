//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IERC721Wrapper.sol";
import "./interfaces/IERC4907.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";

contract Wrapper is IERC721Wrapper, IERC4907, AccessControlUpgradeable {
  IRegistry private _registry;

  using AddressUpgradeable for address;
  using StringsUpgradeable for uint256;

  bytes32 public constant REGISTRY_ROLE = keccak256("REGISTRY_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  string private _name;
  string private _symbol;
  bytes internal __baseURI;

  mapping(address => uint256) private _balances;
  mapping(uint256 => address) private _tokenApprovals;
  mapping(address => mapping(address => bool)) private _operatorApprovals;

  modifier onlyRegistry() {
    require(hasRole(REGISTRY_ROLE, _msgSender()), "ONLY_REGISTRY");
    _;
  }

  modifier onlyOperator() {
    require(hasRole(OPERATOR_ROLE, _msgSender()), "ONLY_REGISTRY");
    _;
  }

  /* ========== Initializer ==========*/

  function initialize(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) public initializer {
    __Wrapper_init(registry_, name_, symbol_);
  }

  function __Wrapper_init(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) internal onlyInitializing {
    __Wrapper_init_unchained(registry_, name_, symbol_);
    __AccessControl_init();
    __ERC165_init();
  }

  function __Wrapper_init_unchained(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(REGISTRY_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(OPERATOR_ROLE, _msgSender());
    _name = name_;
    _symbol = symbol_;
  }

  /* ========== ERC-721 ==========*/

  function balanceOf(address owner_) public view returns (uint256) {
    require(owner_ != address(0), "ERC721: balance query for the zero address");
    return _balances[owner_];
  }

  function ownerOf(uint256 tokenId_) public view returns (address) {
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId_);
    if (_tokenRecord.type_ == RecordType.RecordType.TLD) {
      return _registry.getOwner(_tokenRecord.tld);
    } else if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN || _tokenRecord.type_ == RecordType.RecordType.HOST) {
      return _registry.getOwner(_tokenRecord.domain, _tokenRecord.tld);
    } else {
      revert(""); // TODO:
    }
  }

  function _transfer(
    address from,
    address to,
    uint256 tokenId
  ) internal {
    require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
    require(to != address(0), "ERC721: transfer to the zero address");
    delete _tokenApprovals[tokenId];
    unchecked {
      _balances[from] -= 1;
      _balances[to] += 1;
    }
    emit Transfer(from, to, tokenId);
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ != RecordType.RecordType.TLD) {
      _registry.setOwner(_tokenRecord.tld, to);
    } else if (_tokenRecord.type_ != RecordType.RecordType.DOMAIN) {
      _registry.setOwner(_tokenRecord.domain, _tokenRecord.tld, to);
    } else {
      revert(""); // TODO:
    }
  }

  function _safeTransfer(
    address from,
    address to,
    uint256 tokenId,
    bytes memory data
  ) internal virtual {
    _transfer(from, to, tokenId);
    require(_checkOnERC721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId_,
    bytes memory _data
  ) public {
    _safeTransfer(from, to, tokenId_, _data);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId_
  ) public {
    safeTransferFrom(from, to, tokenId_, "");
  }

  function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
    address owner = ownerOf(tokenId);
    return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
  }

  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public {
    //solhint-disable-next-line max-line-length
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
    _transfer(from, to, tokenId);
  }

  function _approve(address to, uint256 tokenId) internal virtual {
    _tokenApprovals[tokenId] = to;
    emit Approval(ownerOf(tokenId), to, tokenId);
  }

  function approve(address to, uint256 tokenId_) public {
    address owner = ownerOf(tokenId_);
    require(to != owner, "ERC721: approval to current owner");
    require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()), "ERC721: approve caller is not token owner or approved for all");
    _approve(to, tokenId_);
  }

  function getApproved(uint256 tokenId_) public view returns (address) {
    return ownerOf(tokenId_);
  }

  function _setApprovalForAll(
    address owner,
    address operator,
    bool approved
  ) internal virtual {
    require(owner != operator, "ERC721: approve to caller");
    _operatorApprovals[owner][operator] = approved;
    emit ApprovalForAll(owner, operator, approved);
  }

  function setApprovalForAll(address operator, bool approved) public {
    _setApprovalForAll(_msgSender(), operator, approved);
  }

  function isApprovedForAll(address owner, address operator) public view returns (bool) {
    return _operatorApprovals[owner][operator];
  }

  function mint(address to, uint256 tokenId_) external onlyRegistry {
    _balances[to] += 1;
    emit Transfer(address(0), to, tokenId_);
  }

  function burn(uint256 tokenId_) external onlyRegistry {
    address owner = ownerOf(tokenId_);
    emit Transfer(owner, address(0), tokenId_);
  }

  function _checkOnERC721Received(
    address from,
    address to,
    uint256 tokenId,
    bytes memory data
  ) private returns (bool) {
    if (to.isContract()) {
      try IERC721ReceiverUpgradeable(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
        return retval == IERC721ReceiverUpgradeable.onERC721Received.selector;
      } catch (bytes memory reason) {
        if (reason.length == 0) {
          revert("ERC721: transfer to non ERC721Receiver implementer");
        } else {
          /// @solidity memory-safe-assembly
          assembly {
            revert(add(32, reason), mload(reason))
          }
        }
      }
    } else {
      return true;
    }
  }

  /* ========== ERC-721 Metadata ==========*/

  function name() public view virtual returns (string memory) {
    return _name;
  }

  function setName(string memory name_) public onlyOperator {
    _name = name_;
  }

  function symbol() public view virtual returns (string memory) {
    return _symbol;
  }

  function setSymbol(string memory symbol_) public onlyOperator {
    _symbol = symbol_;
  }

  function tokenURI(uint256 tokenId_) public view returns (string memory) {
    return string(abi.encodePacked(__baseURI, "/", StringsUpgradeable.toString(tokenId_), "/", "body.json"));
  }

  function setBaseURI(string memory baseURI_) public virtual onlyOperator {
    __baseURI = bytes(baseURI_);
  }

  /* ========== ERC-4907 ==========*/

  function setUser(
    uint256 tokenId,
    address user,
    uint64 expires
  ) public {
    require(_msgSender() == ownerOf(tokenId), "ERC4907: forbidden access");
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN) {
      _registry.setUser(_tokenRecord.domain, _tokenRecord.tld, user, expires);
    } else if (_tokenRecord.type_ == RecordType.RecordType.HOST) {
      _registry.setUser(_tokenRecord.host, _tokenRecord.domain, _tokenRecord.tld, user, expires);
    } else {
      revert(""); // TODO:
    }
  }

  function userOf(uint256 tokenId) public view returns (address) {
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN) {
      return _registry.getUser(_tokenRecord.domain, _tokenRecord.tld);
    } else if (_tokenRecord.type_ == RecordType.RecordType.HOST) {
      return _registry.getUser(_tokenRecord.host, _tokenRecord.domain, _tokenRecord.tld);
    } else {
      revert(""); // TODO:
    }
  }

  function userExpires(uint256 tokenId) public view returns (uint256) {
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN) {
      return _registry.getUserExpires(_tokenRecord.domain, _tokenRecord.tld);
    } else if (_tokenRecord.type_ == RecordType.RecordType.HOST) {
      return _registry.getUserExpires(_tokenRecord.host, _tokenRecord.domain, _tokenRecord.tld);
    } else {
      revert(""); // TODO:
    }
  }

  /* ============= */
  function supportsInterface(bytes4 interfaceID) public view override(IERC165Upgradeable, AccessControlUpgradeable) returns (bool) {
    return
      interfaceID == type(IERC721Upgradeable).interfaceId ||
      interfaceID == type(IERC721MetadataUpgradeable).interfaceId ||
      interfaceID == type(IERC4907).interfaceId ||
      super.supportsInterface(interfaceID);
  }
}