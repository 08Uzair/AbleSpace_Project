import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
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

profileSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("Profile", profileSchema);
