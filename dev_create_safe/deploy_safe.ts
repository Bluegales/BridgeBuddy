import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { SafeFactory } from '@safe-global/protocol-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'

dotenv.config()

async function main() {

    // const RPC_URL = 'https://eth-goerli.public.blastapi.io'
    const RPC_URL = 'https://alfajores-forno.celo-testnet.org'
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

    // Initialize signers
    const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)

    const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: owner1Signer
    })

    const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })


    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })


    const safeAccountConfig: SafeAccountConfig = {
        owners: [
            await owner1Signer.getAddress()
        ],
        threshold: 1,
    }
    const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

    const safeAddress = await safeSdkOwner1.getAddress()

    console.log('Your Safe has been deployed:')
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
    console.log(`https://app.safe.global/gor:${safeAddress}`)
}

main();