import { Schema, model, models } from "mongoose"

const WorkSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  category: { type: String, },
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  workPhotos: { type: [{ type: String }], default: [] }
  // workPhotos: [{ data: Buffer, contentType: String }] 
})

const Work = models.Work || model("Work", WorkSchema)

export default Work