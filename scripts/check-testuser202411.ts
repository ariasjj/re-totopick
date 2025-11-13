import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('🔍 testuser202411 계정 확인 중...\n')
    
    const user = await prisma.user.findUnique({
      where: { username: 'testuser202411' }
    })
    
    if (user) {
      console.log('✅ 사용자 발견!')
      console.log('아이디:', user.username)
      console.log('이메일:', user.email)
      console.log('닉네임:', user.nickname)
      console.log('전화번호:', user.phone)
      console.log('포인트:', user.points)
      console.log('활성:', user.isActive)
      console.log('생성일:', user.createdAt)
    } else {
      console.log('❌ testuser202411 계정이 데이터베이스에 없습니다!')
      
      // 최근 생성된 사용자 5명 확인
      const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          username: true,
          email: true,
          createdAt: true
        }
      })
      
      console.log('\n📋 최근 5명의 사용자:')
      if (recentUsers.length > 0) {
        recentUsers.forEach(u => {
          console.log(`  - 아이디: ${u.username}, 이메일: ${u.email}, 생성일: ${u.createdAt.toLocaleString()}`)
        })
      } else {
        console.log('  데이터베이스에 사용자가 없습니다.')
      }
    }
    
  } catch (error) {
    console.error('❌ 에러:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()

