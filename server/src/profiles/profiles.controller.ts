import { Body, Controller, Delete, Get, Put } from "@nestjs/common";
import { OwnerId } from "../common/owner.decorator";
import { ProfilesService, ProfileUpdateInput } from "./profiles.service";

@Controller("profile")
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findOrCreate(@OwnerId() me: string) {
    return this.profilesService.findOrCreate(me);
  }

  @Put()
  update(@OwnerId() me: string, @Body() body: ProfileUpdateInput) {
    return this.profilesService.update(me, body);
  }

  @Delete()
  remove(@OwnerId() me: string) {
    return this.profilesService.remove(me);
  }
}
