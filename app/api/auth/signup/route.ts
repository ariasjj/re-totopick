// 회원가입 API

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import { z } from "zod"

// 회원가입 유효성 검사 스키마
const signupSchema = z.object({
  username: z.string()
    .min(4, "아이디는 최소 4자 이상이어야 합니다.")
    .max(20, "아이디는 최대 20자까지 가능합니다.")
    .regex(/^[a-zA-Z0-9_]+$/, "아이디는 영문, 숫자, _만 사용 가능합니다."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  phone: z.string().regex(/^010\d{8}$/, "올바른 전화번호 형식이 아닙니다."),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 회원가입 API 호출됨')
    const body = await request.json()
    console.log('🔵 받은 데이터:', { ...body, password: '***' })
    
    // 유효성 검사
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      console.log('❌ 유효성 검사 실패:', validation.error.errors[0].message)
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { username, email, password, nickname, phone } = validation.data
    console.log('✅ 유효성 검사 통과')

    // 아이디 중복 확인
    console.log('🔵 아이디 중복 확인 중...')
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })
    if (existingUsername) {
      console.log('❌ 아이디 중복')
      return NextResponse.json(
        { error: "이미 사용 중인 아이디입니다." },
        { status: 400 }
      )
    }

    // 이메일 중복 확인
    console.log('🔵 이메일 중복 확인 중...')
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })
    if (existingEmail) {
      console.log('❌ 이메일 중복')
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      )
    }

    // 닉네임 중복 확인
    console.log('🔵 닉네임 중복 확인 중...')
    const existingNickname = await prisma.user.findUnique({
      where: { nickname },
    })
    if (existingNickname) {
      console.log('❌ 닉네임 중복')
      return NextResponse.json(
        { error: "이미 사용 중인 닉네임입니다." },
        { status: 400 }
      )
    }

    // 전화번호 중복 확인
    console.log('🔵 전화번호 중복 확인 중...')
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    })
    if (existingPhone) {
      console.log('❌ 전화번호 중복')
      return NextResponse.json(
        { error: "이미 사용 중인 전화번호입니다." },
        { status: 400 }
      )
    }

    // 전화번호 인증 확인
    console.log('🔵 전화번호 인증 확인 중...')
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
      console.log('❌ 전화번호 인증 실패')
      return NextResponse.json(
        { error: "전화번호 인증이 완료되지 않았습니다." },
        { status: 400 }
      )
    }
    console.log('✅ 전화번호 인증 확인 완료')

    // 비밀번호 해시화
    console.log('🔵 비밀번호 해시화 중...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성 및 회원가입 포인트 지급
    console.log('🔵 데이터베이스에 사용자 생성 중...')
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username,
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

    console.log('✅ 회원가입 완료! 사용자 ID:', user.id)
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


