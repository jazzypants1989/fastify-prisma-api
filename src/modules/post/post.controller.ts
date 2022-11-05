import { FastifyReply, FastifyRequest } from "fastify"
import { CreatePostSchema } from "./post.schema"
import {
  createPost,
  findPostById,
  findPosts,
  findPostsByAuthorId,
  updatePostById,
} from "./post.service"

export async function createPostHandler(
  request: FastifyRequest<{ Body: CreatePostSchema }>,
  reply: FastifyReply
) {
  const { title, content, authorId } = request.body
  const post = await createPost({ title, content, authorId })
  reply.status(201).send(post)
  console.log(request.body)
}
