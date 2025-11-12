// 방문자 통계 API

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 방문자 기록
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown"
    const userAgent = request.headers.get("user-agent") || ""
    const { pathname } = await request.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 오늘 같은 IP의 방문 기록이 있는지 확인
    const existing = await prisma.visitor.findFirst({
      where: {
        ip,
        createdAt: today,
      },
    })

    // 중복이 아니면 기록
    if (!existing) {
      await prisma.visitor.create({
        data: {
          ip,
          userAgent,
          page: pathname,
          createdAt: today,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("방문자 기록 에러:", error)
    return NextResponse.json(
      { error: "방문자 기록 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// 방문자 통계 조회
export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayCount = await prisma.visitor.count({
      where: {
        createdAt: { gte: today },
      },
    })

    const totalCount = await prisma.visitor.count()

    return NextResponse.json({
      today: todayCount,
      total: totalCount,
    })
  } catch (error) {
    console.error("방문자 통계 조회 에러:", error)
    return NextResponse.json(
      { error: "방문자 통계 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


