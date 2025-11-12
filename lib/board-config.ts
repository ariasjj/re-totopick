// 게시판 설정 및 타입 변환

import { BoardType } from "@prisma/client"

export const boardConfig = {
  "toto-site": {
    type: BoardType.TOTO_SITE,
    name: "토토사이트",
    description: "추천 사이트 목록",
  },
  "muktu-report": {
    type: BoardType.MUKTU_REPORT,
    name: "먹튀제보",
    description: "먹튀 사이트 신고",
  },
  "scam-report": {
    type: BoardType.SCAM_REPORT,
    name: "사기신고",
    description: "사기 피해 신고",
  },
  "toto-info": {
    type: BoardType.TOTO_INFO,
    name: "토토정보",
    description: "각종 토토 관련 정보",
  },
  "sports-analysis": {
    type: BoardType.SPORTS_ANALYSIS,
    name: "스포츠분석",
    description: "경기 분석 게시판",
  },
  "promotion": {
    type: BoardType.PROMOTION,
    name: "홍보방",
    description: "사이트 홍보 게시판",
  },
  "review": {
    type: BoardType.REVIEW,
    name: "토토후기",
    description: "사용자 후기",
  },
  "notice": {
    type: BoardType.NOTICE,
    name: "공지사항",
    description: "사이트 공지사항",
  },
  "free": {
    type: BoardType.FREE,
    name: "자유게시판",
    description: "자유 주제 게시판",
  },
} as const

export type BoardSlug = keyof typeof boardConfig

export function getBoardConfig(slug: string) {
  return boardConfig[slug as BoardSlug] || null
}


