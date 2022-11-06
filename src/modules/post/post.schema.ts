import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const postInput = {
  title: z.string(),
  content: z.string(),
}

const createPostSchema = z.object({
  ...postInput,
})

const postResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  authorId: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

const postListResponseSchema = z.object({
  posts: z.array(postResponseSchema),
})

const postAuthorIdSchema = z.object({
  authorId: z.number(),
})

const postIdSchema = z.object({
  id: z.number(),
})

export type CreatePostSchema = z.infer<typeof createPostSchema>
export type PostResponseSchema = z.infer<typeof postResponseSchema>
export type PostListResponseSchema = z.infer<typeof postListResponseSchema>
export type PostAuthorIdSchema = z.infer<typeof postAuthorIdSchema>
export type PostIdSchema = z.infer<typeof postIdSchema>

export const { schemas: postSchemas, $ref } = buildJsonSchemas(
  {
    createPostSchema,
    postResponseSchema,
    postListResponseSchema,
    postAuthorIdSchema,
    postIdSchema,
  },
  { $id: "post" }
)
