const Token = artifacts.require("Token");
const TokenSwap = artifacts.require("TokenSwap");

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed();

  // Deploy TokenSwap
  await deployer.deploy(TokenSwap, token.address);
  const tokenSwap = await TokenSwap.deployed();

  // Transfer all tokens to EthSwap (1 million)
  await token.transfer(tokenSwap.address, "1000000000000000000000000");
};
