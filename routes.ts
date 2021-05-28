import { Express, Request, Response } from "express";
import { creatUserHandler } from "./src/controller/user.controller";
import validateRequest from "./src/middleware/validateRequest";
import { createUserSchema } from "./src/schema/user.schema";
export default function (app: Express) {
    app.get("/healthCheck", (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    //Register user  POST /api/user
    app.post("/api/users", validateRequest(createUserSchema), creatUserHandler);
    //Login POST /api/sessions
    // app.post(
    //     "/api/sessions",
    //     validateRequest(createUserSessionSchema),
    //     creatUserSessionHandler
    // );
    //Get the user's session GET   /api/sessions

    //Logout DELETE /api/sessions
}
