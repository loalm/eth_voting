// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

contract Election {



    address owner;
    bytes32 name;

    string public candidate;

    constructor() public {
        candidate = "Candidate 1";
    }
}