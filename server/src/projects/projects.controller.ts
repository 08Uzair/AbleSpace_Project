import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OwnerId } from "../common/owner.decorator";
import { ProjectsService, ProjectUpdateInput } from "./projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@OwnerId() me: string) {
    return this.projectsService.findAll(me);
  }

  @Post()
  create(@OwnerId() me: string, @Body() body: Record<string, unknown>) {
    return this.projectsService.create(me, body);
  }

  @Post("claim-guest")
  claimGuest(@OwnerId() me: string) {
    return this.projectsService.claimGuest(me);
  }

  @Put(":id")
  update(
    @OwnerId() me: string,
    @Param("id") id: string,
    @Body() body: ProjectUpdateInput
  ) {
    return this.projectsService.update(me, id, body);
  }

  @Delete(":id")
  remove(@OwnerId() me: string, @Param("id") id: string) {
    return this.projectsService.remove(me, id);
  }
}
