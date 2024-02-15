import { Request, Response } from "express";
import { getUsers, deleteUserById, getUserById } from "../models/user-model";
import { StatusCodes } from "http-status-codes";
import { ReqUser } from "../types";

export const getCurrentUser = async (req: Request & {user: ReqUser}, res: Response) => {
  const { _id } = req.user;
  const user = await getUserById(_id.toString());
  return res
    .status(StatusCodes.OK)
    .json(user)
    .end();
}

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getUsers();

  return res
    .status(StatusCodes.OK)
    .json(users)
    .end();
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedUser = await deleteUserById(id);

  return res
    .status(StatusCodes.OK)
    .json(deletedUser)
    .end();
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.sendStatus(400);
  }

  const user = await getUserById(id);
  user.username = username;
  await user.save();

  return res
    .status(StatusCodes.OK)
    .json(user)
    .end();

}