import hre, {ethers} from "hardhat";
import {addressList, Icontract} from "./deploy-Setup";
import NetworkConfig, {Network} from "../network.config";
import {BigNumber, Wallet} from "ethers";
import delay from "delay";
import {NETWORKS, OMNI_TLDS} from "../test/helpers/init";
//npx hardhat run scripts/deploy-Register.ts --network fantomTestnet
//npx hardhat run scripts/deploy-Register.ts --network bnbTestnet
async function main() {
    const othersContractAddress = new Map()
    const TLDsingle = "abcdd"
    Object.keys(addressList).filter(name => name != hre.network.name).map(m => {
        othersContractAddress.set(m, addressList[m])
    })
    let currentContractAddress: Icontract = addressList[hre.network.name]

    const getConfig: Record<string, any> = {
        bnbTestnet: NetworkConfig[Network.BNB_CHAIN_TESTNET],
        fantomTestnet: NetworkConfig[Network.FANTOM_TESTNET],
    }
    const provider = new hre.ethers.providers.JsonRpcProvider(
        getConfig[hre.network.name].url, {
            chainId: getConfig[hre.network.name].chainId,
            name: getConfig[hre.network.name].name,
        });

    let walletMnemonic = Wallet.fromMnemonic(process.env.MNEMONIC!)
    walletMnemonic = walletMnemonic.connect(provider)
    const RootFactory = await ethers.getContractFactory("Root", walletMnemonic);
    const root = await RootFactory.attach(currentContractAddress.root)
    const RegistryFactory = await ethers.getContractFactory("Registry", walletMnemonic);
    const registry = await RegistryFactory.attach(currentContractAddress.registry)

    const lzendpoint = await ethers.getContractAt("ILayerZeroEndpoint", currentContractAddress.lzEndpoint)


    const tldsingle = ethers.utils.toUtf8Bytes(TLDsingle);
    console.log(await root.register(tldsingle, currentContractAddress.publicResolver, true, false, {gasLimit: 40000}))


    // for (const TLD of OMNI_TLDS) {
    //     const tld = ethers.utils.toUtf8Bytes(TLD);
    //     const payload_ = await root.populateTransaction.register_SYNC(tld, currentContractAddress.publicResolver, true, true);
    //     const fees = await root.estimateSyncFee(payload_.data!);
    //     console.log(ethers.utils.formatEther(fees));
    //     console.log(NETWORKS[0], " ", await registry.callStatic["exists(bytes32)"](ethers.utils.keccak256(tld)));
    //     console.log(NETWORKS[1], " ", await registry.callStatic["exists(bytes32)"](ethers.utils.keccak256(tld)));
    //     const root_register = await root.register(tld, currentContractAddress.publicResolver, true, true, {
    //         value: fees,
    //         gasLimit: 4000000
    //     });
    //     console.log(JSON.stringify(root_register,null, 2));
    //     // const root_register = await root.register(tld, currentContractAddress.publicResolver, true, true, {gasLimit: 40000});
    //     await root_register.wait();
    //     console.log(`Regisiter: ${TLD}`)
    //     console.log(`root_register tx: ${root_register}`)
    //     await delay(1000);
    //     console.log(NETWORKS[0], " ", await registry["exists(bytes32)"](ethers.utils.keccak256(tld)));
    //     console.log(NETWORKS[1], " ", await registry["exists(bytes32)"](ethers.utils.keccak256(tld)));
    // }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
