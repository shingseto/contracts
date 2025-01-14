// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "../utils/LabelValidator.sol";
import "../registry/IRegistry.sol";
import "./interfaces/IPublicResolverSynchronizer.sol";

abstract contract BaseResolver is ERC165Upgradeable, LabelValidator, ContextUpgradeable {
  bytes32 internal constant AT = keccak256(bytes("@"));
  bytes internal constant DOT = bytes(".");

  IRegistry internal _registry;

  IPublicResolverSynchronizer internal _synchronizer;

  modifier onlyAuthorised(
    bytes memory host,
    bytes memory domain,
    bytes memory tld
  ) {
    require(_isAuthorised(host, domain, tld), "FORBIDDEN");
    _;
  }

  modifier onlyLive(bytes memory domain, bytes memory tld) {
    require(_isLive(domain, tld), "DOMAIN_EXPIRED");
    _;
  }

  modifier onlySynchronizer() {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    _;
  }

  function __BaseResolver_init_unchained(IRegistry registry_, IPublicResolverSynchronizer synchronizer_) internal onlyInitializing {
    _synchronizer = synchronizer_;
    _registry = registry_;
  }

  function _isAuthorised(
    bytes memory host,
    bytes memory domain,
    bytes memory tld
  ) internal view returns (bool) {
    bytes32 host_ = keccak256(host);
    bytes32 domain_ = keccak256(domain);
    bytes32 tld_ = keccak256(tld);
    return _registry.owner(domain_, tld_) == _msgSender() || _registry.operator(domain_, tld_, _msgSender()) || _registry.operator(host_, domain_, tld_, _msgSender());
  }

  function _isLive(bytes memory domain, bytes memory tld) internal view returns (bool) {
    bytes32 domain_ = keccak256(domain);
    bytes32 tld_ = keccak256(tld);
    return _registry.live(domain_, tld_);
  }

  function _setHostRecord(
    bytes memory host,
    bytes memory domain,
    bytes memory tld
  ) internal {
    bytes32 host_ = keccak256(host);
    bytes32 domain_ = keccak256(domain);
    bytes32 tld_ = keccak256(tld);
    if (!_registry.exists(host_, domain_, tld_)) _registry.setRecord(host, domain, tld);
  }
}
