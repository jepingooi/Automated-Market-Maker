pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  Token public token;
  uint public rate = 100;
  uint public totalEth = 1000000000000000000000;
  uint constant public k = 1000000000000000000000 ** 2;

  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate,
    uint totalEth
  );

  event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    // Calculate the number of tokens to buy
    uint tokenAmount = msg.value * rate;

    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    // Transfer tokens to the user
    token.transfer(msg.sender, tokenAmount);

    // Increase ethereum amount from liquidity pool
    totalEth += msg.value;
    
    // Emit an event
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate, totalEth);
  }

  function sellTokens(uint _amount) public {
    // User can't sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);

    // Calculate the amount of Ether to redeem
    uint etherAmount = _amount / rate;

    // Require that EthSwap has enough Ether
    require(address(this).balance >= etherAmount);

    // Perform sale
    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);

     // Decrease ethereum amount from liquidity pool
    totalEth -= etherAmount;

    // Emit an event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }

}
