import { FastifyInstance } from "fastify"
import { registerUserHandler } from "./user.controller"
import { $ref } from "./user.schema"

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/register",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("userResponseSchema"),
        },
      },
    },
    registerUserHandler
  )
}

export default userRoutes
