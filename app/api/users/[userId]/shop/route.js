import User from "@database/models/User.model";
import Work from "@database/models/Work.model";
import { connectToDB } from "@database/mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const user = await User.findById(params.userId);
    const workList = await Work.find({ creator: params.userId }).populate("creator");
    // console.log('look workList:',workList);
    user.work = workList;
    await user.save();

    return new Response(JSON.stringify({ user: user, workList: workList }), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch work list by user", { status: 500 })
  }
}