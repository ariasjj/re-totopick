// 회원가입 API

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import { z } from "zod"

// 회원가입 유효성 검사 스키마
const signupSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  phone: z.string().regex(/^010\d{8}$/, "올바른 전화번호 형식이 아닙니다."),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 유효성 검사
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, nickname, phone } = validation.data

    // 이메일 중복 확인
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })
    if (existingEmail) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      )
    }

    // 닉네임 중복 확인
    const existingNickname = await prisma.user.findUnique({
      where: { nickname },
    })
    if (existingNickname) {
      return NextResponse.json(
        { error: "이미 사용 중인 닉네임입니다." },
        { status: 400 }
      )
    }

    // 전화번호 중복 확인
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    })
    if (existingPhone) {
      return NextResponse.json(
        { error: "이미 사용 중인 전화번호입니다." },
        { status: 400 }
      )
    }

    // 전화번호 인증 확인
    const verification = await prisma.phoneVerification.findFirst({
      where: {
        phone,
        verified: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!verification) {
      return NextResponse.json(
        { error: "전화번호 인증이 완료되지 않았습니다." },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성 및 회원가입 포인트 지급
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          nickname,
          phone,
          phoneVerified: true,
          points: 1000, // 가입 포인트
        },
      })

      // 포인트 내역 추가
      await tx.point.create({
        data: {
          userId: newUser.id,
          amount: 1000,
          type: 'SIGNUP',
          description: '회원가입 축하 포인트',
        },
      })

      return newUser
    })

    return NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다!",
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    })
  } catch (error) {
    console.error("회원가입 에러:", error)
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


