import User from "@database/models/User.model"
import Work from "@database/models/Work.model"
import { connectToDB } from "@database/mongodb/database"

export async function POST (req) {
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

    /* Cloudinary URL */
    for (const photo of photos) {
      workPhotos.push(photo);
    }
    /* Node Buffer */
    // for (const photo of photos) {
    //   const bytes = await photo.arrayBuffer()
    //   const buffer = Buffer.from(bytes)
    //   workPhotos.push({ data: buffer, contentType: photo.type })
    // }

    /* Create a new Work */
    const newWork = new Work({
      creator, category, title, description, price, workPhotos
    })

    await newWork.save()

    const user = await User.findById(creator)
    if (user) {
      user.work.push(newWork)
      await user.save()
    }

    return new Response(JSON.stringify(newWork), { status: 200 })
  }
  catch (err) {
    console.log(err)
    return new Response("Failed to create a new Work", { status: 500 })
  }
}
