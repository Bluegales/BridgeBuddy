// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.6.11;

interface IMessageRecipient {
    /**
     * @notice Handle an interchain message
     * @param _origin Domain ID of the chain from which the message came
     * @param _sender Address of the message sender on the origin chain as bytes32
     * @param _body Raw bytes content of message body
     */
    function handle(uint32 _origin, bytes32 _sender, bytes calldata _body) external;
}

interface IMailbox {
    /**
     * @notice Dispatches a message to the destination domain & recipient.
     * @param _destination Domain of destination chain
     * @param _recipient Address of recipient on destination chain as bytes32
     * @param _body Raw bytes content of message body
     * @return bytes32 The message ID inserted into the Mailbox's merkle tree
     */
    function dispatch(uint32 _destination, bytes32 _recipient, bytes calldata _body) external returns (bytes32);
}
