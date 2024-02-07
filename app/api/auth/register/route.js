import { connectToDB } from "@database/mongodb/database";
import User from "@database/models/User.model";
import { hash } from "bcryptjs";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { username, email, password } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response("User already exists", { status: 400, });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new user", { status: 500, });
  }
};