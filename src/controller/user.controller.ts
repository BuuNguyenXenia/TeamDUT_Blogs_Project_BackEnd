import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import { omit } from "lodash";
import {
  createUser,
  findUser,
  findUserAndUpdate,
} from "../service/user.service";
import log from "../logger";
import { get } from "lodash";
import User from "../model/user.model";

export async function creatUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    log.error(error);
    return res.status(409).send(error.message);
  }
}
// Get Current User
export async function getCurrentUserHandler(req: Request, res: Response) {
  const username = get(req, "user.name");
  const role = get(req, "user.role");
  const email = get(req, "user.email");
  return res.send({ username, role, email });
}

//Update User

export async function updateUserHandler(req: Request, res: Response) {
  const name = get(req, "params.name");
  const update = req.body;

  //Find User
  const user = await findUser({ name });
  if (!user) {
    return res.sendStatus(401);
  }

  const updateUser = await findUserAndUpdate({ name }, update, { new: true });
  return res.send(updateUser);
}

//Change Password
export async function updatePasswordHandler(req: Request, res: Response) {
  const name = get(req, "params.name");
  const password = get(req, "body.password");
  const newPassword = get(req, "body.newPassword");

  //Find User
  const user = await User.findOne({ name });
  if (!user) {
    return res.sendStatus(401);
  }
  //Check if password is not correct
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(404).send("Old Password is not correct");
  }

  //Hash newPassword then replace
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = bcrypt.hashSync(newPassword, salt);
  const update = {
    password: hash,
  };
  findUserAndUpdate({ name }, update, { new: true });
  return res.status(200).send("Success");
}
