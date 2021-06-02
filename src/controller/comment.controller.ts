import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import { findPost } from "../service/post.service";
import { createComment } from "../service/comment.service";

export async function createCommentHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const username = get(req, "user.name");
  const postId = get(req, "params.postId");
  const body = req.body;

  //Find Post
  const post = await findPost({ postId });
  //Check if the post exists or not
  if (!post) {
    return res.sendStatus(404);
  }
  console.log(post);
  
  const comment = await createComment({ ...body, user: userId, post: postId });
  return res.send(comment);
}
