import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('🔍 testuser11 확인 중...\n')
    
    const user = await prisma.user.findUnique({
      where: { username: 'testuser11' }
    })
    
    if (user) {
      console.log('✅ 사용자 발견!')
      console.log('아이디:', user.username)
      console.log('이메일:', user.email)
      console.log('닉네임:', user.nickname)
      console.log('전화번호:', user.phone)
      console.log('전화번호 인증:', user.phoneVerified)
      console.log('활성:', user.isActive)
      console.log('생성일:', user.createdAt)
    } else {
      console.log('❌ testuser11 계정이 데이터베이스에 없습니다!')
    }
    
  } catch (error) {
    console.error('❌ 에러:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()

