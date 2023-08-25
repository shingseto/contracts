import * as luxon from "luxon";
import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";

// const NAME = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
const NAME = `ts-hapi-789`;
const TLD = "web3";
const EXPIRY = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

async function main() {
  const [signer] = await ethers.getSigners();
  const contracts = await getContracts(signer);
  if (!contracts.UniversalRegistrarController) throw new Error();
  const tx = await contracts.UniversalRegistrarController["register(bytes,bytes,address,uint64)"](ethers.utils.toUtf8Bytes(NAME),ethers.utils.toUtf8Bytes(TLD),signer.address,EXPIRY);
  await tx.wait();
  console.log(tx.hash);

}

main().catch((err) => console.error(err));