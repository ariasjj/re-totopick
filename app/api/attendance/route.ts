// 출석체크 API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 출석 정보 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    // 오늘 출석 여부 확인
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        userId: session.user.id,
        date: today,
      },
    })

    // 최근 출석 기록 (30일)
    const recentAttendances = await prisma.attendance.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      take: 30,
    })

    return NextResponse.json({
      hasAttendedToday: !!todayAttendance,
      todayAttendance,
      recentAttendances,
    })
  } catch (error) {
    console.error("출석 조회 에러:", error)
    return NextResponse.json(
      { error: "출석 정보 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST: 출석 체크
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    // 오늘 날짜
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 이미 출석했는지 확인
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: session.user.id,
        date: today,
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: "오늘은 이미 출석하셨습니다." },
        { status: 400 }
      )
    }

    // 어제 출석 확인 (연속 출석 계산)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayAttendance = await prisma.attendance.findFirst({
      where: {
        userId: session.user.id,
        date: yesterday,
      },
    })

    const consecutiveDays = yesterdayAttendance 
      ? yesterdayAttendance.consecutiveDays + 1 
      : 1

    // 보너스 포인트 계산 (7일 연속 시 추가 50점)
    const basePoints = 100
    const bonusPoints = consecutiveDays % 7 === 0 ? 50 : 0
    const totalPoints = basePoints + bonusPoints

    // 출석 체크 및 포인트 지급
    const attendance = await prisma.$transaction(async (tx) => {
      const newAttendance = await tx.attendance.create({
        data: {
          userId: session.user.id,
          date: today,
          points: totalPoints,
          consecutiveDays,
        },
      })

      await tx.user.update({
        where: { id: session.user.id },
        data: { points: { increment: totalPoints } },
      })

      await tx.point.create({
        data: {
          userId: session.user.id,
          amount: totalPoints,
          type: "ATTENDANCE",
          description: `출석체크 (연속 ${consecutiveDays}일)${bonusPoints > 0 ? ' + 7일 연속 보너스' : ''}`,
        },
      })

      return newAttendance
    })

    return NextResponse.json({
      success: true,
      attendance,
      message: bonusPoints > 0 
        ? `${totalPoints}P 획득! (7일 연속 보너스 +${bonusPoints}P)` 
        : `${totalPoints}P 획득! (연속 ${consecutiveDays}일)`,
    })
  } catch (error) {
    console.error("출석 체크 에러:", error)
    return NextResponse.json(
      { error: "출석 체크 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


