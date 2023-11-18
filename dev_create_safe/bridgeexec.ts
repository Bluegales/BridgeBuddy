import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import dotenv from 'dotenv'
import SafeApiKit from '@safe-global/api-kit'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import Safe from '@safe-global/protocol-kit'

dotenv.config()

async function main() {

    // const RPC_URL = 'https://alfajores-forno.celo-testnet.org'
    const RPC_URL = 'https://eth-goerli.public.blastapi.io'
    // const RPC_URL = 'https://base-goerli.publicnode.com'
    const SAFE_ADDRES = '0xea49182d6557F8BD20Fe8c56955b337De404166C'
    const MODULE = '0x155235d1F0B6B9D94070909c251E95E0bB8aA975'
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: owner1Signer
    })
    const safeSdk = await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRES })

    const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapter })

    const contractABI = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint32",
              "name": "destinationChain",
              "type": "uint32"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "remoteSafe",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "BridgeFunds",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint32",
              "name": "destinationChain",
              "type": "uint32"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "DispatachedExecution",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "safe",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "HandleChainAbstractedCall",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "ALLOWANCE_TRANSFER_TYPEHASH",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "DOMAIN_SEPARATOR_TYPEHASH",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "NAME",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "VERSION",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "chain",
              "type": "uint32"
            },
            {
              "internalType": "bytes32",
              "name": "contractAddress",
              "type": "bytes32"
            }
          ],
          "name": "addRemoteModule",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "safe",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "destinationChain",
              "type": "uint32"
            },
            {
              "internalType": "address",
              "name": "warproute",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "mailbox",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "body",
              "type": "bytes"
            },
            {
              "internalType": "address",
              "name": "remoteSafe",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "bridgeExecute",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "chain",
              "type": "uint32"
            }
          ],
          "name": "deleteRemoteModule",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "origin",
              "type": "uint32"
            },
            {
              "internalType": "bytes32",
              "name": "sender",
              "type": "bytes32"
            },
            {
              "internalType": "bytes",
              "name": "body",
              "type": "bytes"
            }
          ],
          "name": "handle",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "",
              "type": "uint32"
            }
          ],
          "name": "remoteModuleAddress",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    ;

    const contract = new ethers.Contract(SAFE_ADDRES, contractABI, owner1Signer);

    // const innderData = contract.interface.encodeFunctionData(functionName, functionParams);
    // Data for the function you want to call
    const functionName = 'bridgeExecute';
    
    const functionParams = [
        "0xea49182d6557F8BD20Fe8c56955b337De404166C", // Safe
        "84531", // chainid
        "0x0fEe1a117d942421886E337ec6c25a6EE7643060", // warproute
        "0x49cfd6Ef774AcAb14814D699e3F7eE36Fdfba932", // mailbox
        "0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d", // body
        "0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d", // remoteSafe
        "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // token
        "100" // amount
    ];

    const data = contract.interface.encodeFunctionData(functionName, functionParams);

    // Any address can be used. In this example you will use vitalik.eth
    const safeTransactionData: SafeTransactionDataPartial = {
        to: MODULE,
        data: data,
        value: '0'
    }
    // Create a Safe transaction with the provided parameters
    const safeTransaction2 = await safeSdk.createTransaction({ safeTransactionData })


    // Deterministic hash based on transaction parameters
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction2)

    // Sign transaction to verify that the transaction is coming from owner 1
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash)

    const safeAddress = await safeSdk.getAddress()

    await safeService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction2.data,
        safeTxHash,
        senderAddress: await owner1Signer.getAddress(),
        senderSignature: senderSignature.data,
    })


    const safeTransaction = await safeService.getTransaction(safeTxHash)
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
    const receipt = await executeTxResponse.transactionResponse?.wait()

    console.log('Transaction executed:')
    console.log(`https://goerli.etherscan.io/tx/${receipt?.transactionHash}`)

}

main()