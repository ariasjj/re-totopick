// 먹튀/사기 신고 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET: 신고 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 먹튀/사기
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 10

    const where: any = {
      status: { in: ["PENDING", "REVIEWING", "COMPLETED"] },
    }

    if (type) {
      where.reportType = type
    }

    const total = await prisma.siteReport.count({ where })

    const reports = await prisma.siteReport.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("신고 목록 조회 에러:", error)
    return NextResponse.json(
      { error: "신고 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST: 신고 작성
const createReportSchema = z.object({
  siteName: z.string().min(1, "사이트명을 입력해주세요."),
  siteUrl: z.string().url("올바른 URL을 입력해주세요.").optional().or(z.literal("")),
  reportType: z.enum(["먹튀", "사기"]),
  amount: z.number().min(0, "피해금액은 0 이상이어야 합니다.").optional(),
  description: z.string().min(10, "신고 내용은 최소 10자 이상 입력해주세요."),
  evidence: z.string().optional(),
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
    const validation = createReportSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const report = await prisma.siteReport.create({
      data: {
        ...validation.data,
        reporterId: session.user.id,
      },
      include: {
        reporter: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error) {
    console.error("신고 작성 에러:", error)
    return NextResponse.json(
      { error: "신고 작성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


