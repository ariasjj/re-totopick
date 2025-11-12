import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AlertTriangle, TrendingUp, Star, Bell } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold mb-2">토토픽에 오신 것을 환영합니다!</h1>
          <p className="text-blue-100">
            토토 정보를 공유하는 커뮤니티입니다.
          </p>
        </CardContent>
      </Card>

      {/* 주요 게시판 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/boards/muktu-report">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                먹튀제보
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                새로운 신고
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/boards/sports-analysis">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                스포츠분석
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                오늘의 분석글
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/boards/toto-site">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                토토사이트
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                추천 사이트
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 최근 공지사항 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            공지사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link href="#" className="flex items-start space-x-3 hover:bg-muted p-2 rounded-md transition-colors">
              <Badge variant="destructive">공지</Badge>
              <div className="flex-1">
                <p className="font-medium">토토픽 서비스 오픈 안내</p>
                <p className="text-sm text-muted-foreground">2024-01-01</p>
              </div>
            </Link>
            <Link href="#" className="flex items-start space-x-3 hover:bg-muted p-2 rounded-md transition-colors">
              <Badge variant="outline">안내</Badge>
              <div className="flex-1">
                <p className="font-medium">커뮤니티 이용 규칙 안내</p>
                <p className="text-sm text-muted-foreground">2024-01-01</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 인기 게시글 */}
      <Card>
        <CardHeader>
          <CardTitle>인기 게시글</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Link
                key={i}
                href="#"
                className="flex items-center justify-between hover:bg-muted p-2 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{i}</Badge>
                  <span className="text-sm">샘플 인기 게시글 제목입니다 {i}</span>
                </div>
                <span className="text-xs text-muted-foreground">👍 {10 - i}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

