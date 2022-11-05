import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  authorId: z.number(),
})

const postResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  authorId: z.number(),
})

const postListResponseSchema = z.object({
  posts: z.array(postResponseSchema),
})

export type CreatePostSchema = z.infer<typeof createPostSchema>
export type PostResponseSchema = z.infer<typeof postResponseSchema>
export type PostListResponseSchema = z.infer<typeof postListResponseSchema>

export const { schemas: postSchemas, $ref } = buildJsonSchemas(
  {
    createPostSchema,
    postResponseSchema,
    postListResponseSchema,
  },
  { $id: "product" }
)
