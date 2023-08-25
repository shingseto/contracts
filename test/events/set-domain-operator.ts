import * as luxon from "luxon";
import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import { IRegistry__factory } from "../../typechain";
import { getProvider } from "../../scripts/src/lib/get-provider";
import NetworkConfig, { Network } from "../../network.config";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const NAME = `testing-happy-123`;
  const TLD = "web3";

  const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(NAME));
  const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD));

  const provider = getProvider(Network.GOERLI);

  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contract = await getContracts(signer);

  // const ADDRESS = ethers.constants.AddressZero;
  const ADDRESS = signer.address

  if (!contract.Bridge || !contract.UniversalRegistrarController || !contract.Registry?.Diamond || !contract.PublicResolver) {
    throw new Error();
  }

  const From_Registry = await ethers.getContractAt("IRegistry", contract.Registry.Diamond.address, signer);
  const gasFee = await signer.getFeeData()
  // const tx = await From_Registry["setOperator(bytes32,bytes32,address,bool)"](_name_, _tld_, ethers.constants.AddressZero, true)
  const tx = await From_Registry["setOperator(bytes32,bytes32,address,bool)"](_name_, _tld_, ADDRESS, true)
  await tx.wait();
  console.log(tx.hash);

}

main().catch((err) => console.error(err));