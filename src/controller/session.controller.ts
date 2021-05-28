import { validatePassword } from "../service/user.service";
import { Request, Response } from "express";
export async function createUserSessionHandle(req: Request, res: Response) {
    //validate the email and password
    const user = await validatePassword(req.body);

    if (!user) {
        return res.status(401).send("Invalid username or password");
    }
    //Create a session

    //Create access token

    //Create refresh token

    //Send refresh and access token back
}
