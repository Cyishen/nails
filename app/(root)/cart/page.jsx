"use client";

import { AddCircle, ArrowCircleLeft, Delete, RemoveCircle, } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useSession } from "next-auth/react";
import Loader from "@components/Loader";
import "@styles/Cart.scss";

import getStripe from "@lib/getStripe";
import toast from "react-hot-toast";

const Cart = () => {
  const { data: session, update } = useSession();
  const cart = session?.user?.cart;
  const userId = session?.user?._id;

  const updateCart = async (cart) => {
    const response = await fetch(`/api/users/${userId}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });
    const data = await response.json();
    update({ user: { cart: data } });
  };

  //CALC ALL ITEMS
  const calcSubtotal = (cart) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const increaseQty = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem) {
        item.quantity += 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const decreaseQty = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem && item.quantity > 1) {
        item.quantity -= 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const removeFromCart = (cartItem) => {
    if (window.confirm('Are you sure you want to remove')) {
        const newCart = cart.filter((item) => item.id !== cartItem.id);
        updateCart(newCart);
    }
};

  const subtotal = calcSubtotal(cart);

  //CHECKOUT
  const handleCheckout = async () => {
    const stripe = await getStripe()

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, userId }),
    })

    if (response.statusCode === 500) {
      return
    }

    const data = await response.json()

    toast.loading("Redirecting to checkout...")

    const result = stripe.redirectToCheckout({ sessionId: data.id })

    if (result.error) {
      console.log(result.error.message)
      toast.error("Something went wrong")
    }
  }

  return !session?.user?.cart ? <Loader /> : (
    <>
      <div className="cart">
        <div className="details">
          <div className="top">
            <h1>購物籃</h1>
            <h2>
              合計: <span>${subtotal}</span>
            </h2>
          </div>

          {cart?.length === 0 && <h4>Empty Cart</h4>}

          {cart?.length > 0 && (
            <div className="all-items">
              {cart?.map((item, index) => (
                <div className="item" key={index}>
                  <div className="item_info">
                    <img src={item.image} alt="product" />
                    <div className="text">
                      <h3>{item.title}</h3>
                      <p>類別: {item.category}</p>
                      <p>設計師: {item.creator.username}</p>
                    </div>
                  </div>

                  <div className="item-cost">
                    <div className="quantity">
                      <AddCircle
                        onClick={() => increaseQty(item)}
                        sx={{ fontSize: "18px", color: "grey", cursor: "pointer", }}
                        className="calculate-hover"
                      />
                      <h3>{item.quantity}</h3>
                      <RemoveCircle
                        onClick={() => decreaseQty(item)}
                        sx={{ fontSize: "18px", color: "grey", cursor: "pointer", }}
                        className="calculate-hover"
                      />
                    </div>

                    <div className="price">
                      <h2>${item.quantity * item.price}</h2>
                      <p>${item.price} / each</p>
                    </div>

                    <div className="remove">
                      <IconButton
                      type="button"
                      aria-label="remove"
                      size="small"
                      color="error"  
                      onClick={() => removeFromCart(item)}
                      >
                        <Delete sx={{ color: 'red' }}/>
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bottom">
                <a href="/">
                  <ArrowCircleLeft /> 再逛一下
                </a>
                <Button
                  variant="outlined"
                  endIcon={<Delete />}
                  onClick={handleCheckout} 
                >
                  付款 Pay
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
