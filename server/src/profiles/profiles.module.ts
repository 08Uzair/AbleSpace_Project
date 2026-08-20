import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PROFILE_MODEL, ProfileSchema } from "./profiles.schema";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PROFILE_MODEL, schema: ProfileSchema },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
