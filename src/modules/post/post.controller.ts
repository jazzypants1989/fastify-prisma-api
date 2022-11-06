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
  const { title, content } = request.body
  const authorId = request.user.id

  const post = await createPost({ title, content, authorId })

  reply.code(201).send(post)
  console.log(request.body)
}

export async function getPostByIdHandler(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) {
  const { id } = request.params

  const post = await findPostById(id)

  reply.code(200).send(post)
}

export async function getPostsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const posts = await findPosts()

  reply.code(200).send(posts)
}

export async function getPostsByAuthorIdHandler(
  request: FastifyRequest<{ Params: { authorId: number } }>,
  reply: FastifyReply
) {
  const { authorId } = request.params

  const posts = await findPostsByAuthorId(authorId)

  reply.code(200).send(posts)
}

export async function updatePostByIdHandler(
  request: FastifyRequest<{ Params: { id: number }; Body: CreatePostSchema }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { title, content } = request.body

  const post = await updatePostById(id, { title, content })

  reply.code(200).send(post)
}
