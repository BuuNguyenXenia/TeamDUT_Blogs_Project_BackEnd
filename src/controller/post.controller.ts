import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import {
  findPost,
  createPost,
  deletePost,
  findAndUpdate,
  getManyPost,
} from "../service/post.service";

export async function createPostHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const userRole = get(req, "user.role");

  //Check role
  if (userRole != "admin") {
    return res.status(401).send("Authorization Required"); //role is not admin
    log.error("Authorization Required");
  }
  const body = req.body;

  const post = await createPost({ ...body, user: userId });

  return res.send(post);
}

export async function updatePostHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const postId = get(req, "params.postId");
  const userRole = get(req, "user.role");
  const update = req.body;

  //Check role
  if (userRole != "admin") {
    return res.status(401).send("Authorization Required"); //role is not admin
  }

  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  if (String(post.user) != userId) {
    return res.sendStatus(401);
  }

  const updatePost = await findAndUpdate({ postId }, update, { new: true });

  return res.send(updatePost);
}

export async function getPostHandler(req: Request, res: Response) {
  const postId = get(req, "params.postId");
  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  return res.send(post);
}
export async function getManyPostHandler(req: Request, res: Response) {
  const page = get(req, "query.page");
  const pageNumber = parseInt(page);
  const list = await getManyPost(pageNumber);
  return res.send(list);
  // return res.send(result)
}
export async function deletePostHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const postId = get(req, "params.postId");
  const userRole = get(req, "user.role");

  //Check role
  if (userRole != "admin") {
   
    return res.status(401).send("Authorization Required"); //role is not admin
  }

  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }
  if (String(post.user) != String(userId)) {
    return res.sendStatus(401);
  }

  await deletePost({ postId });

  return res.sendStatus(200);
}
