import User from "@database/models/User.model";
import Work from "@database/models/Work.model";
import { connectToDB } from "@database/mongodb/database";

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();

    const userId = params.userId;
    const workId = params.workId;

    const user = await User.findById(userId);
    const work = await Work.findById(workId).populate("creator");

    const favoriteWork = user.favorites.find((item) => item._id.toString() === workId)

    if (favoriteWork) {
      user.favorites = user.favorites.filter((item) => item._id.toString() !== workId);
      await user.save()

      return new Response(JSON.stringify({ message: "Work removed from favorites", favorites: user.favorites }), { status: 200 });
    } else {
      // user.favorites.push(work);
      const { username, profileImage } = work.creator; 
      user.favorites.push({ 
        ...work.toObject(),
        creator: { username, profileImage }
      });

      await user.save()

      return new Response(JSON.stringify({ message: "Work added to favorites", favorites: user.favorites }), { status: 200 });
    }
  } catch (err) {
    console.log(err)
    return new Response("Failed to patch work to favorites", { status: 500 })
  }
}
