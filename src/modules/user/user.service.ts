import prisma from "../../utils/prisma"
import { CreateUserInput } from "./user.schema"
import { hashPassword } from "../../utils/hash"

export async function createUser(input: any) {
  const { password, ...rest } = input
  const { salt, hash } = hashPassword(password)

  const user = await prisma.user.create({
    data: {
      ...rest,
      password: hash,
      salt,
    },
  })

  return user
}
