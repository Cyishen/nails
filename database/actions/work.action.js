'use server'

import User from "@database/models/User.model";
import Work from "@database/models/Work.model"
import { connectToDB } from "@database/mongodb/database"
import { revalidatePath } from "next/cache";

export async function getWorkList({}) {
  try {
    await connectToDB()

    const workList = await Work.find()
    .populate({
      path: "creator",
      model: User,
      select: "_id username profileImage"
    })
    .sort({ _id: -1 })
    .slice("workPhotos", [0, 1])

    // console.log("Work List:", workList.length);
    revalidatePath('/')

    return { data: JSON.parse(JSON.stringify(workList)) }
  } catch (error) {
    console.log(error)
  }
}