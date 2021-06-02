import { Request, Response } from "express";
import { omit } from "lodash";
import { createUser } from "../service/user.service";
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

export async function getCurrentUserHandler(req: Request, res: Response) {
  const username = get(req, "user.name");
  const role = get(req, "user.role");
  const email = get(req, "user.email");
  return res.send({ username, role, email });
}
