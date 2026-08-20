import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TASK_MODEL, TaskDocument } from "./tasks/tasks.schema";

@Controller("health")
export class AppController {
  constructor(
    @InjectModel(TASK_MODEL) private readonly taskModel: Model<TaskDocument>
  ) {}

  @Get()
  health() {
    return {
      status: "ok",
      db: this.taskModel.db.readyState === 1 ? "connected" : "disconnected",
    };
  }
}
