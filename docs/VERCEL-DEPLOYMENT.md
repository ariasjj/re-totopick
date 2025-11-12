# 🚀 Vercel 배포 가이드

> **초보자도 쉽게 따라할 수 있는 Vercel 배포 완벽 가이드**

---

## 📋 목차

1. [배포 전 준비사항](#배포-전-준비사항)
2. [GitHub에 코드 업로드](#github에-코드-업로드)
3. [Vercel 배포하기](#vercel-배포하기)
4. [환경변수 설정](#환경변수-설정)
5. [도메인 연결](#도메인-연결)
6. [배포 확인](#배포-확인)
7. [문제 해결](#문제-해결)

---

## 배포 전 준비사항

### ✅ 체크리스트

- [ ] Node.js 설치 완료
- [ ] 프로젝트가 로컬에서 정상 작동
- [ ] GitHub 계정 있음
- [ ] Vercel 계정 준비 (GitHub으로 가입 가능)
- [ ] Supabase 데이터베이스 준비됨

### 📦 필요한 것들

1. **GitHub 계정** - https://github.com
2. **Vercel 계정** - https://vercel.com (GitHub 계정으로 가입 가능)
3. **Supabase 계정** - https://supabase.com (이미 있음)

---

## GitHub에 코드 업로드

### 1단계: GitHub 저장소 만들기

#### 방법 1: GitHub 웹사이트에서

1. https://github.com 접속
2. 우측 상단 **+** 클릭 → **New repository**
3. 저장소 설정:
   - Repository name: `totopick`
   - Description: `토토픽 커뮤니티 웹사이트`
   - **Private** 선택 (보안상)
   - ❌ **Add a README file** 체크 해제 (이미 있음)
4. **Create repository** 클릭

### 2단계: Git 초기화 (아직 안 했다면)

```bash
# 프로젝트 폴더로 이동
cd c:\Users\ADMIN\Desktop\totopick

# Git 초기화 (이미 되어있다면 생략)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: 토토픽 프로젝트 초기 버전"
```

### 3단계: GitHub에 업로드

```bash
# GitHub 저장소 연결 (본인의 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/totopick.git

# 기본 브랜치를 main으로 설정
git branch -M main

# GitHub에 업로드
git push -u origin main
```

**⚠️ 주의**: `YOUR_USERNAME`을 본인의 GitHub 사용자명으로 변경하세요!

### 4단계: GitHub에서 확인

1. https://github.com/YOUR_USERNAME/totopick 접속
2. 파일들이 업로드되었는지 확인

---

## Vercel 배포하기

### 1단계: Vercel 계정 만들기

1. https://vercel.com 접속
2. **Sign Up** 클릭
3. **Continue with GitHub** 선택
4. GitHub 계정으로 로그인
5. Vercel이 GitHub 접근 권한 요청 → **Authorize** 클릭

### 2단계: 새 프로젝트 만들기

1. Vercel 대시보드에서 **Add New...** → **Project** 클릭
2. **Import Git Repository** 섹션에서 `totopick` 저장소 찾기
3. **Import** 클릭

### 3단계: 프로젝트 설정

#### Build and Output Settings

이미 자동으로 감지되어 있을 것입니다:

```
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Install Command: npm install
```

그대로 두면 됩니다!

#### Root Directory

`.` (기본값) 그대로 유지

---

## 환경변수 설정

### ⚠️ 중요! 배포 전에 반드시 설정해야 합니다

Vercel 프로젝트 설정 페이지에서:

#### 1. Environment Variables 섹션

다음 환경변수들을 **하나씩** 추가합니다:

#### 필수 환경변수

```bash
# 1. DATABASE_URL
Name: DATABASE_URL
Value: postgresql://postgres.[프로젝트ID]:[비밀번호]@[호스트]:5432/postgres?pgbouncer=true

# Supabase Session Pooler URL 사용!
# 예시: postgresql://postgres.abc123:password@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true

# 2. NEXTAUTH_SECRET (새로 생성)
Name: NEXTAUTH_SECRET
Value: [아래 명령어로 생성한 값]

# 3. NEXTAUTH_URL (배포 후 변경 필요)
Name: NEXTAUTH_URL
Value: https://totopick.vercel.app

# 4. SMS_MODE
Name: SMS_MODE
Value: test

# 5. CRON_SECRET (자동 게시글용)
Name: CRON_SECRET
Value: [아래 명령어로 생성한 값]
```

#### 비밀키 생성 방법

PowerShell에서 실행:

```bash
# NEXTAUTH_SECRET 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 복사해서 Vercel에 붙여넣기

# CRON_SECRET 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 복사해서 Vercel에 붙여넣기
```

#### 환경변수 입력 팁

1. **Name**: 정확히 입력 (대소문자 구분)
2. **Value**: 복사-붙여넣기 (오타 방지)
3. **Environment**: `Production`, `Preview`, `Development` 모두 선택
4. **Add** 버튼 클릭

### 📸 환경변수 설정 화면 예시

```
┌─────────────────────────────────────────────┐
│ Environment Variables                        │
├─────────────────────────────────────────────┤
│ Name:  DATABASE_URL                         │
│ Value: postgresql://postgres...             │
│ Environments: ☑ Production                  │
│               ☑ Preview                      │
│               ☑ Development                  │
│                                    [Add]     │
└─────────────────────────────────────────────┘
```

---

## 배포하기!

### 모든 설정이 완료되면

1. 아래로 스크롤
2. **Deploy** 버튼 클릭 (큰 파란 버튼)
3. 배포 시작! ⏳

### 배포 과정 (약 2-3분 소요)

```
Building...
  ├─ Installing dependencies... ✓
  ├─ Building application... ✓
  ├─ Generating static pages... ✓
  └─ Finalizing... ✓

Deploying...
  └─ Deployment complete! ✓

🎉 Your project is live!
```

### 배포 완료!

배포가 완료되면 다음과 같은 URL을 받게 됩니다:

```
https://totopick.vercel.app
```

또는

```
https://totopick-[랜덤문자].vercel.app
```

---

## 배포 후 설정

### 1. NEXTAUTH_URL 업데이트

배포된 URL을 확인했다면:

1. Vercel 대시보드 → **Settings** → **Environment Variables**
2. `NEXTAUTH_URL` 찾기
3. **Edit** 클릭
4. Value를 실제 배포 URL로 변경:
   ```
   https://totopick.vercel.app
   ```
5. **Save** 클릭
6. **Redeploy** 필요 (자동으로 다시 배포됨)

### 2. 데이터베이스 마이그레이션

배포된 사이트에서 데이터베이스가 비어있을 수 있습니다.

#### 로컬에서 프로덕션 DB에 시드 실행

```bash
# .env.local에 프로덕션 DATABASE_URL이 있는지 확인
npm run db:seed
```

또는 Vercel에서 실행:

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Functions**
3. 또는 로컬에서 프로덕션 DB로 시드

---

## 도메인 연결

### 커스텀 도메인 (totopick.com) 연결하기

#### 1단계: 도메인 구매

- **GoDaddy**: https://www.godaddy.com
- **Namecheap**: https://www.namecheap.com
- **가비아**: https://www.gabia.com (한국)
- **후이즈**: https://www.whois.co.kr (한국)

#### 2단계: Vercel에 도메인 추가

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Domains**
3. 도메인 입력: `totopick.com`
4. **Add** 클릭

#### 3단계: DNS 설정

Vercel이 제공하는 DNS 정보를 도메인 제공업체에 추가:

```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 4단계: 확인

- DNS 전파: 최대 48시간 소요 (보통 1-2시간)
- https://totopick.com 접속 확인

---

## Cron Jobs 설정

자동 게시글 기능을 위해 Cron Jobs 확인:

1. Vercel 대시보드 → 프로젝트 선택
2. **Cron Jobs** 탭 클릭
3. `/api/cron/auto-post` 확인
4. 스케줄: `0 9,15,21 * * *` (매일 9시, 15시, 21시)

### 수동 테스트

**Test** 버튼 클릭하여 즉시 실행 가능!

---

## 배포 확인

### ✅ 체크리스트

- [ ] 사이트 접속 가능 (https://totopick.vercel.app)
- [ ] 로그인 작동
- [ ] 회원가입 작동
- [ ] 게시판 확인
- [ ] 관리자 페이지 접속 (/admin)
- [ ] Cron Jobs 작동

### 테스트 계정

```
관리자 계정:
- 이메일: admin@totopick.com
- 비밀번호: admin123!@#

테스트 계정:
- 이메일: test@test.com
- 비밀번호: test123!@#
```

---

## 업데이트 배포

코드를 수정한 후 다시 배포하는 방법:

```bash
# 1. 변경사항 저장
git add .
git commit -m "설명 메시지"

# 2. GitHub에 푸시
git push

# 3. Vercel이 자동으로 다시 배포! 🎉
```

**자동 배포**: GitHub에 푸시하면 Vercel이 자동으로 감지하고 재배포합니다!

---

## 문제 해결

### Q1: 배포 실패 (Build Error)

#### 원인: 빌드 중 에러 발생

**해결 방법**:

1. Vercel 대시보드 → **Deployments** → 실패한 배포 클릭
2. 로그 확인
3. 일반적인 원인:
   - 환경변수 누락
   - 타입스크립트 에러
   - 패키지 의존성 문제

#### 로컬에서 빌드 테스트

```bash
npm run build
```

에러가 나지 않으면 배포도 성공합니다!

### Q2: 데이터베이스 연결 실패

#### 원인: DATABASE_URL이 잘못되었거나 없음

**해결 방법**:

1. Supabase Session Pooler URL 사용 확인
2. `?pgbouncer=true` 포함 확인
3. 비밀번호 특수문자 URL 인코딩:
   - `@` → `%40`
   - `#` → `%23`
   - `!` → `%21`

### Q3: 로그인 안 됨

#### 원인: NEXTAUTH_URL이 잘못됨

**해결 방법**:

1. `NEXTAUTH_URL`을 실제 배포 URL로 변경
2. `https://` 포함 확인
3. 환경변수 저장 후 **Redeploy**

### Q4: 500 Internal Server Error

#### 원인: 서버 측 에러

**해결 방법**:

1. Vercel 대시보드 → **Logs** 확인
2. 실시간 로그 보기:
   ```bash
   vercel logs
   ```
3. 환경변수 모두 설정되었는지 확인

### Q5: Cron이 실행되지 않음

#### 원인: CRON_SECRET 누락

**해결 방법**:

1. `CRON_SECRET` 환경변수 추가
2. Cron Jobs 탭에서 **Test** 버튼으로 수동 실행
3. 로그 확인

---

## 성능 최적화

### 1. 이미지 최적화

Next.js의 `Image` 컴포넌트 사용:

```typescript
import Image from 'next/image'

<Image 
  src="/banners/sample1.jpg" 
  width={800} 
  height={400} 
  alt="배너"
/>
```

### 2. 정적 생성 (SSG)

자주 바뀌지 않는 페이지는 정적 생성:

```typescript
export const revalidate = 3600 // 1시간마다 재생성
```

### 3. 데이터베이스 쿼리 최적화

- 필요한 필드만 select
- include 대신 필요한 관계만 포함
- pagination 활용

---

## Vercel 무료 플랜 제한

### 제한사항

- **대역폭**: 100GB/월
- **빌드**: 6,000분/월
- **서버리스 함수 실행**: 100GB-시간
- **이미지 최적화**: 1,000장
- **Cron Jobs**: 무료 사용 가능

### 초과 시

- 유료 플랜으로 업그레이드 ($20/월)
- 또는 다른 배포 옵션 고려

---

## 모니터링

### Vercel Analytics

1. Vercel 대시보드 → **Analytics**
2. 방문자 수, 페이지 뷰 등 확인
3. 무료 플랜에서도 사용 가능!

### 로그 모니터링

```bash
# 실시간 로그 보기
vercel logs --follow

# 특정 함수 로그
vercel logs --function /api/auth
```

---

## 백업

### 정기 백업 권장

#### 데이터베이스 백업 (Supabase)

1. Supabase 대시보드
2. Database → Backups
3. 자동 백업 설정

#### 코드 백업 (GitHub)

- 이미 GitHub에 있으므로 안전!
- 정기적으로 `git push`

---

## 보안 체크리스트

### 배포 후 확인

- [ ] 환경변수가 코드에 노출되지 않았는지 확인
- [ ] `.env.local` 파일이 GitHub에 업로드되지 않았는지 확인 (.gitignore 확인)
- [ ] 관리자 비밀번호 변경
- [ ] HTTPS 작동 확인 (Vercel은 기본 제공)
- [ ] CORS 설정 확인
- [ ] Rate limiting 설정 (필요시)

---

## 비용 계산

### 예상 월 비용

```
Vercel (무료 플랜): $0
Supabase (무료 플랜): $0
도메인: $10-20/년
SMS 인증 (배포 시): 사용량에 따라

총 예상 비용: 월 $0-5
```

### 유료 플랜이 필요한 경우

- 월 방문자 10만 명 이상
- 대용량 이미지 많이 사용
- 실시간 기능 많이 사용

---

## 다음 단계

### 배포 완료 후

1. ✅ 사이트 테스트
2. ✅ 도메인 연결
3. ✅ SMS 인증 전환 (배포 가이드 참고)
4. ✅ Google Analytics 추가
5. ✅ SEO 최적화
6. ✅ 사용자 모집 시작!

---

## 추가 자료

### 공식 문서

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 배포**: https://nextjs.org/docs/deployment
- **Supabase 문서**: https://supabase.com/docs

### 한국어 자료

- Vercel 한국어 가이드 (구글 검색)
- Next.js 한국어 문서
- 개발 커뮤니티 (디스코드, 슬랙)

---

## 🎉 축하합니다!

**토토픽 사이트가 전 세계에 공개되었습니다!**

이제 사용자들이 접속할 수 있습니다!

**URL**: https://totopick.vercel.app

---

**문제가 생기면 언제든지 문의하세요!** 😊

