import mongoose from "mongoose";
import { USER_ROLE } from "../enums/user-roles"

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: USER_ROLE, default: USER_ROLE.USER },
  authentication: {
    password: { type: String, required: true, select: false },
    sessionToken: { type: String, select: false },
  },
  verification: {
    verificationToken: { type: String, select: false },
    isVerified: { type: Boolean, default: false }
  },
  resetPassword: {
    passwordToken: { type: String , select: false},
    expirationDate: { type: Date , select: false},
  }
});

UserSchema.methods.toJSON = function (){
  let obj = this.toObject();
  delete obj.authentication;
  delete obj.verification.verificationToken;
  delete obj.resetPassword;
  return obj;
}
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
  "authentication.sessionToken": sessionToken
})
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values)
  .save()
  .then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findOneAndUpdate({ _id: id }, values)
