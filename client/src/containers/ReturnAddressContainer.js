import React, { Component } from "react";
import { connect } from "react-redux";
import serialize from "form-serialize";
import uuid from "js-uuid";

import ReturnAddress from "../components/ReturnAddress";
import { getCurrentCard } from "../actions/currentCard";
import { addToShoppingCart } from "../actions/shoppingCart";
import { withRouter } from "react-router-dom";

class ReturnAddressContainer extends Component {
  componentDidMount() {
    this.props.getCurrentCard();
  }

  render() {
    return <ReturnAddress {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    card: state.currentCard.data,
    cardMessage: state.cardMessage || state.currentCard.data.default_greeting,
    isAuthenticated: state.user.isAuthenticated,
    currentList: state.currentList.data,
    user: state.user.data,
    signature: state.signature
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getCurrentCard: () => {
      dispatch(getCurrentCard(ownProps.match.params.id));
    },
    onAddToCart: (
      e,
      currentCard,
      currentList,
      cardMessage,
      isAuthenticated,
      signature
    ) => {
      e.preventDefault();
      const form = e.target;
      const data = serialize(form, { hash: true });

      if (isAuthenticated) {
        let cartItem = {
          id: uuid.v4(),
          card: currentCard,
          list: currentList,
          quantity: currentList.count,
          return_address: data,
          user_signature: signature,
          message: cardMessage
        };
        dispatch(addToShoppingCart(cartItem, ownProps.history));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ReturnAddressContainer)
);
