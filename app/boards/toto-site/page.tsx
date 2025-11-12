"use client"

// 토토사이트 배너 광고 페이지

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PenSquare, ExternalLink, Shield, Star } from "lucide-react"

// 배너 광고 타입
interface BannerSite {
  id: string
  name: string
  domain: string
  guarantee: string // 보증금
  bannerImage: string
  isVerified: boolean // 보증업체 여부
  rating: number // 평점
  description: string
}

// 샘플 배너 데이터 (실제로는 데이터베이스에서 가져옴)
const sampleBanners: BannerSite[] = [
  {
    id: "1",
    name: "토토사이트 [에그벳]",
    domain: "에그벳.com",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample1.jpg",
    isVerified: true,
    rating: 4.5,
    description: "첫충 40% 무한 / 매충 10% 콤프 4%"
  },
  {
    id: "2",
    name: "토토사이트 [도라에몽]",
    domain: "do-1111.com/?code=0202",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample2.jpg",
    isVerified: true,
    rating: 4.8,
    description: "첫충 40% 매이백10% 콤프 4%"
  },
  {
    id: "3",
    name: "토토사이트 [스피드]",
    domain: "스피드명성.com",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample3.jpg",
    isVerified: true,
    rating: 4.3,
    description: "5% 77만원 매일 지급"
  },
  {
    id: "4",
    name: "토토사이트 [투게더]",
    domain: "tg-5555.com/?code=7989",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample4.jpg",
    isVerified: true,
    rating: 4.6,
    description: "첫충 40% 매이백10% 콤프 4%"
  },
  {
    id: "5",
    name: "토토사이트 [렌드빌랏]",
    domain: "rv-0202.com/?ref=222",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample5.jpg",
    isVerified: true,
    rating: 4.4,
    description: "신규 40% 무이15% 매이10% 콤프 7%"
  },
  {
    id: "6",
    name: "토토사이트 [블트카지노]",
    domain: "btbt-1111.com",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample6.jpg",
    isVerified: true,
    rating: 4.7,
    description: "신규 40% 첫충 12% 매충 4%"
  },
  {
    id: "7",
    name: "토토사이트 [히어로]",
    domain: "hr-rr.com",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample7.jpg",
    isVerified: true,
    rating: 4.2,
    description: "단컨환전 무제한 오토재재 X"
  },
  {
    id: "8",
    name: "토상센터 검증 안전한 선벳[SUNBET]",
    domain: "선벳.com",
    guarantee: "50,000,000원",
    bannerImage: "/banners/sample8.jpg",
    isVerified: true,
    rating: 4.9,
    description: "우회 우저리플 샤리샤 반야아 배팅 화자!"
  },
]

export default function TotoSitePage() {
  const { data: session } = useSession()
  const [banners] = useState<BannerSite[]>(sampleBanners)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="h-8 w-8 text-yellow-500" />
            추천 토토사이트
          </h1>
          <p className="text-muted-foreground mt-2">
            검증된 안전한 토토사이트를 소개합니다
          </p>
        </div>
        {session && (
          <Button asChild>
            <Link href="/boards/toto-site/new">
              <PenSquare className="mr-2 h-4 w-4" />
              사이트 등록
            </Link>
          </Button>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              검증된 안전한 사이트
            </h3>
            <p className="text-sm text-blue-700">
              모든 사이트는 철저한 검증을 거쳤으며, 보증금이 예치되어 있습니다.
              먹튀 발생 시 100% 보상됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 배너 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {banners.map((banner) => (
            <Card
              key={banner.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <CardContent className="p-0">
                {/* 상태 배지 */}
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg"
                    >
                      보증업체
                    </Badge>
                  </div>
                  {banner.rating >= 4.5 && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge
                        variant="secondary"
                        className="bg-yellow-400 text-yellow-900 font-bold shadow-lg"
                      >
                        ⭐ 추천
                      </Badge>
                    </div>
                  )}

                  {/* 배너 이미지 (임시로 그라데이션 배경) */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="relative z-10 text-center text-white p-6">
                      <div className="text-2xl font-bold mb-2">
                        {banner.name.replace("토토사이트 ", "")}
                      </div>
                      <div className="text-sm opacity-90">
                        {banner.description}
                      </div>
                    </div>
                    {/* 장식 효과 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                  </div>
                </div>

                {/* 사이트 정보 */}
                <div className="p-5 space-y-3">
                  {/* 사이트 이름 */}
                  <h3 className="font-bold text-lg line-clamp-1">
                    {banner.name}
                  </h3>

                  {/* 도메인 */}
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-medium">도메인: {banner.domain}</span>
                  </div>

                  {/* 평점 */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(banner.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {banner.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* 보증금 */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        보증금
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {banner.guarantee}
                      </span>
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      바로가기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {/* 하단 안내 */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-bold text-yellow-900">⚠️ 주의사항</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>미성년자는 이용할 수 없습니다.</li>
              <li>과도한 베팅은 중독을 유발할 수 있습니다.</li>
              <li>검증된 사이트라도 본인의 판단이 중요합니다.</li>
              <li>먹튀 피해 발생 시 즉시 신고해주세요.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

