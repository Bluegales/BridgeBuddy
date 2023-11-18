// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";

contract AddRemote is Script {
    function run() external {

        WalletAbstractionModule module = WalletAbstractionModule(0xC7e0b08Ab6e6bE8e91d029E78021eE21a4a77CC9);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        module.addRemoteModule(84531, 0x4E059b964778B945E4ae906880974487C907a4c6);

        vm.stopBroadcast();
    }
}