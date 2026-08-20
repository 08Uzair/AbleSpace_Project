import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "./database/database.module";
import { AppController } from "./app.controller";
import { TASK_MODEL, TaskSchema } from "./tasks/tasks.schema";
import { TasksModule } from "./tasks/tasks.module";
import { ProjectsModule } from "./projects/projects.module";
import { ProfilesModule } from "./profiles/profiles.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    MongooseModule.forFeature([{ name: TASK_MODEL, schema: TaskSchema }]),
    TasksModule,
    ProjectsModule,
    ProfilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
