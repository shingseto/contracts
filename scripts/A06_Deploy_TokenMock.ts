import { ethers } from "hardhat";

import { deployTokenMock } from "./src/deploy";
import { getContracts } from "./src/lib/get-contracts";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await deployTokenMock({ chainId, signer, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});