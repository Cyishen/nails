import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req, res) => {
  if (req.method === "POST") {
    const { cart, userId } = await req.json()
    try {
      const params = {
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",

        line_items: cart?.map((item) => {
          return {
            price_data: {
              currency: "TWD",
              product_data: {
                name: item.title,
                images: [item.image],
                metadata: {
                  productId: item.id
                }
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          }
        }),
        client_reference_id: userId,
        mode: "payment",
        success_url: `${req.headers.get("origin")}/order`,
        cancel_url: `${req.headers.get("origin")}/cart`,
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      return new Response(JSON.stringify(session), { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Failed to checkout", { status: 500 });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
