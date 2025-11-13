# 회원가입 및 로그인 시스템 구축 가이드

> 이 문서는 TOTOPICK 프로젝트에서 경험한 실제 문제들과 해결 방법을 바탕으로 작성되었습니다.
> 에러 없는 안정적인 인증 시스템을 구축하는 방법을 단계별로 설명합니다.

## 📋 목차

1. [기본 원칙](#기본-원칙)
2. [데이터베이스 스키마 설계](#데이터베이스-스키마-설계)
3. [회원가입 폼 구현](#회원가입-폼-구현)
4. [전화번호 인증 시스템](#전화번호-인증-시스템)
5. [로그인 시스템](#로그인-시스템)
6. [흔한 에러와 해결 방법](#흔한-에러와-해결-방법)
7. [테스트 방법](#테스트-방법)
8. [배포 체크리스트](#배포-체크리스트)

---

## 기본 원칙

### ✅ 해야 할 것

1. **Controlled Inputs 사용**
   - React의 `useState`를 사용한 controlled inputs
   - 모든 입력 필드의 상태를 명확하게 관리
   - 실시간 유효성 검사 가능

2. **명확한 사용자 피드백**
   - 각 단계마다 명확한 메시지 표시
   - 성공/실패를 시각적으로 구분
   - 로딩 상태 표시

3. **단계별 프로세스**
   - 회원가입을 명확한 단계로 분리
   - 각 단계의 완료 여부를 명확히 표시
   - 다음 단계로 넘어가기 전 확인

4. **에러 처리**
   - 모든 API 호출에 try-catch
   - 사용자에게 이해하기 쉬운 에러 메시지
   - 콘솔에 상세한 디버깅 로그

### ❌ 피해야 할 것

1. **React Hook Form + 브라우저 자동화**
   - 브라우저 자동화 도구와 호환성 문제 발생
   - onChange 이벤트가 제대로 트리거되지 않음
   - 순수 React state 사용 권장

2. **Uncontrolled Inputs (useRef)**
   - 유효성 검사가 어려움
   - 실시간 피드백 불가능
   - 상태 추적 어려움

3. **자동 로그인**
   - 회원가입 직후 자동 로그인은 혼란 초래
   - 사용자가 계정 생성을 명확히 인지하도록
   - 성공 메시지 후 로그인 페이지로 이동

4. **복잡한 폼 라이브러리**
   - 초보자에게는 순수 React가 더 명확
   - 디버깅이 쉬움
   - 문제 발생 시 해결이 간단

---

## 데이터베이스 스키마 설계

### User 모델 (Prisma 예시)

```prisma
model User {
  id            String    @id @default(cuid())
  username      String    @unique // 아이디 (로그인용)
  email         String    @unique
  password      String    // bcrypt 해시
  nickname      String    @unique
  phone         String?   @unique
  phoneVerified Boolean   @default(false)
  role          UserRole  @default(USER)
  points        Int       @default(1000) // 가입 축하 포인트
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 인덱스
  @@index([email])
  @@index([username])
  @@index([nickname])
}

enum UserRole {
  USER
  ADMIN
  GUEST
}
```

### PhoneVerification 모델

```prisma
model PhoneVerification {
  id        String   @id @default(cuid())
  phone     String
  code      String
  verified  Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([phone, verified])
}
```

### 중요 포인트

1. **username 필드 필수**
   - 이메일과 별도의 아이디 필드
   - 로그인 시 이메일 또는 아이디 사용 가능
   - 사용자 편의성 향상

2. **고유 제약 조건**
   - username, email, nickname, phone 모두 unique
   - 중복 가입 방지

3. **인덱스 설정**
   - 자주 검색되는 필드에 인덱스 추가
   - 로그인 성능 향상

4. **전화번호 인증 분리**
   - 별도 테이블로 관리
   - 만료 시간 추적 가능
   - 재사용 방지

---

## 회원가입 폼 구현

### 기본 구조

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function SignUpForm() {
  const router = useRouter()
  
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // 폼 데이터
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

  // 인증 상태
  const [codeSent, setCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  
  // ... 나머지 구현
}
```

### 유효성 검사 함수

```typescript
const validateForm = () => {
  setError("") // 에러 초기화

  if (!username.trim() || username.length < 4) {
    setError("아이디는 4자 이상이어야 합니다.")
    return false
  }
  
  if (!email.trim() || !email.includes("@")) {
    setError("올바른 이메일 형식을 입력하세요.")
    return false
  }
  
  if (!password.trim() || password.length < 6) {
    setError("비밀번호는 최소 6자 이상이어야 합니다.")
    return false
  }
  
  if (password !== passwordConfirm) {
    setError("비밀번호가 일치하지 않습니다.")
    return false
  }
  
  if (!nickname.trim() || nickname.length < 2) {
    setError("닉네임은 2자 이상이어야 합니다.")
    return false
  }
  
  if (!phone.trim() || !/^010\d{8}$/.test(phone)) {
    setError("올바른 전화번호(010으로 시작하는 11자리 숫자)를 입력하세요.")
    return false
  }
  
  if (!codeVerified) {
    setError("전화번호 인증을 완료해야 합니다.")
    return false
  }
  
  return true
}
```

### 입력 필드 구현

```typescript
<Input
  name="username"
  placeholder="4자 이상 (영문, 숫자, _)"
  value={username}
  onChange={(e) => {
    setUsername(e.target.value)
    setError("") // 입력 시 에러 초기화
  }}
  disabled={isLoading}
/>
```

### 핵심 원칙

1. **Controlled Inputs**
   - value와 onChange 항상 함께 사용
   - 상태를 명확하게 관리

2. **에러 초기화**
   - 새로운 입력 시 이전 에러 메시지 제거
   - 사용자 경험 개선

3. **Loading 상태**
   - API 호출 중 폼 비활성화
   - 중복 제출 방지

---

## 전화번호 인증 시스템

### SMS 서비스 추상화

```typescript
// lib/sms.ts
export interface SMSService {
  sendVerificationCode(phone: string, code: string): Promise<void>
}

export class MockSMSService implements SMSService {
  async sendVerificationCode(phone: string, code: string): Promise<void> {
    console.log(`[Mock SMS] ${phone}에 인증번호 발송: ${code}`)
  }
}

export class AligoSMSService implements SMSService {
  async sendVerificationCode(phone: string, code: string): Promise<void> {
    // 실제 SMS 발송 로직
  }
}

export function getSMSService(): SMSService {
  const mode = process.env.SMS_MODE || 'test'
  
  if (mode === 'production') {
    return new AligoSMSService()
  }
  
  return new MockSMSService()
}
```

### 인증번호 발송

```typescript
const sendCode = async () => {
  // 전화번호 검증
  if (!phone || phone.trim() === "") {
    alert("❌ 전화번호를 입력해주세요")
    return
  }
  
  if (phone.length !== 11) {
    alert(`❌ 전화번호는 정확히 11자리여야 합니다\n(현재 ${phone.length}자리 입력됨)`)
    return
  }
  
  if (!/^010\d{8}$/.test(phone)) {
    alert("❌ 전화번호는 010으로 시작해야 합니다")
    return
  }

  setIsLoading(true)
  setError("")
  
  try {
    const res = await fetch("/api/auth/phone/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    })

    const data = await res.json()

    if (data.code) {
      setTestCode(data.code)
      alert(`✅ 테스트 인증번호: ${data.code}\n\n위 번호를 입력해주세요`)
    }

    setCodeSent(true)
  } catch (err) {
    setError("인증번호 발송 중 오류가 발생했습니다.")
  } finally {
    setIsLoading(false)
  }
}
```

### 인증번호 확인

```typescript
const verifyCode = async () => {
  if (verificationCode.length !== 6) {
    setError("6자리 인증번호를 입력하세요.")
    return
  }

  try {
    setIsLoading(true)
    setError("")

    const res = await fetch("/api/auth/phone/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        code: verificationCode,
        testMode: testCode !== ""
      }),
    })

    if (res.ok) {
      setCodeVerified(true)
      alert("✅ 인증이 완료되었습니다!")
    } else {
      const data = await res.json()
      setError(data.error || "인증에 실패했습니다.")
    }
  } catch (err) {
    setError("인증 중 오류가 발생했습니다.")
  } finally {
    setIsLoading(false)
  }
}
```

### 타임아웃 설정

```typescript
const timeoutPromise = new Promise((resolve) => 
  setTimeout(() => resolve({ timeout: true }), 10000)
)

const result = await Promise.race([fetchPromise, timeoutPromise])

if (result && typeof result === 'object' && 'timeout' in result) {
  throw new Error("인증번호 발송 요청 시간 초과 (10초)")
}
```

### 핵심 원칙

1. **테스트 모드**
   - 개발 환경에서 실제 SMS 발송 불필요
   - 콘솔에 인증번호 표시
   - 비용 절감

2. **타임아웃 설정**
   - 10초 제한
   - 무한 대기 방지
   - 자동으로 테스트 모드 전환

3. **명확한 피드백**
   - 각 단계마다 alert 또는 시각적 피드백
   - 사용자가 다음에 무엇을 해야 하는지 명확히 안내

4. **유효 시간**
   - 인증번호 10분 유효
   - 만료 시간 추적
   - 재발송 기능 제공

---

## 로그인 시스템

### NextAuth 설정

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 이메일 또는 아이디로 사용자 찾기
        const isEmail = credentials.email.includes('@')
        const user = await prisma.user.findUnique({
          where: isEmail 
            ? { email: credentials.email }
            : { username: credentials.email },
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nickname,
          role: user.role,
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
}
```

### 로그인 폼

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // 검증
  if (!identifier || !identifier.trim()) {
    setError("이메일 또는 아이디를 입력해주세요")
    return
  }

  if (!password || !password.trim()) {
    setError("비밀번호를 입력해주세요")
    return
  }

  setIsLoading(true)
  setError("")

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: identifier, // 이메일 또는 아이디
      password: password,
    })

    if (result?.error) {
      const errorMsg = result.error === "CredentialsSignin"
        ? "이메일/아이디 또는 비밀번호가 올바르지 않습니다."
        : result.error
      setError(errorMsg)
    } else {
      router.push("/") // 홈으로 리다이렉트
    }
  } catch (err) {
    setError("로그인 중 오류가 발생했습니다.")
  } finally {
    setIsLoading(false)
  }
}
```

### 핵심 원칙

1. **이중 인증 방식**
   - 이메일 또는 아이디로 로그인
   - `@` 포함 여부로 구분
   - 사용자 편의성 향상

2. **명확한 에러 메시지**
   - "CredentialsSignin" → 사용자 친화적 메시지로 변환
   - 구체적인 실패 이유 제공

3. **세션 관리**
   - JWT 전략 사용
   - 30일 유효 기간
   - 자동 연장

---

## 흔한 에러와 해결 방법

### 1. 회원가입 후 로그인 실패

**증상:**
```
이메일/아이디 또는 비밀번호가 올바르지 않습니다.
```

**원인:**
- 데이터베이스에 사용자가 생성되지 않음
- 회원가입 API 호출 실패
- 전화번호 인증이 완료되지 않음

**해결:**
```typescript
// 1. 회원가입 API에 상세 로그 추가
console.log('🔵 회원가입 API 호출됨')
console.log('🔵 받은 데이터:', { ...body, password: '***' })

// 2. 전화번호 인증 확인
const verification = await prisma.phoneVerification.findFirst({
  where: {
    phone,
    verified: true,
    expiresAt: { gt: new Date() },
  },
})

if (!verification) {
  console.log('❌ 전화번호 미인증 또는 만료')
  return NextResponse.json(
    { error: "전화번호 인증이 필요하거나 만료되었습니다." },
    { status: 400 }
  )
}

// 3. 성공 시 명확한 피드백
console.log('✅ 사용자 생성 완료:', user.username)
```

### 2. 전화번호 인증번호가 안 옴

**증상:**
- "인증번호 발송 중 오류가 발생했습니다"
- 인증번호를 받지 못함

**원인:**
- `SMS_MODE` 환경 변수 미설정
- SMS 서비스 API 키 오류
- 네트워크 타임아웃

**해결:**
```bash
# 환경 변수 설정
SMS_MODE=test  # 개발 환경
SMS_MODE=production  # 운영 환경

# Vercel에서도 동일하게 설정
```

```typescript
// 타임아웃 추가
const timeoutPromise = new Promise((resolve) => 
  setTimeout(() => resolve({ timeout: true }), 10000)
)

const result = await Promise.race([fetchPromise, timeoutPromise])

if (result?.timeout) {
  // 자동으로 테스트 모드 전환
  setTestCode("123456")
  setCodeSent(true)
}
```

### 3. 브라우저 자동화 테스트 실패

**증상:**
- 입력 필드에 값이 보이지만 상태가 업데이트되지 않음
- `onChange` 이벤트가 트리거되지 않음

**원인:**
- React Hook Form과 브라우저 자동화 도구의 호환성 문제
- Controlled inputs의 이벤트 처리 방식

**해결:**
```typescript
// ❌ 나쁜 예: React Hook Form 사용
const { register, handleSubmit } = useForm()

// ✅ 좋은 예: 순수 React state 사용
const [username, setUsername] = useState("")

<Input
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
```

### 4. DATABASE_URL 연결 오류

**증상:**
```
FATAL: Tenant or user not found
```

**원인:**
- 잘못된 데이터베이스 URL
- 비밀번호 URL 인코딩 필요
- `?pgbouncer=true` 누락

**해결:**
```bash
# 특수 문자 URL 인코딩
! → %21
@ → %40
# → %23

# 예시
MySecurePass123! → MySecurePass123%21

# 완전한 URL
DATABASE_URL="postgresql://user:MySecurePass123%21@host:5432/db?pgbouncer=true"
```

### 5. Prisma 스키마 변경 후 에러

**증상:**
```
Added the required column 'username' to the 'User' table without a default value.
```

**원인:**
- 기존 데이터가 있는 상태에서 NOT NULL 컬럼 추가

**해결:**
```bash
# 개발 환경: 데이터베이스 재설정
npm run db:push -- --force-reset
npm run db:seed

# 운영 환경: 마이그레이션 사용
npx prisma migrate dev --name add_username
```

### 6. 회원가입 버튼을 눌렀는데 아무 일도 안 생김

**증상:**
- 인증 완료 후 회원가입 버튼 클릭해도 반응 없음
- 데이터베이스에 사용자 생성 안 됨

**원인:**
- 사용자가 회원가입 버튼을 클릭하지 않음
- UI가 명확하지 않아 혼란

**해결:**
```typescript
// 명확한 안내 메시지 추가
{phoneVerified && (
  <div className="bg-red-50 border-2 border-red-400 rounded-lg p-5">
    <p className="text-lg font-bold text-red-900">
      🚨 중요: 회원가입이 아직 완료되지 않았습니다!
    </p>
    <p className="text-base font-semibold text-red-800">
      반드시 아래 '회원가입 완료하기' 버튼을 클릭해야 합니다!
    </p>
  </div>
)}

// 버튼 텍스트 명확하게
<Button disabled={!phoneVerified}>
  {!phoneVerified ? "⚠️ 전화번호 인증 필요" : "🎉 회원가입 완료하기"}
</Button>
```

---

## 테스트 방법

### 로컬 테스트

```bash
# 1. 데이터베이스 초기화
npm run db:push

# 2. 시드 데이터 생성
npm run db:seed

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 테스트
# http://localhost:3000/auth/signup
```

### 회원가입 테스트 체크리스트

- [ ] 모든 필드에 올바른 데이터 입력
- [ ] 전화번호 "인증번호" 버튼 클릭
- [ ] 테스트 인증번호 확인 (콘솔 또는 alert)
- [ ] 인증번호 입력 후 "확인" 버튼 클릭
- [ ] "✅ 전화번호 인증 완료!" 메시지 확인
- [ ] **"회원가입 완료하기" 버튼 클릭** ← 중요!
- [ ] 성공 화면 표시 확인 (1,000P 지급)
- [ ] "로그인하러 가기" 버튼 클릭

### 로그인 테스트 체크리스트

- [ ] 아이디로 로그인 테스트
- [ ] 이메일로 로그인 테스트
- [ ] 잘못된 비밀번호로 실패 테스트
- [ ] 존재하지 않는 사용자로 실패 테스트
- [ ] 로그인 후 세션 확인
- [ ] 로그아웃 후 재로그인

### 사용자 생성 확인 스크립트

```typescript
// scripts/check-user.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  const username = process.argv[2]
  
  if (!username) {
    console.log('사용법: npm run check-user <username>')
    return
  }
  
  const user = await prisma.user.findUnique({
    where: { username }
  })
  
  if (user) {
    console.log('✅ 사용자 발견!')
    console.log('아이디:', user.username)
    console.log('이메일:', user.email)
    console.log('닉네임:', user.nickname)
    console.log('포인트:', user.points)
    console.log('생성일:', user.createdAt)
  } else {
    console.log('❌ 사용자를 찾을 수 없습니다')
  }
  
  await prisma.$disconnect()
}

checkUser()
```

```bash
# 사용법
npx tsx scripts/check-user.ts testuser
```

---

## 배포 체크리스트

### Vercel 환경 변수 설정

```bash
# 필수 환경 변수
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="랜덤한_긴_문자열"
NEXTAUTH_URL="https://yourdomain.com"

# SMS 관련
SMS_MODE="test"  # 또는 "production"
ALIGO_API_KEY="your-api-key"  # production 모드 시
ALIGO_USER_ID="your-user-id"
ALIGO_SENDER="01012345678"

# Cron Job (자동 게시물용)
CRON_SECRET="랜덤한_긴_문자열"
```

### package.json 설정

```json
{
  "scripts": {
    "build": "prisma db push && next build",
    "postinstall": "prisma generate"
  }
}
```

### 배포 전 확인사항

- [ ] 모든 환경 변수 설정 완료
- [ ] DATABASE_URL에 `?pgbouncer=true` 포함
- [ ] 특수 문자 URL 인코딩 확인
- [ ] `prisma generate` 자동 실행 설정
- [ ] 로컬에서 프로덕션 빌드 테스트
- [ ] Git에 `.env` 파일 제외 확인
- [ ] 배포 후 회원가입 테스트
- [ ] 배포 후 로그인 테스트

### 배포 후 테스트

```bash
# 1. Vercel 로그 확인
vercel logs

# 2. 데이터베이스 연결 확인
# Vercel Dashboard → Deployments → 최신 배포 → Logs

# 3. 회원가입 테스트
# https://yourdomain.com/auth/signup

# 4. 로그인 테스트
# https://yourdomain.com/auth/signin
```

---

## 모범 사례 요약

### 1. 폼 구현

✅ **Do:**
- Controlled inputs (useState 사용)
- 실시간 유효성 검사
- 명확한 에러 메시지
- 로딩 상태 표시

❌ **Don't:**
- React Hook Form (브라우저 자동화와 호환성 문제)
- Uncontrolled inputs (useRef)
- 복잡한 폼 라이브러리

### 2. 인증 시스템

✅ **Do:**
- 테스트 모드 구현
- 타임아웃 설정
- 명확한 단계별 안내
- 인증 완료 시각적 피드백

❌ **Don't:**
- 실제 SMS 발송만 의존
- 무한 대기
- 애매한 UI
- 자동 진행 (사용자 확인 필요)

### 3. 에러 처리

✅ **Do:**
- 모든 API 호출에 try-catch
- 상세한 콘솔 로그
- 사용자 친화적 메시지
- 개발자 도구로 디버깅 가능

❌ **Don't:**
- 에러 무시
- 기술적인 에러 메시지 그대로 표시
- 로그 없이 실패

### 4. 사용자 경험

✅ **Do:**
- 각 단계마다 명확한 피드백
- 다음에 무엇을 해야 하는지 안내
- 시각적 성공/실패 표시
- 성공 시 축하 메시지

❌ **Don't:**
- 자동으로 다음 단계 진행
- 애매한 상태 표시
- 성공 여부 불명확

---

## 결론

이 가이드는 TOTOPICK 프로젝트에서 실제로 발생한 문제들과 해결 과정을 정리한 것입니다.

**핵심 교훈:**

1. **단순함이 최고** - 복잡한 라이브러리보다 순수 React가 더 안정적
2. **명확한 피드백** - 사용자가 현재 어느 단계인지 항상 알 수 있게
3. **철저한 테스트** - 각 단계를 개별적으로 테스트
4. **상세한 로그** - 문제 발생 시 빠른 디버깅 가능
5. **사용자 중심** - 기술적 완벽함보다 사용자 경험 우선

이 가이드를 따르면 에러 없는 안정적인 회원가입 및 로그인 시스템을 구축할 수 있습니다.

---

## 참고 자료

- [NextAuth.js 공식 문서](https://next-auth.js.org/)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [React Hook 공식 문서](https://react.dev/reference/react)
- [Vercel 배포 가이드](https://vercel.com/docs)

---

**작성일:** 2025-11-13  
**프로젝트:** TOTOPICK  
**버전:** 1.0

