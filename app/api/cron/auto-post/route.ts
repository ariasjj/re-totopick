import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BoardType } from "@prisma/client"

// Vercel Cron Job 설정
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 샘플 게시글 데이터
const samplePosts: Record<string, Array<{ title: string; content: string }>> = {
  "MUKTU_REPORT": [
    {
      title: "⚠️ 먹튀 주의 - 신규 사이트 검증 필요",
      content: "최근 개설된 신규 사이트에 대한 먹튀 의혹이 제기되었습니다. 해당 사이트 이용 시 각별한 주의가 필요합니다. 충분한 검증이 이루어질 때까지 이용을 자제해 주시기 바랍니다."
    },
    {
      title: "🚨 먹튀 확정 - 긴급 공지",
      content: "해당 사이트가 먹튀로 확정되었습니다. 즉시 이용을 중단하시고, 피해를 입으신 회원분들은 고객센터로 연락 주시기 바랍니다."
    },
    {
      title: "⛔ 출금 지연 사이트 목록 업데이트",
      content: "출금 지연이 발생하고 있는 사이트들을 정리했습니다. 해당 사이트 이용 시 주의하시기 바랍니다."
    },
  ],
  "SCAM_REPORT": [
    {
      title: "사기 주의보 - 피싱 사이트 발견",
      content: "유사한 도메인을 사용하는 피싱 사이트가 발견되었습니다. 정확한 주소를 확인하신 후 이용하시기 바랍니다."
    },
    {
      title: "🚫 불법 광고 신고",
      content: "불법 광고 및 스팸 메시지에 대한 신고가 접수되었습니다. 의심스러운 메시지를 받으신 경우 즉시 신고해 주세요."
    },
  ],
  "TOTO_INFO": [
    {
      title: "토토 이용 시 필수 체크사항",
      content: "안전한 토토 이용을 위한 필수 체크리스트를 공유합니다. 1) 사이트 검증 확인 2) 보증금 확인 3) 이용후기 확인 4) 출금 조건 확인"
    },
    {
      title: "신규 회원을 위한 토토 가이드",
      content: "처음 토토를 시작하시는 분들을 위한 기본 가이드입니다. 안전하게 이용하는 방법부터 주의사항까지 상세히 안내드립니다."
    },
    {
      title: "보증업체 선택 방법",
      content: "신뢰할 수 있는 보증업체를 선택하는 방법에 대해 알아봅니다. 보증금, 운영기간, 사용자 평가 등을 종합적으로 고려해야 합니다."
    },
  ],
  "SPORTS_ANALYSIS": [
    {
      title: "⚽ 오늘의 경기 분석 - 프리미어리그",
      content: "오늘 열리는 프리미어리그 주요 경기를 분석합니다. 양팀의 최근 전적, 선수 컨디션, 전술 분석 등을 종합적으로 다룹니다."
    },
    {
      title: "🏀 NBA 경기 예측 및 분석",
      content: "NBA 주요 경기에 대한 상세 분석을 제공합니다. 팀 간 상성, 홈/원정 성적, 부상자 명단 등을 고려한 예측입니다."
    },
    {
      title: "⚾ KBO 리그 경기 분석",
      content: "오늘의 KBO 리그 경기를 분석합니다. 선발 투수의 최근 폼, 타선의 화력, 최근 맞대결 전적 등을 살펴봅니다."
    },
    {
      title: "🎾 테니스 경기 분석",
      content: "주요 테니스 대회 경기를 분석합니다. 선수들의 컨디션과 코트 적응력을 중점적으로 다룹니다."
    },
  ],
  "PROMOTION": [
    {
      title: "🎁 신규 회원 특별 혜택 안내",
      content: "신규 가입 회원분들께 특별 혜택을 드립니다. 첫 충전 보너스 40%, 매 충전 10% 보너스 제공!"
    },
    {
      title: "💰 추천인 이벤트 진행 중",
      content: "친구 추천 시 추천인과 피추천인 모두에게 포인트를 지급합니다. 많이 참여해 주세요!"
    },
    {
      title: "🎉 주간 이벤트 안내",
      content: "이번 주 특별 이벤트를 안내드립니다. 다양한 혜택을 받아가세요!"
    },
  ],
  "REVIEW": [
    {
      title: "토토사이트 이용 후기 - 솔직 리뷰",
      content: "3개월간 이용한 솔직한 후기입니다. 장점: 빠른 출금, 다양한 이벤트. 단점: 가끔 느린 접속 속도."
    },
    {
      title: "추천 사이트 상세 리뷰",
      content: "보증업체로 등록된 사이트를 실제로 이용해본 후기입니다. 전반적으로 만족스러웠으며 특히 고객 응대가 좋았습니다."
    },
  ],
  "TOTO_SITE": [
    {
      title: "신규 검증 사이트 소개",
      content: "새롭게 검증을 완료한 안전한 토토사이트를 소개합니다."
    },
  ],
}

export async function GET(request: Request) {
  try {
    // Vercel Cron 비밀키 확인 (보안)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    // 개발 환경에서는 비밀키 체크 생략 (테스트 용도)
    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: '인증 실패', message: 'Authorization 헤더가 올바르지 않습니다' },
        { status: 401 }
      )
    }

    // 관리자 계정 찾기 (자동 게시글의 작성자)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: '관리자 계정 없음', message: '관리자 계정을 먼저 생성해주세요' },
        { status: 404 }
      )
    }

    const createdPosts: Array<{ id: string; title: string; board: string }> = []
    const errors: Array<{ board: string; error: string }> = []

    // 각 게시판별로 게시글 생성
    for (const [boardType, posts] of Object.entries(samplePosts)) {
      try {
        // 게시판 찾기
        const board = await prisma.board.findFirst({
          where: { type: boardType as BoardType }
        })

        if (!board) {
          errors.push({ board: boardType, error: '게시판을 찾을 수 없음' })
          continue
        }

        // 무작위로 1-2개 게시글 선택
        const numPosts = Math.floor(Math.random() * 2) + 1 // 1 or 2
        const shuffledPosts = [...posts].sort(() => Math.random() - 0.5)
        const selectedPosts = shuffledPosts.slice(0, Math.min(numPosts, posts.length))

        // 게시글 생성
        for (const postData of selectedPosts) {
          const post = await prisma.post.create({
            data: {
              title: postData.title,
              content: postData.content,
              boardId: board.id,
              authorId: adminUser.id,
              views: Math.floor(Math.random() * 50), // 랜덤 조회수 (0-49)
              isNotice: false,
            }
          })

          createdPosts.push({
            id: post.id,
            title: post.title,
            board: boardType,
          })
        }
      } catch (error) {
        errors.push({
          board: boardType,
          error: error instanceof Error ? error.message : '알 수 없는 오류'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdPosts.length}개의 게시글이 생성되었습니다`,
      posts: createdPosts,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
      author: adminUser.nickname,
    })
  } catch (error) {
    console.error('자동 게시글 생성 에러:', error)
    return NextResponse.json(
      {
        error: '게시글 생성 실패',
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        details: String(error)
      },
      { status: 500 }
    )
  }
}

