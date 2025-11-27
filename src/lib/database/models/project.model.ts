import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    // ⭐ Files uploaded inside a project
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],

    // ⭐ Auto-generated LLM project prompt (schema-aware)
    projectPrompt: {
      type: String,
    },

    // Optional analytics objects
    // dashboardConfig: {
    //   type: Schema.Types.Mixed,
    //   default: {},
    // },

    // Transformation history (optional)
    // transformations: [
    //   {
    //     before: String,
    //     after: String,
    //     code: String, // Python (pandas) code suggested by LLM
    //     timestamp: { type: Date, default: Date.now },
    //   },
    // ],
  },
  { timestamps: true }
);

const Project = models?.Project || model("Project", ProjectSchema);
export default Project;
