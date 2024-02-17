"use client";

import Loader from "@components/Loader";
import { useSession } from "next-auth/react"
import "@styles/Order.scss"

const Order = () => {
  const { data: session } = useSession()
  const orders = session?.user?.orders

  return !orders? <Loader /> : (
    <>
      <div className="orders">
        <div className="order-detail">
          <h1>訂單</h1>
          <div className="order-list">
            {orders?.map((order, index) => (
              <div className="order" key={index}>
                <div className="order-title">
                  <h4>訂單 ID: {order.id}</h4>
                  <h2>金額: ${order.amountPaid}</h2>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div className="product" key={index}>
                      <div className="product-info">
                        <img src={item.image} alt={item.title}/>
                        <div className="orderItemInfo">
                          <h4>{item.title}</h4>
                          <p>Product ID: {item.productId}</p>
                        </div>
                      </div>

                      <div className="product-info2">
                        <h3>價格: ${item.price}</h3>
                        <p>數量: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Order