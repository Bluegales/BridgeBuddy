// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {WalletAbstractionModule} from "../src/WalletAbstraction.sol";
import {ISafe} from "../src/interfaces/Safe.sol";
import {IERC20} from "../lib/forge-std/src/interfaces/IERC20.sol";

contract WalletAbstractionModuleTest is Test {
    WalletAbstractionModule public module;

    function setUp() public {
        module = WalletAbstractionModule(
            0x6C235c91E647B5f5c66E280B5ae82F5Abed4086B
        );
        // module = new WalletAbstractionModule();
        // module = new WalletAbstractionModule();
        // ISafe(0xea49182d6557F8BD20Fe8c56955b337De404166C).enableModule(address(module));
    }

    // function test_enable() public {
    //     // ISafe(0xea49182d6557F8BD20Fe8c56955b337De404166C).getModulesPaginated(address(0x0), 10);
    //     // ISafe(0xea49182d6557F8BD20Fe8c56955b337De404166C).enableModule(address(module));
    // }

    function test_bridge() public {
        uint256 amount = 1;

        bytes memory transferData = abi.encodeWithSignature(
            "swap(address,address,uint256,uint256)",
            0x4200000000000000000000000000000000000006, // weth
            0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, // usdc
            amount,
            amount
        );

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
    }

    // function test_recieve() public {
    //     // bytes memory innerBody = abi.encodeWithSignature(
    //     //     "transfer(address,uint256)",
    //     //     0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d,
    //     //     10
    //     // );

    //     uint256 val = IERC20(0x1360c34ae91f3A0ee514FcFf31834901552260f3).balanceOf(0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d);
    //     assertEq(val, 10000);

    //     bytes memory innerBody = abi.encodeWithSignature(
    //         "swap(address,address,uint256,uint256)",
    //         0x4982051409D3F7f1C37d9f1e544EF6c6e8557148, // weth
    //         0x1360c34ae91f3A0ee514FcFf31834901552260f3, // usdc
    //         10,
    //         10
    //     );

    //     // bytes memory innerBody = abi.encodeWithSignature(
    //     //     "approve(address)",
    //     //     0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d
    //     // );

    //     address remoteSafe = 0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d;
    //     address remoteToken = 0x86EBd73E09D41332a0e153D800ebdA27274E3280;

    //     bytes memory mailboxData = abi.encode(remoteSafe, remoteToken, innerBody);

    //     module.handle(1337, bytes32(uint256(uint160(0xea49182d6557F8BD20Fe8c56955b337De404166C))), mailboxData);

    //     assertEq(val, 10000);
    // }
}
