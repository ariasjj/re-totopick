// 관리자 회원 수정/삭제 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// PUT: 회원 정보 수정
const updateUserSchema = z.object({
  points: z.number().optional(),
  isActive: z.boolean().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
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
    const validation = updateUserSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("회원 수정 에러:", error)
    return NextResponse.json(
      { error: "회원 수정 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// DELETE: 회원 삭제
export async function DELETE(
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

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "회원이 삭제되었습니다.",
    })
  } catch (error) {
    console.error("회원 삭제 에러:", error)
    return NextResponse.json(
      { error: "회원 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


