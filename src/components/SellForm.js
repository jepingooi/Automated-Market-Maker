import React, { Component } from "react";
import tokenLogo from "../token-logo.png";
import ethLogo from "../eth-logo.png";

class SellForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
    };
  }

  getEthAmount = async (tokenAmount) => {
    // How much token to give
    const rate = await this.props.onTokenChange(tokenAmount);
    const convertedRate = rate / 1000000000000000000;

    // 1 Token = How much Eth
    const exchangeRate = (
      convertedRate /
      (tokenAmount / 1000000000000000000)
    ).toFixed(4);
    this.setState({
      exchangeRate,
      output: parseFloat(convertedRate.toString()).toFixed(4),
    });
  };

  // Get user's token balance
  getTokenBalance = () => {
    const balance = window.web3.utils.fromWei(this.props.tokenBalance, "Ether");
    return parseFloat(balance).toFixed(4);
  };

  // Get user's eth balance
  getEthBalance = () => {
    const balance = window.web3.utils.fromWei(this.props.ethBalance, "Ether");
    return parseFloat(balance).toFixed(4);
  };

  isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  };

  render() {
    return (
      <form
        className="mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          let tokenAmount;
          tokenAmount = this.input.value.toString();
          tokenAmount = window.web3.utils.toWei(tokenAmount, "Ether");
          this.props.sellTokens(tokenAmount);
        }}
      >
        {/* Input balance label */}
        <div>
          <label className="float-left">
            <b>Input</b>
          </label>
          <span className="float-right text-muted">
            Balance: {this.getTokenBalance()}
          </span>
        </div>

        {/* Input field */}
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(e) => {
              // const etherAmount = this.input.value.toString();
              let tokenAmount;
              tokenAmount = this.input.value.toString();

              if (tokenAmount > parseFloat(this.getTokenBalance())) {
                this.input.value = "";
                this.setState({ output: 0 });
                window.alert(
                  `Input cannot exceed your account balance! (${this.getEthBalance()})`
                );
              } else if (parseInt(this.input.value.toString()) > 90) {
                this.input.value = "";
                this.setState({ output: 0 });
                window.alert("You cannot purchase more than 90 tokens!");
              } else if (
                tokenAmount !== "" &&
                this.isNumeric(tokenAmount) !== false
              ) {
                tokenAmount = window.web3.utils.toWei(tokenAmount, "Ether");
                this.getEthAmount(tokenAmount);
              } else if (
                tokenAmount !== "" &&
                this.isNumeric(tokenAmount) === false
              ) {
                this.input.value = "";
                this.setState({ output: 0 });
                window.alert("Only numeric values are allowed!");
              } else {
                tokenAmount = 0;
                this.getEthAmount(tokenAmount);
              }
            }}
            ref={(input) => {
              this.input = input;
            }}
            className="form-control form-control-lg"
            placeholder="0"
            required
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height="32" alt="" />
              &nbsp; GNN
            </div>
          </div>
        </div>

        {/* Output balance label */}
        <div>
          <label className="float-left">
            <b>Output</b>
          </label>
          <span className="float-right text-muted">
            Balance: {this.getEthBalance()}
          </span>
        </div>

        {/* Output field */}
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height="32" alt="" />
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>

        {/* Current exchange rate label */}
        <div className="mb-5">
          {this.input &&
            this.input.value.toString() !== "" &&
            this.input.value > 0 && (
              <>
                <span className="float-left text-muted">Exchange Rate</span>
                <span className="float-right text-muted">
                  1 GNN ={" "}
                  {this.input && this.input.value.toString() !== ""
                    ? `${this.state.exchangeRate} ETH`
                    : ""}
                </span>
              </>
            )}
        </div>

        {/* Swap button */}
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          SWAP!
        </button>
      </form>
    );
  }
}

export default SellForm;
