import { findUser, validatePassword } from "../service/user.service";
import { Request, Response } from "express";
import { get } from "lodash";
import {
  createSession,
  createAccessToken,
  updateSession,
} from "../service/session.service";
import config from "config";
import { sign } from "../untils/jwt.untils";
import log from "../logger";

export async function createUserSessionHandler(req: Request, res: Response) {
  //validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }
  //Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  //Create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  //Create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), //1year
  });

  //Send refresh and access token back
  return res.send({ accessToken, refreshToken });
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");
  const userId = get(req, "user._id");
  await updateSession({ _id: sessionId }, { valid: false });
  const user = await findUser({ _id: userId });
  log.info(`User {email:${user?.email},name:${user?.name}} LOGOUT SUCCESS`);
  return res.sendStatus(200);
}
