import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PROJECT_MODEL, Project, ProjectDocument } from "./projects.schema";
import { TASK_MODEL, TaskDocument } from "../tasks/tasks.schema";

export interface ProjectUpdateInput {
  name?: string;
  desc?: string;
  color?: string;
  private?: boolean;
  priority?: string;
  dueDate?: string;
}

const ALLOWED_UPDATE_FIELDS: (keyof ProjectUpdateInput)[] = [
  "name",
  "desc",
  "color",
  "private",
  "priority",
  "dueDate",
];

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(PROJECT_MODEL)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(TASK_MODEL) private readonly taskModel: Model<TaskDocument>
  ) {}

  async findAll(me: string): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ $or: [{ private: false }, { ownerId: me }] })
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(me: string, body: Record<string, unknown>): Promise<ProjectDocument> {
    const name = body.name;
    if (!name || !String(name).trim()) {
      throw new BadRequestException("Project name is required");
    }
    return this.projectModel.create({
      ownerId: me,
      name: String(name).trim(),
      desc: String(body.desc ?? ""),
      color: String(body.color ?? "#171717"),
      private: !!body.private,
      priority: body.priority ?? "no_priority",
      dueDate: String(body.dueDate ?? ""),
    });
  }

  async claimGuest(me: string): Promise<{
    claimed: number;
    projects: number;
    tasks: number;
  }> {
    const projects = await this.projectModel.updateMany(
      { ownerId: "guest" },
      { $set: { ownerId: me } }
    );
    const tasks = await this.taskModel.updateMany(
      { ownerId: "guest" },
      { $set: { ownerId: me } }
    );
    return {
      claimed: projects.modifiedCount + tasks.modifiedCount,
      projects: projects.modifiedCount,
      tasks: tasks.modifiedCount,
    };
  }

  async update(
    me: string,
    id: string,
    body: ProjectUpdateInput
  ): Promise<ProjectDocument> {
    const update: Record<string, unknown> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (update.name !== undefined && !String(update.name).trim()) {
      throw new BadRequestException("Project name is required");
    }
    const project = await this.projectModel
      .findOneAndUpdate({ _id: id, ownerId: me }, update, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async remove(me: string, id: string): Promise<{ message: string }> {
    const project = await this.projectModel
      .findOneAndDelete({ _id: id, ownerId: me })
      .exec();
    if (!project) throw new NotFoundException("Project not found");
    await this.taskModel.deleteMany({ projectId: String(project.id) }).exec();
    return { message: "Project deleted" };
  }
}
