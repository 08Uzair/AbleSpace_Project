import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PROJECT_MODEL, ProjectSchema } from "./projects.schema";
import { TASK_MODEL, TaskSchema } from "../tasks/tasks.schema";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PROJECT_MODEL, schema: ProjectSchema },
      { name: TASK_MODEL, schema: TaskSchema },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
