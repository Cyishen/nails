"use client";

import { AddCircle, ArrowCircleLeft, Delete, RemoveCircle, ContactlessOutlined, LocalMallOutlined } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import "@styles/Cart.scss";
import getStripe from "@lib/getStripe";
import toast from "react-hot-toast";


const Cart = () => {
  const { data: session, update } = useSession();
  const cart = session?.user?.cart;
  const userId = session?.user?._id;
  const [localCart, setLocalCart] = useState([]);

  // 在頁面加載時從本地存儲中獲取購物車數據
  useEffect(() => {
    const localCartData = JSON.parse(localStorage.getItem('cart')) || [];
    setLocalCart(localCartData);
  }, []);

  // 在用戶登入後更新用戶的購物車數據
  useEffect(() => {
    if (userId && localCart.length > 0) {
      updateCart(mergedCart);
      // 更新用戶購物車後清空本地購物車數據
      setLocalCart([]);
      localStorage.removeItem('cart');
    }
  }, [userId, localCart]);

  // 將本地購物車數據與用戶登錄後的購物車數據合併
  const mergedCart = [...localCart, ...(session?.user?.cart || [])];

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
      console.error('更新購物車數據時出錯：', err);
    }
  };

  /* 計算 */
  const calcSubtotal = (cart) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  let subtotal;
  if (!session) {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    subtotal = calcSubtotal(localCart);
  } else {
    subtotal = calcSubtotal(cart);
  }

  const updateUI = (newCart) => {  
    newCart.forEach((item) => {
      const quantityElement = document.getElementById(`quantity-number-${item.id}`);
      const priceElement = document.getElementById(`price-number-${item.id}`);

      if (quantityElement) {
        quantityElement.textContent = item.quantity;
      }
      if (priceElement) { 
        priceElement.textContent = (`$ ${item.quantity * item.price}`);
      }

      const subtotalElement = document.getElementById('subtotal');
      if (subtotalElement) {
        const newSubtotal = calcSubtotal(newCart);
        subtotalElement.textContent = (`$ ${newSubtotal}`);
      }
    });
  };

  const increaseQty = (cartItem) => {
    if (session) {
      const newCart = cart?.map((item) => {
        if (item === cartItem) {
          item.quantity += 1;
        }
        return item;
      });
      updateCart(newCart);
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const newLocalCart = localCart.map((item) => {
        if (item.id === cartItem.id) {
          item.quantity += 1;
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(newLocalCart));
      updateUI(newLocalCart)
    }
  };

  const decreaseQty = (cartItem) => {
    if (session) {
      const newCart = cart?.map((item) => {
        if (item === cartItem && item.quantity > 1) {
          item.quantity -= 1;
          return item;
        } else return item;
      });
      updateCart(newCart);
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const newLocalCart = localCart.map((item) => {
        if (item.id === cartItem.id && item.quantity > 1) {
          item.quantity -= 1;
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(newLocalCart));
      updateUI(newLocalCart)
    }
  };

  /* 刪除 */
  const removeFromCart = (cartItem) => {
    if (window.confirm('要刪除此商品?')) {
      if (session?.user) {
        removeFromDatabase(cartItem);
      } else {
        removeFromLocalCart(cartItem);
      }
    }
  };
  
  // 從資料庫中刪除商品
  const removeFromDatabase = async (cartItem) => {
    try {
      const newCart = cart.filter((item) => item.id !== cartItem.id);
      await updateCart(newCart);
      toast('移除商品成功!', {
        icon: '🛍️',
      });
    } catch (error) {
      console.error('刪除商品時出錯：', error);
      toast.error('刪除商品失敗!');
    }
  };
  
  // 從本地購物車中刪除商品
  const removeFromLocalCart = (cartItem) => {
    const newLocalCart = localCart.filter((item) => item.id !== cartItem.id);
    setLocalCart(newLocalCart);
    localStorage.setItem('cart', JSON.stringify(newLocalCart));
    toast('移除商品成功!', {
      icon: '🛍️',
    });
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

  const handleLinPay = async () => {
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
              <h1>購物清單</h1>
            </div>

            <h2>
              合計: <span id="subtotal">$ {subtotal}</span>
            </h2>
          </div>

          {mergedCart?.length === 0 && <h4>Empty Cart</h4>}

          {mergedCart?.length > 0 && (
            <div className="all-items">
              {mergedCart?.map((item, index) => (
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
                      <h3 id={`quantity-number-${item.id}`}>{item.quantity}</h3>
                      <RemoveCircle
                        onClick={() => decreaseQty(item)}
                        sx={{ fontSize: "18px", color: "grey", cursor: "pointer", }}
                        className="calculate-hover"
                      />
                    </div>

                    <div className="price">
                      <h2 id={`price-number-${item.id}`}>$ {item.quantity * item.price}</h2>
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

                <div className="bottom-pay">
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={handleLinPay} 
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
