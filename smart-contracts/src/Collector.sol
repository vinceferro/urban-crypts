// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {UrbanCryptToken} from "./UrbanCryptToken.sol";

contract Collector is AccessControl {
    bytes32 public constant CONTROLLER = keccak256("CONTROLLER");

    enum RecordStatus {PENDING, REJECTED, APPROVED}
    struct Record {
        RecordStatus status;
        uint256 timestamp;
        string metadataLink;
    }

    mapping(address => Record[]) public recordsByAddress;
    constructor(address defaultAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(CONTROLLER, defaultAdmin);
    }

    function publishRecord(string calldata _metadataLink) external returns(uint256) {
        recordsByAddress[msg.sender].push(
            Record({
                status: RecordStatus.PENDING,
                timestamp: block.timestamp,
                metadataLink: _metadataLink
            })
        );

        emit RecordPublished(msg.sender, _metadataLink);

        return recordsByAddress[msg.sender].length - 1;
    }

    function approveRecord(address _address, uint256 _index, UrbanCryptToken[] calldata _tokens, uint256[] calldata _rewards) external onlyRole(CONTROLLER) {
        require(_tokens.length == _rewards.length, "Collector: tokens and rewards length mismatch");
        
        Record storage record = recordsByAddress[_address][_index];
        require(record.status == RecordStatus.PENDING, "Collector: record is not pending");

        record.status = RecordStatus.APPROVED;

        for (uint256 i = 0; i < _tokens.length; i++) {
            _tokens[i].mint(_address, _rewards[i]);
        }

        emit RecordApproved(_address, _index, _tokens, _rewards);
    }

    event RecordPublished(address indexed _address, string _metadataLink);
    event RecordApproved(address indexed _address, uint256 indexed _index, UrbanCryptToken[] _tokens, uint256[] _rewards);

}
