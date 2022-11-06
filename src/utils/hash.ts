import bcryptjs from "bcryptjs"

export function hashPassword(password: string) {
  const salt = bcryptjs.genSaltSync(10)
  const hash = bcryptjs.hashSync(password, salt)

  return { hash, salt }
}

export function verifyPassword({
  candidatePassword,
  salt,
  hash,
}: {
  candidatePassword: string
  salt: string
  hash: string
}) {
  const candidateHash = bcryptjs.hashSync(candidatePassword, salt)

  return candidateHash === hash
}
