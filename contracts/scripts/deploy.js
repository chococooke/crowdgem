const { ethers } = require("hardhat");

async function main() {
  const CrowdGem = await ethers.getContractFactory("CrowdGem");
  const crowdGem = await CrowdGem.deploy();

  console.log(crowdGem);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});