// 관리자 문의 답변 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const answerSchema = z.object({
  answer: z.string().min(1, "답변 내용을 입력해주세요."),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = answerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: {
        answer: validation.data.answer,
        status: "ANSWERED",
        answeredAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      inquiry,
    })
  } catch (error) {
    console.error("문의 답변 에러:", error)
    return NextResponse.json(
      { error: "문의 답변 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


