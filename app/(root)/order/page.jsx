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
          <h1>已購買訂單 <span>({orders?.length})</span></h1>
          {orders?.length === 0 && <h4>Empty Order</h4>}

          <div className="order-list">
            {orders?.map((order, index) => (
              <div className="order" key={index}>
                <div className="order-title">
                  <h3>訂單 ID: {order.id}</h3>
                  <h2>總金額: ${order.amountPaid}</h2>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div className="product" key={index}>
                      <div className="product-info">
                        <img src={item?.image} alt="image"/>
                        <div className="orderItemInfo">
                          <h3>{item.title}</h3>
                        </div>
                      </div>

                      <div className="product-info2">
                        <h3>價格: ${item.price}</h3>
                        <p>數量: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                    <hr />
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