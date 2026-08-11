import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    projectId: { type: String, default: "", index: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "doing", "completed", "onhold"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    memberId: { type: String, default: "m1" },
    dueDate: { type: String, default: "" },
    tags: { type: [String], default: [] },
    subtasks: {
      type: [
        {
          id: { type: String, default: "" },
          title: { type: String, default: "" },
          done: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          id: { type: String, default: "" },
          text: { type: String, default: "" },
          author: { type: String, default: "" },
          authorName: { type: String, default: "" },
          authorPicture: { type: String, default: "" },
          createdAt: { type: String, default: "" },
        },
      ],
      default: [],
    },
    resources: {
      type: [
        {
          id: { type: String, default: "" },
          name: { type: String, default: "" },
          url: { type: String, default: "" },
        },
      ],
      default: [],
    },
    locked: { type: Boolean, default: false },
    watchers: {
      type: [
        {
          id: { type: String, default: "" },
          name: { type: String, default: "" },
          picture: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

taskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("Task", taskSchema);
