import { FastifyInstance } from "fastify"
import {
  createPostHandler,
  getPostByIdHandler,
  getPostsByAuthorIdHandler,
  getPostsHandler,
} from "./post.controller"
import { $ref } from "./post.schema"

async function postRoutes(server: FastifyInstance) {
  server.post("/", {
    preHandler: server.authenticate,
    schema: {
      body: $ref("createPostSchema"),
      response: {
        201: $ref("postResponseSchema"),
      },
    },
    handler: createPostHandler,
  })

  server.get("/", {
    schema: {
      response: {
        200: {
          type: "array",
          items: $ref("postResponseSchema"),
        },
      },
    },
    handler: getPostsHandler,
  })

  server.get("/:id", {
    schema: {
      params: $ref("postIdSchema"),
      response: {
        200: $ref("postResponseSchema"),
      },
    },
    handler: getPostByIdHandler,
  })

  server.get("/author/:authorId", {
    schema: {
      params: $ref("postAuthorIdSchema"),
      response: {
        200: {
          type: "array",
          items: $ref("postResponseSchema"),
        },
      },
    },
    handler: getPostsByAuthorIdHandler,
  })
}

export default postRoutes
