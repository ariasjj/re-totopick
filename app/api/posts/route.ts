// 게시글 목록 조회 및 생성 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET: 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardType = searchParams.get("board")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    if (!boardType) {
      return NextResponse.json(
        { error: "게시판 타입이 필요합니다." },
        { status: 400 }
      )
    }

    // 게시판 조회
    const board = await prisma.board.findFirst({
      where: { type: boardType as any },
    })

    if (!board) {
      return NextResponse.json(
        { error: "게시판을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 검색 조건
    const where: any = {
      boardId: board.id,
      isHidden: false,
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // 전체 게시글 수
    const total = await prisma.post.count({ where })

    // 게시글 목록 조회
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [
        { isNotice: "desc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("게시글 목록 조회 에러:", error)
    return NextResponse.json(
      { error: "게시글 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST: 게시글 작성
const createPostSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  boardType: z.string(),
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
    const validation = createPostSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { title, content, boardType } = validation.data

    // 게시판 조회
    const board = await prisma.board.findFirst({
      where: { type: boardType as any },
    })

    if (!board) {
      return NextResponse.json(
        { error: "게시판을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 게시글 작성 및 포인트 지급
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          title,
          content,
          boardId: board.id,
          authorId: session.user.id,
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
        data: { points: { increment: 10 } },
      })

      await tx.point.create({
        data: {
          userId: session.user.id,
          amount: 10,
          type: "POST_CREATE",
          description: "게시글 작성",
        },
      })

      return newPost
    })

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error("게시글 작성 에러:", error)
    return NextResponse.json(
      { error: "게시글 작성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


