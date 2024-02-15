import { Router } from "express";
import { getAllUsers, deleteUser, updateUser, getCurrentUser } from "../controllers/user-controller";
import { isAuthenticated, isOwner } from "../middlewares/authentication -middleware";

export default (router: Router) => {
  router.get("/user", isAuthenticated, getAllUsers);
  router.delete("/user/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/user/:id", isAuthenticated, isOwner, updateUser);
  router.get("/user/current-user", isAuthenticated, getCurrentUser);
}