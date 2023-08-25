import * as luxon from "luxon";
import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import { IRegistry__factory } from "../../typechain";
import { getProvider } from "../../scripts/src/lib/get-provider";
import NetworkConfig, { Network } from "../../network.config";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const HOST = "123";
  const NAME = `ts-hapi-789`;
  const TLD = "web3";

  const _host_ = ethers.utils.toUtf8Bytes(HOST);
  const _name_ = ethers.utils.toUtf8Bytes(NAME);
  const _tld_ = ethers.utils.toUtf8Bytes(TLD);

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
  const tx = await From_Registry["setRecord(bytes,bytes,bytes,uint16)"](_host_, _name_, _tld_, 1000)
  await tx.wait();
  console.log(tx.hash);

}

main().catch((err) => console.error(err));