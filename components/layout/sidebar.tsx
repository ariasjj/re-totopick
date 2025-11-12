"use client"

// 사이드바 - 로그인, 검색, 통계, 랭킹, 최신글

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Users, Send } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export function Sidebar() {
  const { data: session } = useSession()

  return (
    <aside className="w-full space-y-4">
      {/* 로그인 정보 */}
      {session ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{session.user?.name}</span>
                <Badge variant="secondary">일반회원</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">포인트</span>
                <span className="font-bold text-blue-600">1,000P</span>
              </div>
              <Button className="w-full" size="sm" asChild>
                <Link href="/attendance">출석체크</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                로그인하고 다양한 혜택을 받으세요!
              </p>
              <Button className="w-full" asChild>
                <Link href="/auth/signin">로그인</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 텔레그램 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Send className="h-4 w-4 mr-2" />
            텔레그램
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="outline" size="sm">
            텔레그램 채널 가입
          </Button>
        </CardContent>
      </Card>

      {/* 검색 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Search className="h-4 w-4 mr-2" />
            검색
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input placeholder="검색어 입력..." className="h-9" />
            <Button size="sm">검색</Button>
          </div>
        </CardContent>
      </Card>

      {/* 실시간 방문자 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Users className="h-4 w-4 mr-2" />
            실시간 방문자
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">현재</span>
              <span className="font-bold text-green-600">42명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">오늘</span>
              <span className="font-bold">1,234명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">전체</span>
              <span className="font-bold">98,765명</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 포인트 랭킹 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            포인트 랭킹
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((rank) => (
              <div key={rank} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant={rank === 1 ? "default" : "secondary"}>
                    {rank}위
                  </Badge>
                  <span>유저{rank}</span>
                </div>
                <span className="text-muted-foreground">{10000 - rank * 1000}P</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 최신글 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">최신글</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["먹튀제보", "스포츠분석", "토토후기"].map((board, idx) => (
              <div key={board}>
                <p className="text-xs text-muted-foreground mb-1">{board}</p>
                <Link
                  href="#"
                  className="text-sm hover:underline line-clamp-1"
                >
                  샘플 게시글 제목입니다 {idx + 1}
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

