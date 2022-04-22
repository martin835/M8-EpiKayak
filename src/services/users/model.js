import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String },
    surname: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ["host", "guest"], default: "guest" },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
