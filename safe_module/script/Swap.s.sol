// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";

contract Swap is Script {
    function run() external {

        WalletAbstractionModule module = WalletAbstractionModule(0xa8373756FFfB218C47Ba2D7848E21a369b92C633);

        uint256 amount = 10;

        bytes memory transferData = abi.encodeWithSignature(
            "swap(address,address,uint256,uint256)",
            0x4982051409D3F7f1C37d9f1e544EF6c6e8557148, // weth
            0x1360c34ae91f3A0ee514FcFf31834901552260f3, // usdc
            amount,
            amount
        );

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        module.bridgeExecute(
            0x39E9a7Edf20e3D6a014bB7dc2e882D319f15dF3E, // safe
            84531,
            0x0fEe1a117d942421886E337ec6c25a6EE7643060,
            0x49cfd6Ef774AcAb14814D699e3F7eE36Fdfba932,
            transferData,
            10000000000000000,
            0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d,
            0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6,
            0x86EBd73E09D41332a0e153D800ebdA27274E3280,
            amount
        );

        vm.stopBroadcast();
    }
}