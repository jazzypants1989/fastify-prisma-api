import prisma from "../../utils/prisma"
import { CreatePostSchema } from "./post.schema"
export async function createPost(
  data: CreatePostSchema & { authorId: number }
) {
  const post = await prisma.post.create({
    data,
  })

  return post
}

export async function findPostById(id: number) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  })

  return post
}

export async function findPosts() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return posts
}

export async function findPostsByAuthorId(authorId: number) {
  const posts = await prisma.post.findMany({
    where: {
      authorId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return posts
}

export async function updatePostById(id: number, data: CreatePostSchema) {
  const post = await prisma.post.update({
    where: {
      id,
    },
    data,
  })

  return post
}

export async function deletePostById(id: number) {
  const post = await prisma.post.delete({
    where: {
      id,
    },
  })

  return post
}

// Path: src\modules\post\post.controller.ts
