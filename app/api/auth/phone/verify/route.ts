// 핸드폰 인증번호 확인 API

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const verifySchema = z.object({
  phone: z.string().regex(/^010\d{8}$/, "올바른 전화번호 형식이 아닙니다."),
  code: z.string().length(6, "인증번호는 6자리입니다."),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 유효성 검사
    const validation = verifySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { phone, code } = validation.data

    // 최근 인증번호 조회
    const verification = await prisma.phoneVerification.findFirst({
      where: {
        phone,
        code,
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!verification) {
      return NextResponse.json(
        { error: "인증번호가 일치하지 않습니다." },
        { status: 400 }
      )
    }

    // 만료 확인
    if (new Date() > verification.expiresAt) {
      return NextResponse.json(
        { error: "인증번호가 만료되었습니다. 다시 발송해주세요." },
        { status: 400 }
      )
    }

    // 인증 완료 처리
    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    })

    return NextResponse.json({
      success: true,
      message: "전화번호 인증이 완료되었습니다.",
    })
  } catch (error) {
    console.error("인증번호 확인 에러:", error)
    return NextResponse.json(
      { error: "인증번호 확인 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


