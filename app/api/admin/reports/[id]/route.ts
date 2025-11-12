// 관리자 신고 처리 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateReportSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "COMPLETED", "REJECTED"]),
  adminNote: z.string().optional(),
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
    const validation = updateReportSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const report = await prisma.siteReport.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error) {
    console.error("신고 처리 에러:", error)
    return NextResponse.json(
      { error: "신고 처리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


