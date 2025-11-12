// 핸드폰 인증번호 발송 API

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSMSService, generateVerificationCode } from "@/lib/sms"
import { z } from "zod"

const phoneSchema = z.object({
  phone: z.string().regex(/^010\d{8}$/, "올바른 전화번호 형식이 아닙니다."),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 유효성 검사
    const validation = phoneSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { phone } = validation.data

    // 이미 사용 중인 전화번호인지 확인
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 전화번호입니다." },
        { status: 400 }
      )
    }

    // 인증번호 생성
    const code = generateVerificationCode()
    
    // SMS 발송
    const smsService = getSMSService()
    const sent = await smsService.sendVerificationCode(phone, code)

    if (!sent) {
      return NextResponse.json(
        { error: "인증번호 발송에 실패했습니다." },
        { status: 500 }
      )
    }

    // 인증번호 저장 (5분 유효)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 5)

    await prisma.phoneVerification.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    })

    return NextResponse.json({
      success: true,
      message: "인증번호가 발송되었습니다.",
      // 테스트 모드에서만 인증번호 반환
      ...(process.env.SMS_MODE === 'test' && { code }),
    })
  } catch (error) {
    console.error("인증번호 발송 에러:", error)
    return NextResponse.json(
      { error: "인증번호 발송 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


