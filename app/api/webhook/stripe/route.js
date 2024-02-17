import User from '@database/models/User.model';
import { connectToDB } from '@database/mongodb/database';

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

async function getCartItems(line_items) {
  return new Promise(async (resolve, reject) => {
    try {
      const cartItems = await Promise.all(
        line_items?.data?.map(async (item) => {
          const product = await stripe.products.retrieve(item.price.product);
          const productId = product.metadata.productId;

          return {
            productId,
            title: product.name, 
            price: item.price.unit_amount_decimal / 100,
            quantity: item.quantity,
            image: product.images[0],
          };
        })
      );

      resolve(cartItems);
    } catch (error) {
      reject(error);
    }
  });
}


export const POST = async (req, res) => {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("stripe-signature")

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      const line_items = await stripe.checkout.sessions.listLineItems( event.data.object.id )

      const orderItems = await getCartItems(line_items)
      const userId = session.client_reference_id
      const amountPaid = session.amount_total / 100

      const orderData = {
        id: session.payment_intent,
        user: userId,
        orderItems,
        amountPaid
      }

      await connectToDB()
      const user = await User.findById(userId)
      user.cart = []
      user.orders.push(orderData)
      await user.save()

      return new Response(JSON.stringify({ received: true }), { status: 200 })
    }
  } catch (err) {
    console.log(err)
    return new Response("Failed to create order", { status: 500 })
  }
}