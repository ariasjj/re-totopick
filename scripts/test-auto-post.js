// 자동 게시글 API 테스트 스크립트
// 사용법: node scripts/test-auto-post.js

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const cronSecret = process.env.CRON_SECRET || 'test-secret'

async function testAutoPost() {
  console.log('🚀 자동 게시글 API 테스트 시작...\n')
  console.log(`📍 URL: ${baseUrl}/api/cron/auto-post`)
  console.log(`🔐 Secret: ${cronSecret}\n`)

  try {
    const response = await fetch(`${baseUrl}/api/cron/auto-post`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`
      }
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ 성공!')
      console.log(`\n📊 결과:`)
      console.log(`- 생성된 게시글: ${data.posts.length}개`)
      console.log(`- 작성자: ${data.author}`)
      console.log(`- 시간: ${new Date(data.timestamp).toLocaleString('ko-KR')}`)
      
      if (data.posts.length > 0) {
        console.log(`\n📝 생성된 게시글:`)
        data.posts.forEach((post, index) => {
          console.log(`${index + 1}. [${post.board}] ${post.title} (ID: ${post.id})`)
        })
      }

      if (data.errors && data.errors.length > 0) {
        console.log(`\n⚠️ 오류:`)
        data.errors.forEach(error => {
          console.log(`- ${error.board}: ${error.error}`)
        })
      }
    } else {
      console.log('❌ 실패!')
      console.log(`\n오류: ${data.error}`)
      console.log(`메시지: ${data.message || data.details}`)
    }
  } catch (error) {
    console.error('❌ 네트워크 오류:', error.message)
    console.error('\n💡 해결 방법:')
    console.error('1. 서버가 실행 중인지 확인 (npm run dev)')
    console.error('2. URL이 올바른지 확인')
    console.error('3. 네트워크 연결 확인')
  }
}

testAutoPost()

