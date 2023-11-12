// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../UrbanCryptToken.sol";

contract PlasticBottleToken is UrbanCryptToken {
    constructor(address defaultAdmin, address pauser, address minter)
        UrbanCryptToken(defaultAdmin, pauser, minter, "Plastic Bottle Token", "PBT")
    {}
}