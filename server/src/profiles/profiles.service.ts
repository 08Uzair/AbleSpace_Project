import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PROFILE_MODEL, Profile, ProfileDocument } from "./profiles.schema";

export interface ProfileUpdateInput {
  email?: string;
  name?: string;
  title?: string;
  username?: string;
  picture?: string;
}

const ALLOWED_UPDATE_FIELDS: (keyof ProfileUpdateInput)[] = [
  "email",
  "name",
  "title",
  "username",
  "picture",
];

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(PROFILE_MODEL)
    private readonly profileModel: Model<ProfileDocument>
  ) {}

  async findOrCreate(me: string): Promise<ProfileDocument> {
    let profile = await this.profileModel.findOne({ ownerId: me }).exec();
    if (!profile) {
      profile = await this.profileModel.create({ ownerId: me });
    }
    return profile;
  }

  async update(me: string, body: ProfileUpdateInput): Promise<ProfileDocument> {
    const update: Record<string, string> = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (body[key] !== undefined) update[key] = String(body[key]);
    }
    return this.profileModel
      .findOneAndUpdate({ ownerId: me }, update, {
        new: true,
        runValidators: true,
        upsert: true,
      })
      .exec();
  }

  async remove(me: string): Promise<{ message: string }> {
    await this.profileModel.findOneAndDelete({ ownerId: me }).exec();
    return { message: "Workspace access removed" };
  }
}
