import User from "@database/models/User.model";
import { connectToDB } from "@database/mongodb/database";

export const POST = async (req, { params }) => {
  try {

    const { cart } = await req.json()
    await connectToDB()

    const userId = params.userId
    const user = await User.findById(userId)

    user.cart = cart
    await user.save()

    return new Response(JSON.stringify(user.cart), { status: 200 })
   } catch (err) {
    console.log(err)
    return new Response("Failed to update card", { status: 500 })
   }
}

