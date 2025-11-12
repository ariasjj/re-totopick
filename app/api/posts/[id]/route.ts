// 게시글 상세 조회, 수정, 삭제 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET: 게시글 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            role: true,
          },
        },
        board: true,
        comments: {
          where: {
            parentId: null,
            isHidden: false,
          },
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
              },
            },
            replies: {
              where: {
                isHidden: false,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    nickname: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("게시글 조회 에러:", error)
    return NextResponse.json(
      { error: "게시글 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// PUT: 게시글 수정
const updatePostSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
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

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 작성자 본인 또는 관리자만 수정 가능
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "수정 권한이 없습니다." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = updatePostSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: validation.data,
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
      post: updatedPost,
    })
  } catch (error) {
    console.error("게시글 수정 에러:", error)
    return NextResponse.json(
      { error: "게시글 수정 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// DELETE: 게시글 삭제
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

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 작성자 본인 또는 관리자만 삭제 가능
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "게시글이 삭제되었습니다.",
    })
  } catch (error) {
    console.error("게시글 삭제 에러:", error)
    return NextResponse.json(
      { error: "게시글 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


