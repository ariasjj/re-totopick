// 댓글 작성 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCommentSchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요."),
  postId: z.string(),
  parentId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = createCommentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { content, postId, parentId } = validation.data

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 부모 댓글 확인 (대댓글인 경우)
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })

      if (!parentComment) {
        return NextResponse.json(
          { error: "원댓글을 찾을 수 없습니다." },
          { status: 404 }
        )
      }
    }

    // 댓글 작성 및 포인트 지급
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          postId,
          authorId: session.user.id,
          parentId: parentId || null,
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      })

      // 포인트 지급
      await tx.user.update({
        where: { id: session.user.id },
        data: { points: { increment: 5 } },
      })

      await tx.point.create({
        data: {
          userId: session.user.id,
          amount: 5,
          type: "COMMENT_CREATE",
          description: "댓글 작성",
        },
      })

      return newComment
    })

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error("댓글 작성 에러:", error)
    return NextResponse.json(
      { error: "댓글 작성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


