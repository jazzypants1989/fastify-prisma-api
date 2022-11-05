import fastify, { FastifyRequest, FastifyReply } from "fastify"
import userRoutes from "./modules/user/user.route"
import { userSchemas } from "./modules/user/user.schema"
import { postSchemas } from "./modules/post/post.schema"
import jwt from "@fastify/jwt"
require("dotenv").config()

export const app = fastify()

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: any
  }
}

app.register(jwt, {
  secret: process.env.JWT_SECRET || "Bootyjuice",
}),
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  ),
  app.get("/doesthisthingwork", async () => {
    return { status: "Yeah, duh, you're awesome." }
  })

async function main() {
  for (const schema of [...userSchemas, ...postSchemas]) {
    app.addSchema(schema)
  }

  app.register(userRoutes, { prefix: "api/users" })
  try {
    await app.listen({ port: 1337, host: "0.0.0.0" }, function (err, address) {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(
        `server listening on ${address}, you are so good at figuring things out!`
      )
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
