import { HydratedDocument, Schema } from "mongoose";

export interface Profile {
  ownerId: string;
  email: string;
  name: string;
  title: string;
  username: string;
  picture: string;
  id?: string;
}

export type ProfileDocument = HydratedDocument<Profile>;

export const PROFILE_MODEL = "Profile";

export const ProfileSchema = new Schema<Profile>(
  {
    ownerId: { type: String, required: true, unique: true, index: true },
    email: { type: String, default: "" },
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
  },
  { timestamps: true }
);

ProfileSchema.set("toJSON", {
  versionKey: false,
  transform: (
    _doc: unknown,
    ret: Profile & { _id?: unknown } & { __v?: unknown }
  ) => {
    ret.id = String(ret._id);
    delete ret._id;
    return ret;
  },
});
