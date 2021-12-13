import React, { Component } from "react";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: "buy",
    };
  }

  renderContent = () => {
    if (this.state.currentForm === "buy")
      return (
        <BuyForm
          onEthChange={this.props.onEthChange}
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          buyTokens={this.props.buyTokens}
        />
      );
    else
      return (
        <SellForm
          onTokenChange={this.props.onTokenChange}
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          sellTokens={this.props.sellTokens}
        />
      );
  };

  render() {
    return (
      <div id="content" className="mt-5">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-light"
            onClick={(e) => this.setState({ currentForm: "buy" })}
          >
            Buy
          </button>
          <span className="text-muted">&lt; {this.state.currentForm} &gt;</span>
          <button
            className="btn btn-light"
            onClick={(e) => this.setState({ currentForm: "sell" })}
          >
            Sell
          </button>
        </div>

        <div className="card mb-4">
          <div className="card-body">{this.renderContent()}</div>
        </div>
      </div>
    );
  }
}

export default Main;
