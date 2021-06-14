import { Request, Response } from "express";
import { findAndUpdate, findPost } from "../service/post.service";
import { createComment } from "../service/comment.service";
import { findUser } from "../service/user.service";
import { concat, get } from "lodash";
import { trigger } from "../utils/pusher.utils";

export async function createCommentHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const username = get(req, "user.name");
  const postId = get(req, "params.postId");
  const email = get(req, "user.email");
  const body = req.body;

  //Find Post
  const post = await findPost({ postId });
  //Check if the post exists or not
  if (!post) {
    return res.sendStatus(404);
  }

  //Create Comment
  const comment = await createComment({
    ...body,
    user: userId,
    post: postId,
    username: username,
  });
  
  //Trigger notification for comment
  const postOwnerId = get(post, "user");
  const postOwner = await findUser({ _id: postOwnerId });
  const emailOwner = get(postOwner, "email");
  if (email != emailOwner) {
    trigger(emailOwner, "my-event", {
      message: `${username} đã bình luận bài viết của bạn`,
      postTitle: post.title,
      postId: postId,
      createdAt: comment.createdAt,
    });
  }

  const counts = get(post, "comments.counts");
  const data = get(post, "comments.data");

  const update = {
    comments: {
      counts: counts + 1,
      data: [...concat(data, comment)],
    },
  };

  const updatePost = await findAndUpdate({ postId }, update, { new: true });

  return res.send(updatePost);
}
