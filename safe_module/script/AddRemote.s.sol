// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";

contract AddRemote is Script {
    function run() external {

        WalletAbstractionModule module = WalletAbstractionModule(0xa8373756FFfB218C47Ba2D7848E21a369b92C633);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        module.deleteRemoteModule(84531);
        module.addRemoteModule(84531, 0x6302982c09A0b40b8713f4f951a4Bd401B0b9Ead);

        vm.stopBroadcast();
    }
}