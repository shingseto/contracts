/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MigrationController,
  MigrationControllerInterface,
} from "../MigrationController";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "genesisContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "genesisTokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "tld",
        type: "string",
      },
    ],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610270806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063e832e3cd14610030575b600080fd5b61004361003e366004610196565b610045565b005b336040516331a9108f60e11b8152600481018590526001600160a01b0391821691861690636352211e9060240160206040518083038186803b15801561008a57600080fd5b505afa15801561009e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100c29190610216565b6001600160a01b0316146100d557600080fd5b50505050565b6001600160a01b03811681146100f057600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261011a57600080fd5b813567ffffffffffffffff80821115610135576101356100f3565b604051601f8301601f19908116603f0116810190828211818310171561015d5761015d6100f3565b8160405283815286602085880101111561017657600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080608085870312156101ac57600080fd5b84356101b7816100db565b935060208501359250604085013567ffffffffffffffff808211156101db57600080fd5b6101e788838901610109565b935060608701359150808211156101fd57600080fd5b5061020a87828801610109565b91505092959194509250565b60006020828403121561022857600080fd5b8151610233816100db565b939250505056fea264697066735822122002cfa5a06f7db8fb9b426b6804397c495865122c46862a5b2f6a6f3b625d615b64736f6c63430008090033";

export class MigrationController__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MigrationController> {
    return super.deploy(overrides || {}) as Promise<MigrationController>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MigrationController {
    return super.attach(address) as MigrationController;
  }
  connect(signer: Signer): MigrationController__factory {
    return super.connect(signer) as MigrationController__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MigrationControllerInterface {
    return new utils.Interface(_abi) as MigrationControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MigrationController {
    return new Contract(address, _abi, signerOrProvider) as MigrationController;
  }
}