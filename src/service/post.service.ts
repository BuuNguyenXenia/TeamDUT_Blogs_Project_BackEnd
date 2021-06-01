import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Post, { PostDocument } from "../model/post.model";

export function createPost(input: DocumentDefinition<PostDocument>) {
  return Post.create(input);
}

export function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
) {
  return Post.findOne(query, {}, options);
}
export async function getManyPost(page: number) {
  const per_page = 10;
  try {
    const posts = await Post.find()
      .limit(per_page)
      .skip(per_page * (page - 1))
      .sort({ createdAt: -1 });
    const count = await Post.countDocuments();
    const last_page = Math.ceil(count / per_page);
    return { count, last_page, posts };
  } catch (error) {
    console.log(error);
  }
  // return Post.find()
  //   .limit(per_page)
  //   .skip(per_page * (page - 1))
  //   .sort({ createdAt: -1 });
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
