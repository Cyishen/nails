import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto-js';

export const POST = async (req, res) => {
  if (req.method === 'POST') {
    const { cart, userId } = await req.json()

    const nonce = uuidv4();
    const uri = '/v3/payments/request';

    const channelSecret = process.env.LINEPAY_CHANNEL_SECRET_KEY
    const channelId = process.env.LINEPAY_CHANNEL_ID

    const totalAmount = Number(cart?.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0));

    const body = {
      amount: totalAmount,
      currency: 'TWD',
      orderId: `order${Date.now()}`, 
      packages: [
        {
          id: `package${Date.now()}`,
          amount: totalAmount,
          products: cart?.map(item => ({
            name: item.title,
            quantity: item.quantity,
            price: item.price,
            imageUrl: item.image,
          })),
        },
      ],
      redirectUrls: {
        confirmUrl: `${req.headers.get("origin")}/order`,
        cancelUrl: `${req.headers.get("origin")}/cart`,
      },
    };

    const encrypt = crypto.HmacSHA256(
      channelSecret + uri + JSON.stringify(body) + nonce,
      channelSecret
    );
    const hmacBase64 = crypto.enc.Base64.stringify(encrypt);

    const configs = {
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': channelId,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': hmacBase64,
      },
    };

    try {
      const response = await axios.post(
        'https://sandbox-api-pay.line.me/v3/payments/request',
        body,
        configs
      );
      // console.log(response)
      return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Failed to checkout with LINE Pay", { status: 500 });
    }

  } else {
    return new Response("Method Not Allowed", { status: 405 });
  }
}