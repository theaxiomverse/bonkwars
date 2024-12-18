// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Controller is TimelockController {
    mapping(string => address) public contractAddresses;
    event ContractAddressUpdated(string contractKey, address newAddress);

     constructor(uint256 minDelay, address[] memory __owner)
        
         TimelockController(minDelay,  __owner ,  __owner, address(0)){}

    function setContractAddress(string memory _contractKey, address _contractAddress) public onlyRole(PROPOSER_ROLE) {
        bytes32 salt = keccak256(abi.encodePacked(_contractKey, _contractAddress));
        bytes memory data = abi.encodeWithSignature("executeSetContractAddress(string,address)", _contractKey, _contractAddress);
        //bytes32 operationId = this.hashOperation(address(this), 0 , data, bytes32(0), salt);
        this.schedule(address(this), 0, data, bytes32(0), salt, getMinDelay());
          emit ContractAddressUpdated(_contractKey, _contractAddress);
    }
    function executeSetContractAddress(string memory _contractKey, address _contractAddress) public  onlyRoleOrOpenRole(EXECUTOR_ROLE) {
        bytes32 salt = keccak256(abi.encodePacked(_contractKey, _contractAddress));
        bytes memory data = abi.encodeWithSignature("executeSetContractAddress(string,address)", _contractKey, _contractAddress);
        //bytes32 operationId = this.hashOperation(address(this), 0 , data, bytes32(0), salt);
        this.execute(address(this), 0, data, bytes32(0), salt);
        contractAddresses[_contractKey] = _contractAddress;
    }

     function getContractAddress(string memory _contractKey) public view returns(address){
        return contractAddresses[_contractKey];
    }
}