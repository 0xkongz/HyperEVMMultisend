require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hyperevm: {
      url: process.env.HYPEREVM_RPC_URL || "https://rpc.hyperliquid.xyz/evm",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 999,
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
  },
  etherscan: {
    apiKey: {
      hyperevm: "4G4E8YWEI13KJDG856KR6KUUC88GWD3XYX"
    },
    customChains: [
      {
        network: "hyperevm",
        chainId: 999,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api?chainid=999",
          browserURL: "https://hyperevmscan.io"
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
