import { Request, Response } from "express";
import { omit } from "lodash";
import {
  createUser,
  findUser,
  findUserAndUpdate,
} from "../service/user.service";
import log from "../logger";
import { get } from "lodash";

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
