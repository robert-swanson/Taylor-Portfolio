// SPDX-License-Identifier: CC-BY-SA-4.0

// Version of Solidity compiler this program was written for
pragma solidity ^0.6.0;

// Our first contract is a faucet!
contract Faucet {
    // Accept any incoming amount
    receive () external payable {}
    
    // Give out ether to anyone who asks
    function withdraw(uint withdraw_amount) public {

        // Limit withdrawal amount
        require(withdraw_amount <= 100000000000000000);
        require(msg.sender == 0x1823566eE7DF67093Db7DCDFF92855e2f2E6C614);

        // Send the amount to the address that requested it
        msg.sender.transfer(withdraw_amount);
    }
}

