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
    cloudinaryUrl: {
      type: String,
      required: true,
    },

    // Original file size, rows, etc.
    // size: Number,
    // rowCount: Number,

    // // ⭐ Auto-inferred table schema (LLM + pandas profiling)
    // schema: [
    //   {
    //     columnName: String,
    //     inferredType: String,
    //     exampleValue: String,
    //     nullable: Boolean,
    //     distinctValues: Number,
    //   },
    // ],

    // // LLM notes or contextual metadata
    // insights: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

const File = models?.File || model("File", FileSchema);
export default File;
