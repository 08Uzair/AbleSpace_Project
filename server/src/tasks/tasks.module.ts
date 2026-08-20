import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TASK_MODEL, TaskSchema } from "./tasks.schema";
import { PROJECT_MODEL, ProjectSchema } from "../projects/projects.schema";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TASK_MODEL, schema: TaskSchema },
      { name: PROJECT_MODEL, schema: ProjectSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
