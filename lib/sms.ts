// SMS 인증 서비스 인터페이스
// 테스트 모드와 실제 SMS 서비스를 쉽게 교체할 수 있도록 설계

export interface SMSService {
  sendVerificationCode(phone: string, code: string): Promise<boolean>
}

// 테스트용 SMS 서비스 (콘솔 출력)
export class MockSMSService implements SMSService {
  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📱 [테스트 모드] SMS 인증번호 발송')
    console.log(`전화번호: ${phone}`)
    console.log(`인증번호: ${code}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return true
  }
}

// 알리고 SMS 서비스 (실제 사용 시)
export class AligoSMSService implements SMSService {
  private apiKey: string
  private userId: string
  private sender: string

  constructor() {
    this.apiKey = process.env.ALIGO_API_KEY || ''
    this.userId = process.env.ALIGO_USER_ID || ''
    this.sender = process.env.ALIGO_SENDER || ''
  }

  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    try {
      // 알리고 API 호출
      // const response = await fetch('https://apis.aligo.in/send/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //   body: new URLSearchParams({
      //     key: this.apiKey,
      //     user_id: this.userId,
      //     sender: this.sender,
      //     receiver: phone,
      //     msg: `[토토픽] 인증번호는 [${code}]입니다.`,
      //   }),
      // })
      // return response.ok

      console.log('알리고 SMS 발송 예정:', phone, code)
      return true
    } catch (error) {
      console.error('SMS 발송 실패:', error)
      return false
    }
  }
}

// SMS 서비스 팩토리
export function getSMSService(): SMSService {
  const mode = process.env.SMS_MODE || 'test'
  
  // 실제 SMS 발송 모드
  if (mode === 'production') {
    return new AligoSMSService()
  }
  
  // 테스트/시뮬레이션 모드 (콘솔 출력)
  return new MockSMSService()
}

// 6자리 랜덤 인증번호 생성
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


