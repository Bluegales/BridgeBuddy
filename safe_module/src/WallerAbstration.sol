// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import {ISafe} from "./interfaces/Safe.sol";
import {IMessageRecipient, IMailbox} from "./interfaces/Hyperlane.sol";
import "forge-std/interfaces/IERC20.sol";

contract WalletAbstractionModule is IMessageRecipient {
    string public constant NAME = "Wallet Abstraction Module";
    string public constant VERSION = "0.1.0";

    bytes32 public constant DOMAIN_SEPARATOR_TYPEHASH =
        keccak256("EIP712Domain(uint256 chainId,address verifyingContract)");

    bytes32 private constant SAFE_OP_TYPEHASH = keccak256(
        "SafeOp(address safe,bytes callData,uint256 nonce,uint256 preVerificationGas,uint256 verificationGasLimit,uint256 callGasLimit,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,address entryPoint)"
    );

    bytes32 public constant ALLOWANCE_TRANSFER_TYPEHASH = keccak256(
        "AllowanceTransfer(address safe,address token,address to,uint96 amount,address paymentToken,uint96 payment,uint16 nonce)"
    );

    mapping(bytes32 => bool) public destination;

    // chain -> this contract
    mapping(uint32 => bytes32) public chainDestination;

    event DispatachedExecution(uint32 destinationChain, bytes data);
    event BridgeFunds(uint32 destinationChain, address recipient, address token, uint256 amount);

    // event RemoveDelegate(address indexed safe, address delegate);

    function addChain(uint32 chain, bytes32 contractAddress) external {
        destination[contractAddress] = true;
        chainDestination[chain] = contractAddress;
    }

    function deleteChain(uint32 chain, bytes32 contractAddress) external {
        delete destination[contractAddress];
        delete chainDestination[chain];
    }

    /// @notice bridges funds + calls handle on remote chain
    /// @param token Token contract address.
    /// @param amount amount in smallest token unit.
    function bridgeExecute(
        address safe,
        uint32 destinationChain,
        address warproute,
        address mailbox,
        bytes calldata body,
        address recipient,
        address token,
        uint256 amount
    ) external {
        bytes memory approveData = abi.encodeWithSignature("approve(address,uint256)", warproute, amount);
        ISafe(safe).execTransactionFromModule(token, 0, approveData, 0);

        bytes memory transferData =
            abi.encodeWithSignature("transferRemote(uint32,bytes32,uint256)", destinationChain, recipient, amount);
        ISafe(safe).execTransactionFromModule(warproute, 0, transferData, 0);
        emit BridgeFunds(destinationChain, recipient, token, amount);

        IMailbox(mailbox).dispatch(destinationChain, chainDestination[destinationChain], body);
        emit DispatachedExecution(destinationChain, body);
    }

    /**
     * @notice Called once funds have been bridged to this chain
     * @param origin Domain ID of the chain from which the message came
     * @param sender Address of the message sender on the origin chain as bytes32
     * @param body Raw bytes content of message body
     */
    function handle(uint32 origin, bytes32 sender, bytes calldata body) external {
        // require(chainDestination[origin] == sender, "sender address not valid");
        handleChainAbstractedCall(body);
    }

    /// @dev restores the data swapped the hypERC20 Tokens and calls the intended function
    function handleChainAbstractedCall(bytes calldata body) internal {
        address safe;
        address contractAddress;
        bytes memory data;
        (safe, contractAddress, data) = abi.decode(body, (address, address, bytes));

        // change hypERC20 into ERC20?

        ISafe(safe).execTransactionFromModule(contractAddress, 0, data, 0);
    }
}
