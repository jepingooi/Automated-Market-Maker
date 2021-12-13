import React, { Component } from "react";
import tokenLogo from "../token-logo.png";
import ethLogo from "../eth-logo.png";

class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
      exchangeRate: 0,
    };
  }

  getTokenAmount = async (etherAmount) => {
    // How much token to give
    const rate = await this.props.onEthChange(etherAmount);
    const convertedRate = rate / 1000000000000000000;

    // 1 Eth = How much token
    const exchangeRate = (
      convertedRate /
      (etherAmount / 1000000000000000000)
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
          let etherAmount;
          etherAmount = this.input.value.toString();
          etherAmount = window.web3.utils.toWei(etherAmount, "Ether");
          this.props.buyTokens(etherAmount);
        }}
      >
        {/* Input balance label */}
        <div>
          <label className="float-left">
            <b>Input</b>
          </label>
          <span className="float-right text-muted">
            Balance: {this.getEthBalance()}
          </span>
        </div>

        {/* Input field */}
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(e) => {
              // const etherAmount = this.input.value.toString();
              let etherAmount;
              etherAmount = this.input.value.toString();

              if (etherAmount > parseFloat(this.getEthBalance())) {
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
                etherAmount !== "" &&
                this.isNumeric(etherAmount) !== false
              ) {
                etherAmount = window.web3.utils.toWei(etherAmount, "Ether");
                this.getTokenAmount(etherAmount);
              } else if (
                etherAmount !== "" &&
                this.isNumeric(etherAmount) === false
              ) {
                this.input.value = "";
                this.setState({ output: 0 });
                window.alert("Only numeric values are allowed!");
              } else {
                etherAmount = 0;
                this.getTokenAmount(etherAmount);
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
              <img src={ethLogo} height="32" alt="" />
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>

        {/* Output balance label */}
        <div>
          <label className="float-left">
            <b>Output</b>
          </label>
          <span className="float-right text-muted">
            Balance: {this.getTokenBalance()}
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
              <img src={tokenLogo} height="32" alt="" />
              &nbsp; GNN
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
                  1 ETH ={" "}
                  {this.input && this.input.value.toString() !== ""
                    ? `${this.state.exchangeRate} GNN`
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

export default BuyForm;
