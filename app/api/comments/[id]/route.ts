// 댓글 수정, 삭제 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// PUT: 댓글 수정
const updateCommentSchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요."),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    })

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 작성자 본인만 수정 가능
    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "수정 권한이 없습니다." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = updateCommentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: { content: validation.data.content },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    })
  } catch (error) {
    console.error("댓글 수정 에러:", error)
    return NextResponse.json(
      { error: "댓글 수정 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// DELETE: 댓글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    })

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 작성자 본인 또는 관리자만 삭제 가능
    if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "댓글이 삭제되었습니다.",
    })
  } catch (error) {
    console.error("댓글 삭제 에러:", error)
    return NextResponse.json(
      { error: "댓글 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


