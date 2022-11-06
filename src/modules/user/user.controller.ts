import { app } from "./../../app"
import { FastifyReply, FastifyRequest } from "fastify"
import { verifyPassword } from "../../utils/hash"
import { CreateUserInput, LoginRequest } from "./user.schema"
import { createUser, findUserByEmail, findUsers } from "./user.service"

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const user = await createUser(body)

    return reply.code(201).send(user)
  } catch (error) {
    console.log(error)
    return reply.code(500).send(error)
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginRequest
  }>,
  reply: FastifyReply
) {
  const body = request.body

  const user = await findUserByEmail(body.email)

  if (!user) {
    return reply.code(401).send("I refuse to authenticate you.")
  }

  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  })

  if (correctPassword) {
    const { password, salt, ...rest } = user
    // generate access token
    return { accessToken: app.jwt.sign(rest) }
  }

  return reply.code(401).send({
    message: "Invalid email or password",
  })
}

export async function getUsersHandler() {
  const users = await findUsers()

  return users
}
