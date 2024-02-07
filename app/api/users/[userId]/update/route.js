import User from "@database/models/User.model";
import { connectToDB } from "@database/mongodb/database";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { userId } = params;

    const body = await req.json();
    // console.log(body);

    const { username, profileImage } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        profileImage,
      },
      { new: true }
    );
    // console.log('User?: ',updatedUser);

    if (!updatedUser) {
      return new Response("Failed to update user", { status: 500 });
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(`Failed to update: ${err.message}`, { status: 500 });
  }
};
