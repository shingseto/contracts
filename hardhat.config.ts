import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";

dotenv.config();
// const mnemonic: string | undefined = process.env.MNEMONIC;
// if (!mnemonic) {
//   throw new Error("Please set your MNEMONIC in a .env file");
// }

// const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
// if (!infuraApiKey) {
//   // throw new Error("Please set your INFURA_API_KEY in a .env file");
// }

// https://hardhat.org/config/
// https://hardhat.org/guides/compile-contracts/
const config: HardhatUserConfig = {
  solidity: {
    version: process.env.SOLIDITY_VERSION || "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Ethereum
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      chainId: 4,
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // BNB Chain
    bnb: {
      chainId: 56,
      url: `https://bsc.getblock.io/mainnet/?api_key=${process.env.GETBLOCK_API_KEY}`,
    },
    bnbTestnet: {
      chainId: 97,
      url: `https://bsc.getblock.io/testnet/?api_key=${process.env.GETBLOCK_API_KEY}`,
    },
    // Fantom
    fantom: {
      chainId: 250,
      url: `https://ftm.getblock.io/mainnet/?api_key=${process.env.GETBLOCK_API_KEY}`,
    },
    fantomTestnet: {
      chainId: 4002,
      url: `https://rpc.testnet.fantom.network/`,
    },
    // Optimism
    optimisim: {
      chainId: 10,
      url: `https://optimism-arbitrum.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimisimKovan: {
      chainId: 69,
      url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // Polygon
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    polygonMumbai: {
      chainId: 80001,
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // Arbitrum
    arbitrum: {
      chainId: 42161,
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrumRinkeby: {
      chainId: 421611,
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // Avalanche
    avalanche: {
      chainId: 43114,
      url: `https://avax.getblock.io/mainnet/?api_key=${process.env.GETBLOCK_API_KEY}`,
    },
    avalancheFuji: {
      chainId: 43113,
      url: `https://avax.getblock.io/testnet/?api_key=${process.env.GETBLOCK_API_KEY}`,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || undefined,
    showTimeSpent: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    parallel: true,
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
    only: [
      "Registry",
      "SingletonRegistrar",
      "SingletonRegistrarController",
      "Token",
      "DomainPriceOracle",
      "TokenPriceOracle",
      "PublicResolver",
      "PublicResolverSynchronizer",
      "Root",
      "OmniRegistrar",
      "OmniRegistrarController",
      "OmniRegistrarSynchronizer",
    ],
  },
};

export default config;
