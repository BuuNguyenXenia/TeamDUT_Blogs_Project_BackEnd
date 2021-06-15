import { Request, Response } from "express";
import { findAndUpdate, findPost } from "../service/post.service";
import { createComment } from "../service/comment.service";
import { findUser } from "../service/user.service";
import { concat, get, omit } from "lodash";
import { trigger } from "../utils/pusher.utils";
import { createNotification } from "../service/notification.service";

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
  const postTitle = get(post, "title");
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

  await createNotification({
    message: `${username} đã bình luận bài viết của bạn`,
    postTitle: postTitle,
    postId: postId,
    viewed: false,
    ownerEmail: email,
    createdAt: comment.createdAt,
    updatedAt: comment.createdAt,
  });
  const counts = get(post, "comments.counts");
  const data = get(post, "comments.data");

  const update = {
    comments: {
      counts: counts + 1,
      data: [...concat(data, comment)],
    },
  };

  const updatePost = await findAndUpdate({ postId }, update, { new: true });
  if (updatePost) {
    const counts = get(updatePost, "comments.counts");
    const data = get(updatePost, "comments.data");
    for (var i = 0; i < data.length; i++) {
      const userInfo = await findUser({ _id: data[i].user });
      data[i].userInfo = omit(userInfo, [
        "password",
        "createdAt",
        "updatedAt",
        "role",
        "__v",
        "isActive",
      ]);
      delete data[i].username;
      delete data[i].__v;
    }
    updatePost.comments = { counts: counts, data: data };
  }
  return res.send(updatePost);
}
