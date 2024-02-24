import toast from "react-hot-toast";
import getStripe from "@lib/getStripe";
import { useSession } from "next-auth/react";


export const handleCheckout = async () => {
  const { data: session, update } = useSession();
  const cart = session?.user?.cart;
  const userId = session?.user?._id;

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

export const handleLinePay = async () => {
  const { data: session, update } = useSession();
  const cart = session?.user?.cart;
  const userId = session?.user?._id;
  
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