// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomEscrow.sol";
import "./Controller.sol";

contract PredictionMarketNFT is ERC721, Ownable {
    // Contract variables
    string public eventDescription;
    bool public outcomeResolved = false;
     uint256 public yesSupply = 1;
    uint256 public noSupply = 1;
    uint256 public marketId;
    address public memecoinA;
    address public memecoinB;
    address public escrowAddress;

    address public tokenAddress;
    address public controllerAddress;

    IERC20 public token;
    uint256 public yesBalance;
    uint256 public noBalance;

    mapping(address => uint256) public userYesBalance;
    mapping(address => uint256) public userNoBalance;

    constructor(address _controllerAddress, string memory _eventDescription, uint256 _marketId,  address _memecoinA, address _memecoinB, address _escrowAddress)
        ERC721("PredictionMarketNFT", "PMNFT")
         Ownable(msg.sender)
    {
        eventDescription = _eventDescription;
         controllerAddress = _controllerAddress;
         Controller controller = Controller(payable(_controllerAddress));
        tokenAddress = controller.getContractAddress("testToken");
        marketId = _marketId;
        memecoinA = _memecoinA;
        memecoinB = _memecoinB;
          escrowAddress = _escrowAddress;
        token = IERC20(tokenAddress);
        _safeMint(msg.sender, _marketId);
    }


   function purchaseYes() public payable {
        require(outcomeResolved == false, "Market already resolved");
           token.transferFrom(msg.sender, address(this), msg.value);
        yesBalance += msg.value;
         userYesBalance[msg.sender] += msg.value;
        yesSupply += msg.value;
         CustomEscrow(escrowAddress).deposit(msg.sender, msg.value);
    }

     function purchaseNo() public payable {
        require(outcomeResolved == false, "Market already resolved");
        token.transferFrom(msg.sender, address(this), msg.value);
        noBalance += msg.value;
         userNoBalance[msg.sender] += msg.value;
       noSupply += msg.value;
      CustomEscrow(escrowAddress).deposit(msg.sender, msg.value);
    }

     function getYesPrice() public view returns (uint256){
          return address(this).balance * yesSupply/(yesSupply + noSupply);
    }
    function getNoPrice() public view returns (uint256){
       return address(this).balance * noSupply/(yesSupply + noSupply);
   }


    function resolveMarket() public  onlyOwner {
       require(outcomeResolved == false, "Market already resolved");
       outcomeResolved = true;
        uint256 fee =  CustomEscrow(escrowAddress).getContractBalance() * 3 / 100;
        payable(owner()).transfer(fee);
        if(yesBalance > noBalance) {
              CustomEscrow(escrowAddress).withdraw(payable(msg.sender),  getYesPrice() * userYesBalance[msg.sender] / yesBalance * (CustomEscrow(escrowAddress).getContractBalance() - fee));
        } else {
              CustomEscrow(escrowAddress).withdraw(payable(msg.sender), getNoPrice() * userNoBalance[msg.sender] / noBalance * (CustomEscrow(escrowAddress).getContractBalance() - fee));
        }
    }

    function getImpliedProbabilities() public view returns (uint256, uint256) {
        uint256 totalWeight = yesBalance + noBalance;
        if(totalWeight == 0) return (0, 0);
         return (yesBalance / totalWeight , noBalance / totalWeight);
    }

    // metadata will be updated by backend
   function tokenURI(uint256 tokenId) public view override returns (string memory) {
       return string(abi.encodePacked("ipfs://your_ipfs_cid/", Strings.toString(tokenId),".json"));
    }
}