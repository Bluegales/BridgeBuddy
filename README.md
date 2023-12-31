## CREATED FOR ETHGLOBAL ISTANBUL

https://ethglobal.com/showcase/bridgebuddy-36te1

# Project Setup Guide

## General

This project is an EVM-compatible Browser Wallet, designed to enhance user experience by abstracting the complexities associated with managing assets across various EVM-compatible chains. It consolidates assets from different chains in a single interface, enabling seamless asset management. The wallet uses account abstraction to bridge funds automatically as needed for transactions, providing a simplified, unified view of all assets.

Below are the steps to set up the wallet:

### 1. Hyperlane

#### 1.1. Deploy HypERC20 Interchain Tokens

- This wallet employs Hyperlane HypERC20 Tokens for bridging operations.
- You have the option to deploy these tokens using the Hyperlane CLI.
- Alternatively, you can use the tokens that we deployed. Find the addresses of these tokens in `info/tokens.json`.

### 2. Safe Core

For providing a seamless user experience, we've integrated Safe Account Abstraction. This feature allows for complex interchain transactions with a single user authorization.

#### 2.1. Deploy Safe Wallet

- To start, you'll need a Safe Wallet on every chain with which the wallet will interact.
- Wallets can be created through the [Safe Global App](https://app.safe.global/welcome).

#### 2.2. Deploy Custom Module

**Our own deployed modules on goerli, basegoerli, celo and base can be used instead. The addresses can be found in /info/modules.json and /info_mainnet/modules.json**

**If using our modules they only needed to be added to the safes**
- Once the wallets are set up, you need to integrate custom logic into each to enable interchain function calls.
- Our custom module developed during the hackathon is available at `safe_module/src/WalletAbstraction.sol`.
- This module must be manually deployed to each Safe Account on every chain. Afterwards, add it utilising the dev_create_safe/add_module_*.ts files
- Call the function "addRemoteModule" with the chain id of the remote modules and the address of the module on that chain


### 3. Set Up Extension

To use this wallet, you'll need to install it as a Chrome extension.

- Build the extension:
````
cd chromeExtension
npm run build
````
- Enable Chrome Developer Mode to install the extension.


## Deployed Contracts
All deployed contracts can be found in various jsons in the info and info_mainnet folders.
