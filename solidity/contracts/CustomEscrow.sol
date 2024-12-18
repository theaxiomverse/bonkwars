// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CustomEscrow {
    IERC20 public token;
    mapping(address => uint256) public balances;

    constructor(address _token) {
        token = IERC20(_token);
    }
    function deposit(address _depositor, uint256 _amount) public  {
           token.transferFrom(_depositor, address(this), _amount);
           balances[_depositor] += _amount;
    }

    function withdraw(address payable _withdrawer, uint256 _amount) public {
         require(balances[_withdrawer] >= _amount, "Insufficient Balance");
        balances[_withdrawer] -= _amount;
        token.transfer(_withdrawer, _amount);
    }

       function getBalance(address _user) public view returns (uint256) {
          return balances[_user];
        }

         function getContractBalance() public view returns (uint256) {
              return token.balanceOf(address(this));
        }

}