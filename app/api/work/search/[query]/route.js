import Work from "@database/models/Work.model"
import { connectToDB } from "@database/mongodb/database"


export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;
    let works = [];

    works = await Work.find({
      $or: [
        { 'category': { $regex: query, $options: "i" } },
        { 'title': { $regex: query, $options: "i" } },
      ]
    }).populate("creator");

    if (!works) return new Response("No works found", { status: 404 });

    return new Response(JSON.stringify(works), { status: 200 });
  } catch (err) {
    console.log(err)
    return new Response("Internal server error", { status: 500 });
  }
};
