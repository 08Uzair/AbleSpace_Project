import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, FilterQuery } from "mongoose";
import { TASK_MODEL, Task, TaskDocument } from "./tasks.schema";
import { PROJECT_MODEL, ProjectDocument } from "../projects/projects.schema";

export interface TaskUpdateInput {
  title?: string;
  desc?: string;
  status?: string;
  priority?: string;
  memberId?: string;
  projectId?: string;
  dueDate?: string;
  tags?: string[];
  subtasks?: unknown[];
  comments?: unknown[];
  resources?: unknown[];
  locked?: boolean;
  watchers?: unknown[];
}

const ALLOWED_UPDATE_FIELDS: (keyof TaskUpdateInput)[] = [
  "title",
  "desc",
  "status",
  "priority",
  "memberId",
  "projectId",
  "dueDate",
  "tags",
  "subtasks",
  "comments",
  "resources",
  "locked",
  "watchers",
];

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(TASK_MODEL) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(PROJECT_MODEL)
    private readonly projectModel: Model<ProjectDocument>
  ) {}

  async findAll(me: string, projectId?: string): Promise<TaskDocument[]> {
    const privateProjectIds = (
      await this.projectModel
        .find({ private: true, ownerId: { $ne: me } })
        .distinct("_id")
    ).map(String);
    const and: FilterQuery<TaskDocument>[] = [
      {
        $or: [
          { locked: false, projectId: { $nin: privateProjectIds } },
          { ownerId: me },
        ],
      },
    ];
    if (projectId) and.push({ projectId });
    return this.taskModel.find({ $and: and }).sort({ createdAt: 1 }).exec();
  }

  async create(me: string, body: Record<string, unknown>): Promise<TaskDocument> {
    const title = body.title;
    if (!title || !String(title).trim()) {
      throw new BadRequestException("Title is required");
    }
    return this.taskModel.create({
      ownerId: me,
      title: String(title).trim(),
      desc: String(body.desc ?? ""),
      status: body.status ?? "todo",
      priority: body.priority ?? "Medium",
      memberId: body.memberId ?? "m1",
      projectId: String(body.projectId ?? ""),
      dueDate: body.dueDate ?? "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      subtasks: Array.isArray(body.subtasks) ? body.subtasks : [],
      comments: Array.isArray(body.comments) ? body.comments : [],
      resources: Array.isArray(body.resources) ? body.resources : [],
      locked: !!body.locked,
      watchers: Array.isArray(body.watchers) ? body.watchers : [],
    });
  }

  async update(
    me: string,
    id: string,
    body: TaskUpdateInput
  ): Promise<TaskDocument> {
    const update: Record<string, unknown> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (update.title !== undefined && !String(update.title).trim()) {
      throw new BadRequestException("Title is required");
    }
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, ownerId: me }, update, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async remove(me: string, id: string): Promise<{ message: string }> {
    const task = await this.taskModel
      .findOneAndDelete({ _id: id, ownerId: me })
      .exec();
    if (!task) throw new NotFoundException("Task not found");
    return { message: "Task deleted" };
  }
}
