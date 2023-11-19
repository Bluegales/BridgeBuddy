// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";

contract Swap is Script {
    function run() external {

        WalletAbstractionModule module = WalletAbstractionModule(0x6BB32F9dBcBe0364EA99b8B0fE47b0fFEE0e5Ac0);

        uint256 amount = 1;

        bytes memory transferData = abi.encodeWithSignature(
            "swap(address,address,uint256,uint256)",
            0x4200000000000000000000000000000000000006, // weth
            0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, // usdc
            amount,
            amount
        );

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        module.bridgeExecute(
            0xad197228931e8950b8c355B3E2B2969fdDEb14C2, // safe
            8453,
            0x1A3b70ec8Cc4D348408b35b53Ca8B8af9A3B0Cdd,
            0x50da3B3907A08a24fe4999F4Dcf337E8dC7954bb,
            transferData,
            10000000000000000,
            0x87A161632b9C171de302f96569D4c72e53654BF7,
            0x4200000000000000000000000000000000000006,
            0x02e1f5CBd47e9EE3Da10A5A159849cbbCB4b1ee0,
            amount
        );

        vm.stopBroadcast();
    }
}