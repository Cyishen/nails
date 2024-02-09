import Work from "@database/models/Work.model"
import { connectToDB } from "@database/mongodb/database"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { category } = params

    let workList

    if (category !== "全部") {
      workList = await Work.find ({ category }).populate("creator").sort({ _id: -1 })
    } else {
      workList = await Work.find().populate("creator").sort({ _id: -1 })
    }
    // console.log("Work List:", workList);

    return new Response(JSON.stringify(workList), { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Failed to fetch Work List", { status: 500 })
  }
}