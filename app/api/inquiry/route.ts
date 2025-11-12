// 1:1 문의 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET: 내 문의 목록
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const inquiries = await prisma.inquiry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error("문의 목록 조회 에러:", error)
    return NextResponse.json(
      { error: "문의 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST: 문의 작성
const createInquirySchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  isSecret: z.boolean().default(true),
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
    const validation = createInquirySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      inquiry,
    })
  } catch (error) {
    console.error("문의 작성 에러:", error)
    return NextResponse.json(
      { error: "문의 작성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


