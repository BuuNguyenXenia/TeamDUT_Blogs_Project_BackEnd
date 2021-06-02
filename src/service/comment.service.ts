import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Comment, { CommentDocument } from "../model/comment.model";


export function createComment(input: DocumentDefinition<CommentDocument>) {
  return Comment.create(input);
}
