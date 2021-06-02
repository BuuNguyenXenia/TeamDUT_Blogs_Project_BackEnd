import { Express, Request, Response } from "express";
import { creatUserHandler,getCurrentUserHandler } from "./controller/user.controller";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionHandler,
} from "./controller/session.controller";
import { validateRequest, requiresUser } from "./middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "./schema/post.schema";
import { createCommentSchema } from "./schema/comment.schema";
import { createCommentHandler } from "./controller/comment.controller";
import {
  createPostHandler,
  getPostHandler,
  getManyPostHandler,
  updatePostHandler,
  deletePostHandler,
} from "./controller/post.controller";
export default function (app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.sendStatus(200);
  });
  app.get("/healthCheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  //Register user  POST /api/user
  app.post("/api/users", validateRequest(createUserSchema), creatUserHandler);


  //Get current User GET /api/users
  app.get("/api/users", requiresUser, getCurrentUserHandler);

  //Login POST /api/sessions
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );
  //Get the user's session GET   /api/sessions
  app.get("/api/sessions", requiresUser, getUserSessionHandler);

  //Logout DELETE /api/sessions
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  //Create a post
  app.post(
    "/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  //Update a post
  app.put(
    "/api/posts/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );
  //Get a post
  app.get("/api/posts/:postId", getPostHandler);

  //Get many post
  app.get("/api/posts", getManyPostHandler);
  //Delete a post
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );

  // Create a Comment in a post
  app.post(
    "/api/posts/:postId",
    [requiresUser, validateRequest(createCommentSchema)],
    createCommentHandler
  );
}
