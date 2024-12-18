// @ts-ignore
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    base_sepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
     accounts: [process.env.PRIVATE_KEY!]
   }
 },
 etherscan: {
    apiKey: {
       baseSepolia: process.env.BASE_API_KEY!,
      },
   },
};

export default config;
