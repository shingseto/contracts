import * as luxon from "luxon";
import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";

const NAME = `testing-sleepy-999`;
const TLD = "web3";
const ADD_TIME = 86400;

async function main() {
  const [signer] = await ethers.getSigners();
  const contracts = await getContracts(signer);
  if (!contracts.UniversalRegistrarController) throw new Error();
  const tx = await contracts.UniversalRegistrarController["renew(bytes,bytes,uint64)"](ethers.utils.toUtf8Bytes(NAME),ethers.utils.toUtf8Bytes(TLD),ADD_TIME);
  await tx.wait();
  console.log(tx.hash);
  console.log(ADD_TIME);

}

main().catch((err) => console.error(err));