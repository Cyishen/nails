import Work from "@database/models/Work.model"
import { connectToDB } from "@database/mongodb/database"


export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const work = await Work.findById(params.id).populate("creator");

    if (!work) return new Response("The Work Not Found", { status: 404 });

    return new Response(JSON.stringify(work), { status: 200 });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB()

    const data = await req.formData()

    const creator = data.get("creator")
    const category = data.get("category")
    const title = data.get("title")
    const description = data.get("description")
    const price = data.get("price")
    const photos = data.getAll("workPhotos")

    const workPhotos = []

    for (const photo of photos) {
      if (photo instanceof Object) {
        const bytes = await photo.arrayBuffer()
        const buffer = Buffer.from(bytes)
  
        workPhotos.push({ data: buffer, contentType: photo.type })
      } else {
        workPhotos.push(photo)
      }
    }

    /* Find the existing Work */
    const existingWork = await Work.findById(params.id)

    if (!existingWork) {
      return new Response("The Work Not Found", { status: 404 });
    }

    /* Update the Work with the new data */
    existingWork.category = category
    existingWork.title = title
    existingWork.description = description
    existingWork.price = price
    existingWork.workPhotos = workPhotos

    await existingWork.save()

    return new Response("Successfully updated the Work", { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Error updating the Work", { status: 500 })
  }
}

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB()
    await Work.findByIdAndDelete(params.id)
  
    return new Response("Successfully deleted the Work", { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Error deleting the Work", { status: 500 })
  }
}