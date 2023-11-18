// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";
import {ISafe} from "../src/interfaces/Safe.sol";

contract WalletAbstractionModuleTest is Test {
    WalletAbstractionModule public module;

    function setUp() public {
        module = WalletAbstractionModule(0xa8F241ea12F8b739b2CB8342B03D94D019aA7aAc);
        // module = new WalletAbstractionModule();
        // ISafe(0xea49182d6557F8BD20Fe8c56955b337De404166C).enableModule(address(module));
    }

    // function test_enable() public {
    //     // ISafe(0xea49182d6557F8BD20Fe8c56955b337De404166C).getModulesPaginated(address(0x0), 10);
    //     // ISafe(0xea49182d6557F8BD20Fe8c56955b337De404166C).enableModule(address(module));
    // }

    function test_Increment() public {
        module.bridgeExecute(
            0xea49182d6557F8BD20Fe8c56955b337De404166C, // safe
            84531,
            0x0fEe1a117d942421886E337ec6c25a6EE7643060,
            0x49cfd6Ef774AcAb14814D699e3F7eE36Fdfba932,
            "",
            50000000000000000,
            0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d,
            0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6,
            1
        );
    }
}
