const hre = require("hardhat");

async function main() {
  console.log("Deploying MultiSender contract to HyperEVM...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const MultiSender = await hre.ethers.getContractFactory("MultiSender");
  const multiSender = await MultiSender.deploy();

  await multiSender.waitForDeployment();
  const contractAddress = await multiSender.getAddress();

  console.log("MultiSender deployed to:", contractAddress);
  console.log("\n✅ Deployment successful!");
  console.log("\nContract address:", contractAddress);
  console.log("Owner:", deployer.address);
  console.log("\nAdd this address to your frontend configuration:");
  console.log(`NEXT_PUBLIC_MULTISENDER_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
