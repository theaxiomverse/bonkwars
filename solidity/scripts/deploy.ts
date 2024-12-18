import { ethers} from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import 'dotenv/config';
import { keccak256, toUtf8Bytes, getAddress } from "ethers";
import { id } from "ethers";

async function main(hre?:HardhatRuntimeEnvironment) {
    // Get contract factories
    const Deployer = await ethers.getContractFactory("Deployer");
    const Controller = await ethers.getContractFactory("Controller");
    const PredictionMarket = await ethers.getContractFactory("PredictionMarketNFT");
    const TestToken = await ethers.getContractFactory("TestToken");
    const Escrow = await ethers.getContractFactory("CustomEscrow");
    // Set the min delay for timelock controller to 1 day
    const minDelay = 1 * 24 * 60 * 60;

    // Deploy the deployer contract
    console.log("Deploying Deployer contract...");
    const deployer = await Deployer.deploy();
    await deployer.waitForDeployment()
    console.log("Deployer contract deployed to:", deployer.getAddress());

    // Deploy controller using create2
    console.log("Deploying Controller contract...");
    const controllerBytecode = Controller.bytecode;
    const controllerSalt = keccak256(toUtf8Bytes(await deployer.getAddress() + "controllerSalt" + id("controller") ));
    const deployedController = await deployer.deployController(controllerBytecode, controllerSalt);
     console.log("Controller deployed to:", deployedController);
    const dctrl = await deployedController.wait(1);
    // add the deployer to the timelock
    const controller = await ethers.getContractAt("Controller", dctrl?.contractAddress || "");
    await controller.grantRole(await controller.PROPOSER_ROLE(), await deployer.getAddress());
    await controller.grantRole(await controller.EXECUTOR_ROLE(), await deployer.getAddress());

    // Deploy test token using create2
    console.log("Deploying test token contract...");
    const testTokenBytecode = TestToken.bytecode;
      const testTokenSalt = keccak256(toUtf8Bytes(getAddress(await deployer.getAddress()) + "testTokenSalt" + id("testToken")));
    const deployedTestToken = await deployer.deployContract(testTokenBytecode, testTokenSalt);
    console.log("Test token deployed to:", deployedTestToken);

      // Deploy escrow
    console.log("Deploying Escrow contract...");
    const escrowBytecode = Escrow.bytecode;
      const escrowSalt = keccak256(toUtf8Bytes(getAddress(await deployer.getAddress()) + "escrowSalt" + id("escrow")));
    const deployedEscrow = await deployer.deployContract(escrowBytecode, escrowSalt);
    console.log("Escrow deployed to:", deployedEscrow);

    // Deploy prediction market using create2
    console.log("Deploying PredictionMarket contract...");
    const eventDescription = "Will DOGE or SHIB win?";
    const marketId = 1;
       const memecoinA = "0x0000000000000000000000000000000000000001"
     const memecoinB ="0x0000000000000000000000000000000000000002"
    const predictionMarketBytecode = PredictionMarket.bytecode;
      const predictionMarketSalt = keccak256(toUtf8Bytes(getAddress(await deployer.getAddress()) + "predictionMarketSalt" + id("predictionMarket")));
     const deployedPredictionMarket = await deployer.deployContract(predictionMarketBytecode, predictionMarketSalt);
    console.log("PredictionMarket deployed to:", deployedPredictionMarket);

    const dtx = await deployedPredictionMarket.wait(1)
    const dpa = dtx?.contractAddress || ""
    const token = await deployedTestToken.wait(1)
    const predContract = await ethers.getContractAt("PredictionMarketNFT",dpa)
    const tokenContract = await ethers.getContractAt("TestBonkToken", token?.contractAddress || "")
     // Register contract addresses in the controller
    console.log("Registering contract addresses in controller...");
  
    await deployer.registerContract("predictionMarket", predContract);
    await deployer.registerContract("testToken", tokenContract);
    await deployer.registerContract("escrow", deployedEscrow.data);
      // Optional: Verify the contract on Block Explorer
    if (process.env.BASE_API_KEY) {
       console.log("Verifying deployer on BaseScan...");
          try {
              await hre?.run("verify:verify", {
                 address: deployer.getAddress()
            });
              console.log("Contract verification successful!");
        } catch (error) {
             console.error("Deployer verification failed:", error);
       }
      console.log("Verifying controller on BaseScan...");
      try {
            await hre?.run("verify:verify", {
                address: deployedController,
              constructorArguments: [minDelay],
           });
             console.log("Contract verification successful!");
      } catch (error) {
          console.error("Controller verification failed:", error);
       }
  console.log("Verifying prediction market on BaseScan...");
       try {
           await hre?.run("verify:verify", {
               address: deployedPredictionMarket,
                constructorArguments: [deployedController, eventDescription, marketId, memecoinA, memecoinB, deployedEscrow],
           });
           console.log("Contract verification successful!");
       } catch (error) {
            console.error("Prediction Market verification failed:", error);
       }
  console.log("Verifying TestToken on BaseScan...");
    try {
       await hre?.run("verify:verify", {
            address: deployedTestToken,
        });
        console.log("Contract verification successful!");
  } catch (error) {
        console.error("TestToken verification failed:", error);
     }
 console.log("Verifying Escrow on BaseScan...");
    try {
        await hre?.run("verify:verify", {
            address: deployedEscrow,
            constructorArguments: [deployedTestToken],
      });
     console.log("Escrow verification successful!");
   } catch (error) {
       console.error("Escrow verification failed:", error);
   }
    } else {
         console.warn("Base API key not found, skipping contract verification.")
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });