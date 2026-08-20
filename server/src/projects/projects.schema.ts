import { HydratedDocument, Schema } from "mongoose";

export interface Project {
  ownerId: string;
  name: string;
  desc: string;
  color: string;
  private: boolean;
  priority: "no_priority" | "urgent" | "high" | "medium" | "low";
  dueDate: string;
  id?: string;
}

export type ProjectDocument = HydratedDocument<Project>;

export const PROJECT_MODEL = "Project";

export const ProjectSchema = new Schema<Project>(
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

ProjectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (
    _doc: unknown,
    ret: Project & { _id?: unknown } & { __v?: unknown }
  ) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
});
