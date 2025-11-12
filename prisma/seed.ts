// 데이터베이스 초기 데이터 생성 (Seed)
// 실행: npx prisma db seed

import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
config({ path: resolve(__dirname, '../.env.local') })

import { PrismaClient, BoardType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 데이터베이스 초기화 시작...')

  // 기존 데이터 삭제 (개발용)
  await prisma.visitor.deleteMany()
  await prisma.siteReport.deleteMany()
  await prisma.inquiry.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.point.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.board.deleteMany()
  await prisma.phoneVerification.deleteMany()
  await prisma.user.deleteMany()

  // 1. 관리자 계정 생성
  const hashedPassword = await bcrypt.hash('admin1234', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@totopick.com',
      password: hashedPassword,
      nickname: '관리자',
      phone: '01012345678',
      phoneVerified: true,
      role: 'ADMIN',
      points: 999999,
    },
  })
  console.log('✅ 관리자 계정 생성:', admin.email)

  // 2. 테스트 사용자 생성
  const testUser = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: await bcrypt.hash('test1234', 10),
      nickname: '테스트유저',
      phone: '01098765432',
      phoneVerified: true,
      role: 'USER',
      points: 1000,
    },
  })
  console.log('✅ 테스트 사용자 생성:', testUser.email)

  // 3. 게시판 생성
  const boards = [
    { type: BoardType.NOTICE, name: '공지사항', description: '사이트 공지사항', order: 0 },
    { type: BoardType.TOTO_SITE, name: '토토사이트', description: '추천 사이트 목록', order: 1 },
    { type: BoardType.MUKTU_REPORT, name: '먹튀제보', description: '먹튀 사이트 신고', order: 2 },
    { type: BoardType.SCAM_REPORT, name: '사기신고', description: '사기 피해 신고', order: 3 },
    { type: BoardType.TOTO_INFO, name: '토토정보', description: '각종 토토 관련 정보', order: 4 },
    { type: BoardType.SPORTS_ANALYSIS, name: '스포츠분석', description: '경기 분석 게시판', order: 5 },
    { type: BoardType.PROMOTION, name: '홍보방', description: '사이트 홍보 게시판', order: 6 },
    { type: BoardType.REVIEW, name: '토토후기', description: '사용자 후기', order: 7 },
    { type: BoardType.FREE, name: '자유게시판', description: '자유 주제 게시판', order: 8 },
  ]

  for (const board of boards) {
    await prisma.board.create({ data: board })
  }
  console.log('✅ 게시판 9개 생성 완료')

  // 4. 샘플 게시글 생성
  const noticeBoard = await prisma.board.findFirst({ where: { type: BoardType.NOTICE } })
  if (noticeBoard) {
    await prisma.post.create({
      data: {
        title: '🎉 토토픽에 오신 것을 환영합니다!',
        content: `
안녕하세요! 토토픽(TOTOPICK)에 오신 것을 환영합니다.

**토토픽은 다음과 같은 서비스를 제공합니다:**

1. 📋 토토사이트 추천 및 정보 제공
2. 🚨 먹튀/사기 신고 시스템
3. ⚽ 스포츠 분석 및 정보 공유
4. 💬 사용자 커뮤니티

**회원 혜택:**
- 회원가입 시 1000 포인트 지급
- 매일 출석체크로 100 포인트 적립
- 게시글 작성 시 10 포인트 적립
- 댓글 작성 시 5 포인트 적립

현명한 선택, 토토픽에서 시작하세요!
        `,
        boardId: noticeBoard.id,
        authorId: admin.id,
        isNotice: true,
      },
    })
    console.log('✅ 공지사항 샘플 게시글 생성')
  }

  console.log('🎉 데이터베이스 초기화 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 에러 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


