import fastify, { FastifyRequest, FastifyReply } from "fastify"
import swagger from "@fastify/swagger"
import swaggerui from "@fastify/swagger-ui"
import { userSchemas } from "./modules/user/user.schema"
import { postSchemas } from "./modules/post/post.schema"
import userRoutes from "./modules/user/user.route"
import jwt from "@fastify/jwt"
import postRoutes from "./modules/post/post.route"
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
  secret: process.env.SUPER_SECRET as string,
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

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Fastify API",
        description:
          "Building a blazing fast REST API with Node.js, PostgreSQL, Fastify and Swagger",
        version: version,
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      servers: [{ url: "http://localhost:1337" }],
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
      security: [{ apiKey: [] }],
    },
  })

  await app.register(swaggerui, {
    routePrefix: "/docs",
    initOAuth: {},
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })

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

  app.ready((err) => {
    if (err) throw err
    app.swagger()
    console.log(app.printRoutes())
  })

  const signals = ["SIGINT", "SIGTERM"]

  for (let i = 0; i < signals.length; i++) {
    process.on(signals[i], () => {
      console.log(`Received ${signals[i]}`)
      process.exit(0)
    })
  }
}

main()
