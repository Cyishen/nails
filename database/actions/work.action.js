'use server'

import Work from "@database/models/Work.model"
import { connectToDB } from "@database/mongodb/database"


export async function getWorkList({}) {
  try {
    await connectToDB()

    const workList = await Work.find()
    .populate({
      path: "creator",
      select: "_id username profileImage"
    })
    .sort({ _id: -1 })
    .slice("workPhotos", [0, 1])

    // console.log("Work List:", workList.length);

    return { data: JSON.parse(JSON.stringify(workList)) }
  } catch (error) {
    console.log(error)
  }
}