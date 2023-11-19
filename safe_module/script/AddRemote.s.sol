// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";

contract AddRemote is Script {
    function run() external {

        WalletAbstractionModule module = WalletAbstractionModule(0x6BB32F9dBcBe0364EA99b8B0fE47b0fFEE0e5Ac0);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        module.addRemoteModule(8453, 0x7127990AC97f9f20fF7A1382A0337508354DB841);
        // module.addRemoteModule(42220, 0x6C235c91E647B5f5c66E280B5ae82F5Abed4086B);
        vm.stopBroadcast();
    }
}