// 관리자 통계 API

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      )
    }

    // 통계 데이터 수집
    const [
      totalUsers,
      totalPosts,
      totalComments,
      pendingReports,
      pendingInquiries,
      todayVisitors,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.siteReport.count({ where: { status: "PENDING" } }),
      prisma.inquiry.count({ where: { status: "PENDING" } }),
      prisma.visitor.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ])

    // 최근 가입자 (7일)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    })

    // 인기 게시판
    const popularBoards = await prisma.post.groupBy({
      by: ["boardId"],
      _count: true,
      orderBy: {
        _count: {
          boardId: "desc",
        },
      },
      take: 5,
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        pendingReports,
        pendingInquiries,
        todayVisitors,
        recentUsers,
      },
      popularBoards,
    })
  } catch (error) {
    console.error("통계 조회 에러:", error)
    return NextResponse.json(
      { error: "통계 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


