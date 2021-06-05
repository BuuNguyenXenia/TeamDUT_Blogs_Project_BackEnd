import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import { findAndUpdate, findPost } from "../service/post.service";
import { includes, concat, remove } from "lodash";

export async function createLikeHandler(req: Request, res: Response) {
  const postId = get(req, "params.postId");
  const username = get(req, "user.name");

  //Find Post
  const post = await findPost({ postId });
  //Check if the post exists or not
  if (!post) {
    return res.sendStatus(404);
  }

  //Check if the user has liked this post?
  const counts = get(post, "likes.counts");
  const data = get(post, "likes.data");
  const hasLiked = includes(data, username);
  //Like
  if (!hasLiked) {
    const update = {
      likes: {
        counts: counts + 1,
        data: concat(data, username),
      },
    };
    const updatePost = await findAndUpdate({ postId }, update, { new: true });

    return res.send(updatePost);
  } else {
    //Unlike
    const update = {
      likes: {
        counts: counts - 1,
        data: remove(data, function (user) {
          return user != username;
        }),
      },
    };
    const updatePost = await findAndUpdate({ postId }, update, { new: true });

    return res.send(updatePost);
  }
}
