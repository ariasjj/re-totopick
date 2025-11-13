import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('🔍 finaltest 계정 확인 중...\n')
    
    const user = await prisma.user.findUnique({
      where: { username: 'finaltest' }
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
      console.log('\n비밀번호 해시:', user.password.substring(0, 20) + '...')
    } else {
      console.log('❌ finaltest 계정이 데이터베이스에 없습니다!')
      
      // 최근 생성된 사용자 확인
      const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      })
      
      console.log('\n📋 최근 생성된 사용자:')
      recentUsers.forEach(u => {
        console.log(`- ${u.username} (${u.email}) - ${u.createdAt}`)
      })
    }
    
    // 전화번호 인증 확인
    const phoneVerification = await prisma.phoneVerification.findFirst({
      where: { phone: '01099998888' },
      orderBy: { createdAt: 'desc' }
    })
    
    if (phoneVerification) {
      console.log('\n📱 전화번호 인증 기록:')
      console.log('전화번호:', phoneVerification.phone)
      console.log('인증 코드:', phoneVerification.code)
      console.log('인증 완료:', phoneVerification.verified)
      console.log('만료 시간:', phoneVerification.expiresAt)
    }
    
  } catch (error) {
    console.error('❌ 에러:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()

