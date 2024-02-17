import Work from "@database/models/Work.model"
import { connectToDB } from "@database/mongodb/database"


export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;
    let works = [];

    // works = await Work.find({
    //   $or: [
    //     { 'category': { $regex: query, $options: "i" } },
    //     { 'title': { $regex: query, $options: "i" } },
    //   ]
    // }).populate("creator");
    works = await Work.aggregate([
      {
        $lookup: {
          from: "users",         //從數據庫的集合users
          localField: "creator", //Work裡面的creator
          foreignField: "_id",   //User裡面的_id
          as: "creator",         //兩個集合儲存於creator
        },
      },
      {
        $unwind: "$creator" // 將as: "creator" 展開文檔
      },
      {
        $match: {
          $or: [
            { 'category': { $regex: query, $options: "i" } },
            { 'title': { $regex: query, $options: "i" } },
            { 'creator.username': { $regex: query, $options: "i" } },
          ]
        },
      },
    ]);

    if (!works) return new Response("No works found", { status: 404 });

    return new Response(JSON.stringify(works), { status: 200 });
  } catch (err) {
    console.log(err)
    return new Response("Internal server error", { status: 500 });
  }
};
