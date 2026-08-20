import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { OwnerId } from "../common/owner.decorator";
import { TasksService, TaskUpdateInput } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @OwnerId() me: string,
    @Query("projectId") projectId?: string
  ) {
    return this.tasksService.findAll(me, projectId ? String(projectId) : undefined);
  }

  @Post()
  create(@OwnerId() me: string, @Body() body: Record<string, unknown>) {
    return this.tasksService.create(me, body);
  }

  @Put(":id")
  update(
    @OwnerId() me: string,
    @Param("id") id: string,
    @Body() body: TaskUpdateInput
  ) {
    return this.tasksService.update(me, id, body);
  }

  @Delete(":id")
  remove(@OwnerId() me: string, @Param("id") id: string) {
    return this.tasksService.remove(me, id);
  }
}
