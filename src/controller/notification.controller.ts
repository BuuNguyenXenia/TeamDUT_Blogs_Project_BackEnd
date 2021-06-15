import { Request, Response } from "express";
import { get ,omit} from "lodash";
import {getNotification} from "../service/notification.service"

export async function getNotificationHandler(req: Request, res: Response){
    const query = req.query;
    const email = get(req, "user.email");
    const list = await getNotification(query, email);
    return res.send(list);
}