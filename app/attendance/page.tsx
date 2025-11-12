"use client"

// 출석체크 페이지

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, Gift } from "lucide-react"
import { format } from "date-fns"

export default function AttendancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [hasAttendedToday, setHasAttendedToday] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState<any>(null)
  const [recentAttendances, setRecentAttendances] = useState<any[]>([])
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      loadAttendance()
    }
  }, [status])

  async function loadAttendance() {
    try {
      setLoading(true)
      const res = await fetch("/api/attendance")
      const data = await res.json()

      if (res.ok) {
        setHasAttendedToday(data.hasAttendedToday)
        setTodayAttendance(data.todayAttendance)
        setRecentAttendances(data.recentAttendances)
      }
    } catch (error) {
      console.error("출석 조회 에러:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAttendance() {
    try {
      setChecking(true)

      const res = await fetch("/api/attendance", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "출석 체크에 실패했습니다.")
        return
      }

      alert(data.message)
      loadAttendance() // 새로고침
    } catch (error) {
      console.error("출석 체크 에러:", error)
      alert("출석 체크 중 오류가 발생했습니다.")
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            출석 체크
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 출석 버튼 */}
          <div className="text-center space-y-4">
            {hasAttendedToday ? (
              <>
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Check className="h-6 w-6" />
                  <span className="text-lg font-bold">오늘 출석 완료!</span>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-600">
                    +{todayAttendance.points}P
                  </p>
                  <p className="text-sm text-muted-foreground">
                    연속 {todayAttendance.consecutiveDays}일 출석 중
                  </p>
                </div>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={handleAttendance}
                  disabled={checking}
                >
                  <Gift className="mr-2 h-5 w-5" />
                  출석하고 포인트 받기
                </Button>
                <p className="text-sm text-muted-foreground">
                  매일 출석하면 100 포인트 지급!
                  <br />
                  7일 연속 출석 시 보너스 +50P
                </p>
              </>
            )}
          </div>

          {/* 출석 현황 */}
          {recentAttendances.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">최근 출석 기록</h3>
              <div className="grid grid-cols-7 gap-2">
                {recentAttendances.map((attendance: any) => (
                  <div
                    key={attendance.id}
                    className="flex flex-col items-center p-2 bg-muted rounded-md"
                  >
                    <Badge variant="secondary" className="text-xs mb-1">
                      {format(new Date(attendance.date), "MM/dd")}
                    </Badge>
                    <span className="text-xs font-bold text-blue-600">
                      +{attendance.points}P
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {attendance.consecutiveDays}일
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 안내 */}
          <div className="bg-blue-50 p-4 rounded-md space-y-2 text-sm">
            <p className="font-semibold text-blue-900">💡 출석 혜택</p>
            <ul className="space-y-1 text-blue-800">
              <li>• 매일 출석: 100 포인트</li>
              <li>• 7일 연속 출석: +50 포인트 보너스</li>
              <li>• 14일 연속 출석: +100 포인트 보너스</li>
              <li>• 30일 연속 출석: +200 포인트 보너스</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

