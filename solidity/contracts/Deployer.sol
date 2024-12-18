// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Controller.sol";

contract Deployer is Ownable {
   address public controllerAddress;

    constructor() Ownable(msg.sender) {
    }
    function deployController(bytes memory bytecode, bytes32 salt) public onlyOwner returns (address) {
         address controller = Create2.deploy(0, salt, bytecode);
        controllerAddress = controller;
        return controller;
    }

     function deployContract(bytes memory bytecode, bytes32 salt) public onlyOwner returns (address) {
        return Create2.deploy(0, salt, bytecode);
    }

     function registerContract(string memory _contractKey, address _contractAddress) public onlyOwner  {
        Controller controller = Controller(payable(controllerAddress));
        controller.setContractAddress(_contractKey, _contractAddress);
    }

}