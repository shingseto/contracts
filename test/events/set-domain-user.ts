import * as luxon from "luxon";
import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import { IRegistry__factory } from "../../typechain";
import { getProvider } from "../../scripts/src/lib/get-provider";
import NetworkConfig, { Network } from "../../network.config";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {

  const NAME = `ts-hapi-456`;
  const TLD = "web3";
  // const ADDRESS = ethers.constants.AddressZero;
  const ADDRESS = "0xd6c0A36b60273D66F23b6aF5969181218A6929Ea";
  const EXPIRY = luxon.DateTime.now().plus({ hours: 3 }).toSeconds().toFixed().valueOf()

  const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(NAME));
  const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD));
  const _name = ethers.utils.toUtf8Bytes(NAME)
  const _tld = ethers.utils.toUtf8Bytes(TLD)

  const provider = getProvider(Network.GOERLI);

  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contract = await getContracts(signer);

  if (!contract.Bridge || !contract.UniversalRegistrarController || !contract.Registry?.Diamond || !contract.PublicResolver) {
    throw new Error();
  }

  const From_Registry = await ethers.getContractAt("IRegistry", contract.Registry.Diamond.address, signer);
  const From_Wrapper = await ethers.getContractAt("Wrapper", contract.DefaultWrapper!.address, signer);
  const gasFee = await signer.getFeeData()
  // const tx = await From_Registry["setOperator(bytes32,bytes32,address,bool)"](_name_, _tld_, ethers.constants.AddressZero, true)
  // const owner = await From_Registry.callStatic["getOwner(bytes32,bytes32)"](_name_, _tld_);
  // console.log(
  //  { owner,
  //   signer:await signer.getAddress()}
  // )
  const tokenId = await From_Registry.callStatic["getTokenId(bytes,bytes)"](_name, _tld);
  console.log({tokenId})

  console.log({EXPIRY})
  const domainExpiry = await From_Registry.callStatic["getExpiry(bytes32,bytes32)"](_name_, _tld_);
  console.log({domainExpiry});
  const tx = await From_Wrapper.setUser(tokenId, ADDRESS, EXPIRY)
  await tx.wait();
  console.log(tx.hash);

}

main().catch((err) => console.error(err));