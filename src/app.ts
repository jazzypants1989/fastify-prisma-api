import fastify, { FastifyRequest, FastifyReply } from "fastify"
import userRoutes from "./modules/user/user.route"
import { userSchemas } from "./modules/user/user.schema"
import jwt from "@fastify/jwt"

const app = fastify()

app.register(jwt, {
  secret:
    "c681a15975afbefa5e9772c6d35fbd9c5899c3e5958fce8243ce28c26b1a50bfe108916b6a7e2cceaec6e4e1a7026ff0d1420998bca94d00076bddbc3705c82d",
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
  for (const schema of userSchemas) {
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
