import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Post, { PostDocument } from "../model/post.model";
import { get } from "lodash";
import Comment from "../model/comment.model";

export function createPost(input: DocumentDefinition<PostDocument>) {
  return Post.create(input);
}

export function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
) {
  return Post.findOne(query, {}, options);
}
export async function getManyPost(query: object) {
  const per_page = parseInt(get(query, "per_page")) || 10;
  const page = parseInt(get(query, "page")) || 1;
  const sort_by = get(query, "sort_by") || "-createdAt";
  const search = get(query, "search") || "";
  let sortMethod;
  let result;
  switch (sort_by) {
    case "-createdAt":
      sortMethod = { createdAt: -1 };
      break;
    case "+createdAt":
      sortMethod = { createdAt: 1 };
      break;
    case "-comments":
      sortMethod = { "comments.counts": -1 };
      break;
    case "+comments":
      sortMethod = { "comments.counts": 1 };
      break;
    case "-likes":
      sortMethod = { likes: -1 };
      break;
    case "+likes":
      sortMethod = { likes: 1 };
      break;
    default:
      break;
  }
  try {
    if (search == "") {
      const posts = await Post.find()
        .limit(per_page)
        .skip(per_page * (page - 1))
        .sort(sortMethod);
      const count = await Post.countDocuments();
      const last_page = Math.ceil(count / per_page);
      return { count, last_page, posts };
    } else {
      const posts = await Post.find({ $text: { $search: search } })
        .limit(per_page)
        .skip(per_page * (page - 1))
        .sort(sortMethod);
      const x = await Post.find({ $text: { $search: search } });
      const count = x.length;
      const last_page = Math.ceil(count / per_page);
      return { count, last_page, posts };
    }
  } catch (error) {
    console.log(error);
  }
}

export function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
) {
  return Post.findOneAndUpdate(query, update, options);
}

export function deletePost(query: FilterQuery<PostDocument>) {
  return Post.deleteOne(query);
}
