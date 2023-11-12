// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../UrbanCryptToken.sol";

contract CanToken is UrbanCryptToken {
    constructor(address defaultAdmin, address pauser, address minter)
        UrbanCryptToken(defaultAdmin, pauser, minter, "CanToken", "CAT")
    {}
}