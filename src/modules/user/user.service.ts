import prisma from "../../utils/prisma"
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

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  return user
}

export async function findUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  return user
}

export async function findUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  return users
}
