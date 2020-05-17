pragma solidity ^0.4.24;

import "@1hive/apps-token-manager/contracts/HookedTokenManager.sol";

contract IIssuance {

    bytes32 constant public ADD_POLICY_ROLE = keccak256("ADD_POLICY_ROLE");
    bytes32 constant public REMOVE_POLICY_ROLE = keccak256("REMOVE_POLICY_ROLE");

    function initialize(HookedTokenManager _tokenManager) public;

    function addPolicy(address _beneficiary, uint256 _blockInflationRate) external;
}
