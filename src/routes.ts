import { Express, Request, Response } from "express";
import { creatUserHandler } from "./controller/user.controller";
import { createUserSessionHandler,invalidateUserSessionHandler} from "./controller/session.controller";
import {validateRequest,requiresUser} from "./middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
export default function (app: Express) {
  app.get("/healthCheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  //Register user  POST /api/user
  app.post("/api/users", validateRequest(createUserSchema), creatUserHandler);
  //Login POST /api/sessions
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );
  //Get the user's session GET   /api/sessions

  //Logout DELETE /api/sessions
  app.delete("/api/sessions",requiresUser,invalidateUserSessionHandler)
}
