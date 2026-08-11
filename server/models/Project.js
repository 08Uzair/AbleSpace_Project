import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    color: { type: String, default: "#171717" },
    private: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["no_priority", "urgent", "high", "medium", "low"],
      default: "no_priority",
    },
    dueDate: { type: String, default: "" },
  },
  { timestamps: true }
);

projectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("Project", projectSchema);
