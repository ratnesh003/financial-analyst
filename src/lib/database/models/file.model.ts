import { Schema, model, models } from "mongoose";

const FileSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    // ⭐ Cloudinary secure URL to the uploaded CSV
    cloudinaryUrls: {
      type: [String],
      required: true,
      default: []
    },

  },
  { timestamps: true }
);

const File = models?.File || model("File", FileSchema);
export default File;
