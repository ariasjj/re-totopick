import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const username = process.argv[2]
    
    if (!username) {
      console.log('❌ 사용법: npx tsx scripts/check-user.ts <username>')
      console.log('예시: npx tsx scripts/check-user.ts testuser')
      return
    }
    
    console.log(`🔍 ${username} 계정 확인 중...\n`)
    
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (user) {
      console.log('✅ 사용자 발견!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('아이디:', user.username)
      console.log('이메일:', user.email)
      console.log('닉네임:', user.nickname)
      console.log('전화번호:', user.phone || '없음')
      console.log('전화번호 인증:', user.phoneVerified ? '✅ 완료' : '❌ 미완료')
      console.log('포인트:', user.points + 'P')
      console.log('권한:', user.role)
      console.log('활성 상태:', user.isActive ? '✅ 활성' : '❌ 비활성')
      console.log('생성일:', user.createdAt.toLocaleString('ko-KR'))
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    } else {
      console.log(`❌ ${username} 계정이 데이터베이스에 없습니다!\n`)
      
      // 최근 생성된 사용자 5명 표시
      const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          username: true,
          email: true,
          createdAt: true,
        }
      })
      
      if (recentUsers.length > 0) {
        console.log('📋 최근 5명의 사용자:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        recentUsers.forEach((u, index) => {
          console.log(`${index + 1}. ${u.username}`)
          console.log(`   이메일: ${u.email}`)
          console.log(`   생성일: ${u.createdAt.toLocaleString('ko-KR')}\n`)
        })
      } else {
        console.log('데이터베이스에 사용자가 없습니다.')
      }
    }
    
  } catch (error) {
    console.error('❌ 에러:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()

