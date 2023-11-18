// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";
import {ISafe} from "../src/interfaces/Safe.sol";

contract EnableModule is Script {
    function run() external {

        ISafe safe = ISafe(0x5679eb62776bBbf7f14bCd606b5BB13C2514dFef);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        safe.enableModule(0x6302982c09A0b40b8713f4f951a4Bd401B0b9Ead);
        vm.stopBroadcast();
    }
}