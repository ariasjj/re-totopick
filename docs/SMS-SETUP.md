# SMS 인증 서비스 전환 가이드

TOTOPICK은 개발 단계에서는 테스트 모드 SMS를 사용하고, 프로덕션에서는 실제 SMS 서비스로 쉽게 전환할 수 있도록 설계되어 있습니다.

## 📱 현재 상태 (테스트 모드)

개발 환경에서는 실제 SMS를 발송하지 않고 콘솔에 인증번호를 출력합니다.

```typescript
// lib/sms.ts의 MockSMSService
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📱 [테스트 모드] SMS 인증번호 발송')
console.log(`전화번호: ${phone}`)
console.log(`인증번호: ${code}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
```

## 🚀 프로덕션 전환 방법

### 1. SMS 서비스 선택

한국에서 사용 가능한 주요 SMS API 서비스:

#### A. 알리고 (추천)
- **가격**: 건당 9원~15원
- **특징**: 간단한 API, 낮은 가격
- **가입**: https://smartsms.aligo.in
- **문서**: https://smartsms.aligo.in/admin/api/spec.html

#### B. 카카오 알림톡
- **가격**: 건당 8원~20원
- **특징**: 높은 도달률, 브랜드 신뢰도
- **가입**: https://business.kakao.com
- **문서**: https://developers.kakao.com/docs/latest/ko/message/common

#### C. NHN Cloud (Toast)
- **가격**: 건당 9원~
- **특징**: 대용량 발송, 기업용
- **가입**: https://www.toast.com
- **문서**: https://docs.toast.com/ko/Notification/SMS/ko/api-guide/

### 2. 알리고 설정 (예시)

#### 2-1. 알리고 가입 및 충전
1. https://smartsms.aligo.in 접속
2. 회원가입 및 로그인
3. 발신번호 등록 (본인 명의 휴대폰)
4. 충전 (최소 1만원)

#### 2-2. API 키 발급
1. 관리자 > API 설정
2. API Key 확인
3. User ID 확인

#### 2-3. 환경변수 설정

`.env.local` (개발) 또는 Vercel 환경변수 (프로덕션)에 추가:

```env
# SMS 모드 변경
SMS_MODE="production"

# 알리고 API 정보
ALIGO_API_KEY="your-api-key-here"
ALIGO_USER_ID="your-user-id"
ALIGO_SENDER="01012345678"  # 등록된 발신번호
```

### 3. 코드 수정 (필요시)

`lib/sms.ts` 파일의 `AligoSMSService` 클래스가 이미 구현되어 있습니다. 필요시 수정:

```typescript
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
      const response = await fetch('https://apis.aligo.in/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          key: this.apiKey,
          user_id: this.userId,
          sender: this.sender,
          receiver: phone,
          msg: `[토토픽] 인증번호는 [${code}]입니다.`,
        }),
      })
      return response.ok
    } catch (error) {
      console.error('SMS 발송 실패:', error)
      return false
    }
  }
}
```

### 4. 테스트

프로덕션 배포 전 로컬에서 테스트:

```bash
# .env.local 수정
SMS_MODE="production"

# 개발 서버 재시작
npm run dev

# 회원가입 테스트
# 실제 SMS가 발송되는지 확인
```

## 📊 SMS 발송 로그 및 모니터링

### 발송 성공/실패 로그
```typescript
// app/api/auth/phone/send/route.ts
const sent = await smsService.sendVerificationCode(phone, code)

if (!sent) {
  // 로그 기록 (Sentry, LogRocket 등)
  console.error('SMS 발송 실패:', { phone, timestamp: new Date() })
}
```

### 발송 통계 추적
```typescript
// 데이터베이스에 발송 기록 저장
await prisma.smsLog.create({
  data: {
    phone,
    code,
    sent: sent,
    provider: 'aligo',
    createdAt: new Date(),
  },
})
```

## 💰 비용 계산

### 예상 사용량
- 일 회원가입: 50명
- 월 총 발송: 약 1,500건
- 월 비용: **13,500원** (건당 9원 기준)

### 비용 절감 팁
1. **인증번호 유효시간 설정**: 5분으로 제한
2. **발송 제한**: IP당 하루 3회 제한
3. **캐시 활용**: 같은 번호 재발송 시 1분 대기
4. **무료 크레딧 활용**: 대부분의 서비스가 가입 시 무료 크레딧 제공

## 🔒 보안 고려사항

### 1. API 키 보호
- 절대 코드에 직접 작성하지 않기
- 환경변수 사용 필수
- `.env.local`은 `.gitignore`에 포함

### 2. 발송 제한 (Rate Limiting)
```typescript
// app/api/auth/phone/send/route.ts에 추가
const recentAttempts = await prisma.phoneVerification.count({
  where: {
    phone,
    createdAt: {
      gte: new Date(Date.now() - 60000), // 1분 이내
    },
  },
})

if (recentAttempts >= 3) {
  return NextResponse.json(
    { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
    { status: 429 }
  )
}
```

### 3. 인증번호 복잡도
- 현재: 6자리 숫자 (100,000 ~ 999,999)
- 충분히 안전하며 사용자 입력이 간편

## 🚨 문제 해결

### SMS 발송 실패 시
1. **API 키 확인**: 환경변수가 올바르게 설정되었는지 확인
2. **충전 잔액 확인**: SMS 서비스 관리자 페이지에서 잔액 확인
3. **발신번호 등록**: 발신번호가 올바르게 등록되었는지 확인
4. **로그 확인**: 서버 로그에서 상세 에러 메시지 확인

### 인증번호 수신 안됨
1. **스팸 차단**: 스팸 차단 앱 확인
2. **번호 형식**: 010으로 시작하는 11자리 확인
3. **네트워크**: 통신사 네트워크 상태 확인
4. **발송 지연**: 최대 1분 대기

## 📞 지원

- 알리고 고객센터: 1661-3796
- 카카오 비즈니스: https://center-pf.kakao.com
- NHN Cloud: https://www.toast.com/kr/support

---

**중요**: SMS 발송은 실제 비용이 발생합니다. 테스트는 충분히 로컬에서 진행한 후 프로덕션에 적용하세요.


