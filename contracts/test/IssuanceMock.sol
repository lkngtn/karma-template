pragma solidity ^0.4.24;

import "../Issuance.sol";


contract IssuanceMock is Issuance {
    uint256 mockBlockNumber;
    
    function mock_setBlockNumber(uint256 _mockBlockNumber) external {
        mockBlockNumber = _mockBlockNumber;
    }

    function mock_increaseBlockNumber(uint256 _inc) external {
        mockBlockNumber += _inc;
    }

    function _blockNumber() internal view returns (uint256) {
        return mockBlockNumber;
    }
}