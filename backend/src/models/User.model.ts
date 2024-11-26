import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
