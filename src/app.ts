import fastify, { FastifyRequest, FastifyReply } from "fastify"
import swagger from "@fastify/swagger"
import { $ref, userSchemas } from "./modules/user/user.schema"
import { postSchemas } from "./modules/post/post.schema"
import userRoutes from "./modules/user/user.route"
import jwt from "@fastify/jwt"
import postRoutes from "./modules/post/post.route"
import { buildJsonSchemas, register, withRefResolver } from "fastify-zod"
import { version } from "../package.json"
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
  )

async function main() {
  for (const schema of [...userSchemas, ...postSchemas]) {
    app.addSchema(schema)
  }

  app.register(userRoutes, { prefix: "api/users" })
  app.register(postRoutes, { prefix: "api/posts" })
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

  app.register(
    swagger,
    withRefResolver({
      routePrefix: "/documentation",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "Fastify API",
          description: "Building a blazing fast REST API with Fastify",
          version,
        },
      },
    })
  )

  app.ready((err) => {
    if (err) throw err
    app.swagger()
    console.log(app.printRoutes())
  })
}

main()
