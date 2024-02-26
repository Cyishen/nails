"use client";

import { AddCircle, ArrowCircleLeft, Delete, RemoveCircle, ContactlessOutlined, LocalMallOutlined } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useSession } from "next-auth/react";
import "@styles/Cart.scss";
import getStripe from "@lib/getStripe";
import toast from "react-hot-toast";
import { useCartStore } from '@lib/store';
import { useEffect } from "react";

const Cart = () => {
  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  const { products, totalPrice, increaseQty, decreaseQty, removeFromCartStore } = useCartStore();
  const cart = userId ? session?.user?.cart : products;
  // console.log('無用戶登入時添加的商品A:',products)
  useEffect(() => {
    useCartStore.persist.rehydrate()
  },[session, products])

  const updateCart = async (cart) => {
    try {
      const response = await fetch(`/api/users/${userId}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });
      const data = await response.json();
      update({ user: { cart: data } });

    } catch (err) {
      console.error('更新購物數據時出錯：', err);
    }
  };

  useEffect(() => {
    if (userId && products.length > 0) {
      const mergedCart = mergeCarts(cart, products);
      updateCart(mergedCart);

      useCartStore.setState({
        products: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }
  }, [userId, products]);

  const mergeCarts = (oldCart, newCart) => {
    const mergedCart = [...oldCart];
  
    newCart.forEach(newItem => {
      const existingItemIndex = mergedCart.findIndex(oldItem => oldItem.id === newItem.id);
      if (existingItemIndex !== -1) {
        return;
      }
      mergedCart.push(newItem);
    });
  
    return mergedCart;
  }

  /* 計算 */
  const calcSubtotal = (cart) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const subtotal = calcSubtotal(cart);

  /* 加減 */
  const increaseQtySelect = (cartItem) => {
    if (userId) {
      increaseQtyDB(cartItem);
    } else {
      increaseQty(cartItem);
    }
  }

  const increaseQtyDB = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem) {
        item.quantity += 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const decreaseQtySelect = (cartItem) => {
    if (userId) {
      decreaseQtyDB(cartItem);
    } else {
      decreaseQty(cartItem);
    }
  }

  const decreaseQtyDB= (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem && item.quantity > 1) {
        item.quantity -= 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const removeSelect = (cartItem) => {
    if (userId) {
      removeFromDB(cartItem);
    } else {
      removeFromCartStore(cartItem);
    }
  };

  const removeFromDB = (cartItem) => {
    if (window.confirm('移除此商品 🛍️？')) {
        const newCart = cart.filter((item) => item.id !== cartItem.id);
        toast('移除商品成功!', {
          icon: '🛍️',
        });
        updateCart(newCart);
    }
  };

  /* CHECKOUT */
  const handleCheckout = async () => {
    if (!session) {
      toast.error("請先登入");
      return;
    }
  
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

  const handleLinePay = async () => {
    if (!session) {
      toast.error("請先登入");
      return;
    }
    try {
      const response = await fetch("/api/line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart, userId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
  
      const data = await response.json();

      if (data.error) {
        console.log(data.error.message);
        toast.error("Something went wrong");
      } else {
        const url = data.info.paymentUrl.web;
        window.location.href = url;
        // console.log("Line Pay success:", data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div id="cart" className="cart">
        <div className="details">
          <div className="top">
            <div className="top-cart-tittle">
              <p><LocalMallOutlined /></p>
              <h1>購物籃</h1>
            </div>

            <h2>
              合計: <span>{ userId ? subtotal : totalPrice }</span>
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
                      <p>設計師: {item.creator?.username}</p>
                    </div>
                  </div>

                  <div className="item-cost">
                    <div className="quantity">
                      <AddCircle
                        onClick={() => increaseQtySelect(item)}
                        sx={{ fontSize: "18px", color: "grey", cursor: "pointer", }}
                        className="calculate-hover"
                      />
                      <h3>{item.quantity}</h3>
                      <RemoveCircle
                        onClick={() => decreaseQtySelect(item)} 
                        sx={{ fontSize: "18px", color: "grey", cursor: "pointer", }}
                        className="calculate-hover"
                      />
                    </div>

                    <div className="price">
                        <h2>$ {item.price * item.quantity}</h2>
                        <p>${item.price} / each</p>
                    </div>

                    <div className="remove">
                      <IconButton
                      type="button"
                      aria-label="remove"
                      size="small"
                      color="error"  
                      onClick={() => removeSelect(item)}
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

                <div className="bottom-pay">
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={handleLinePay} 
                  >
                    <img src="/assets/line-pay.svg" width={60}/>
                  </Button>
                  
                  <Button
                    variant="outlined"
                    endIcon={<ContactlessOutlined />}
                    onClick={handleCheckout} 
                  >
                    <img src="/assets/stripe.svg" width={40}/>
                    付款
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
