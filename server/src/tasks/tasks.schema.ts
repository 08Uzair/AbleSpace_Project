import { HydratedDocument, Schema } from "mongoose";

export interface TaskSubtask {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskComment {
  id: string;
  text: string;
  author: string;
  authorName: string;
  authorPicture: string;
  createdAt: string;
}

export interface TaskResource {
  id: string;
  name: string;
  url: string;
}

export interface TaskWatcher {
  id: string;
  name: string;
  picture: string;
}

export interface Task {
  ownerId: string;
  projectId: string;
  title: string;
  desc: string;
  status: "todo" | "doing" | "completed" | "onhold";
  priority: "High" | "Medium" | "Low";
  memberId: string;
  dueDate: string;
  tags: string[];
  subtasks: TaskSubtask[];
  comments: TaskComment[];
  resources: TaskResource[];
  locked: boolean;
  watchers: TaskWatcher[];
  id?: string;
}

export type TaskDocument = HydratedDocument<Task>;

export const TASK_MODEL = "Task";

export const TaskSchema = new Schema<Task>(
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

TaskSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (
    _doc: unknown,
    ret: Task & { _id?: unknown } & { __v?: unknown }
  ) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
});
