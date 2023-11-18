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
    const SAFE_ADDRES = '0xea49182d6557F8BD20Fe8c56955b337De404166C'
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
    const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: owner1Signer
    })
    const safeSdk = await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRES })


    const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapter })



    // Any address can be used. In this example you will use vitalik.eth
    const destination = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    const amount = ethers.utils.parseUnits('0.005', 'ether').toString()
    const safeTransactionData: SafeTransactionDataPartial = {
        to: destination,
        data: '0x',
        value: amount
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