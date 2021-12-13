pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
  string public name = "Automated Market Maker";
  Token public token;
  uint public rate;
  uint public totalEth = 1000000000000000000000;
  uint constant public k = 1000000000000000000000 ** 2;

  struct Buyer {
    uint amountBought;
    uint lastPurchaseTime;
  }

  mapping(address => Buyer) buyers;

  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate,
    uint totalEth,
    uint lastPurchaseTime,
    uint amountBought
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

  function buyTokens() public payable{
    // If buyer has bought 90 tokens today, revert the transaction
    if (buyers[msg.sender].amountBought >= 90 && now < (buyers[msg.sender].lastPurchaseTime + 1 days)) revert("You have reached your daily limit!");
    else if (now >= (buyers[msg.sender].lastPurchaseTime + 1 days)) {
      // If 1 day has past, reset the user's amountBought
      buyers[msg.sender].amountBought = 0; 
    } 

    require(buyers[msg.sender].amountBought < 90  && (buyers[msg.sender].amountBought + msg.value /1000000000000000000) <= 90, "Input exceeds your daily limit!");
 
    // Increase ethereum amount from liquidity pool
    totalEth += msg.value;

    // Calculate the number of tokens to buy
    uint tokenToRemain = k / totalEth;
    uint tokenToGive = token.balanceOf(address(this)) - tokenToRemain;

    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenToGive);

    // Transfer tokens to the user
    token.transfer(msg.sender, tokenToGive);
  
    buyers[msg.sender].lastPurchaseTime = now;
    buyers[msg.sender].amountBought += msg.value/ 1000000000000000000;    

    // Emit an event
    emit TokensPurchased(msg.sender, address(token), tokenToGive, rate, totalEth, buyers[msg.sender].lastPurchaseTime, buyers[msg.sender].amountBought);
  }

  function getRate(uint ethAmount) public view returns(uint) {
     if(ethAmount != 0){
      uint tokenToRemain = k / (ethAmount + totalEth);
      uint tokenToGive = token.balanceOf(address(this)) - tokenToRemain;
      
      return tokenToGive;
     }
    return 0;  
  }  

  function getEthRate(uint tokenAmount) public view returns(uint) {
    if(tokenAmount != 0){
    uint ethToRemain = k / (tokenAmount + token.balanceOf(address(this)));
    uint ethToGive = totalEth - ethToRemain;
    
    return ethToGive;
    }
    return 0;  
  }  

  function sellTokens(uint _amount) public {
    token.transferFrom(msg.sender, address(this), _amount);

    // Calculate the number of tokens to buy
    uint ethToRemain = k / token.balanceOf(address(this));
    uint ethToGive = totalEth - ethToRemain;

    // User cannot sell more token than they have
    require(token.balanceOf(msg.sender) >= _amount);

    // Require that EthSwap has enough Ether
    require(totalEth >= ethToGive);

    // Perform sale
    msg.sender.transfer(ethToGive);

    // Decrease ethereum amount from liquidity pool
    totalEth -= ethToGive;

    // Emit an event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }

}
