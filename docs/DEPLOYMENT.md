# Vercel 배포 가이드

TOTOPICK을 Vercel에 배포하는 단계별 가이드입니다.

## 📋 배포 전 체크리스트

- [ ] 로컬에서 정상 동작 확인 (`npm run dev`)
- [ ] 빌드 테스트 완료 (`npm run build`)
- [ ] Supabase 데이터베이스 준비
- [ ] GitHub 저장소 생성
- [ ] 환경변수 준비

## 🗄️ 1단계: 데이터베이스 준비 (Supabase)

### Supabase 프로젝트 생성
1. https://supabase.com 접속
2. "Start your project" 클릭
3. Organization 생성 (없는 경우)
4. "New Project" 클릭
5. 프로젝트 정보 입력:
   - Name: `totopick`
   - Database Password: 강력한 비밀번호 (저장해두기!)
   - Region: `Northeast Asia (Seoul)`
6. "Create new project" 클릭 (약 2분 소요)

### 데이터베이스 연결 정보 확인
1. 프로젝트 대시보드에서 Settings > Database
2. "Connection string" 섹션에서 "URI" 탭 선택
3. `postgresql://...` 형식의 연결 문자열 복사
4. Password 부분에 실제 비밀번호 입력

예시:
```
postgresql://postgres:YOUR_PASSWORD@db.abc.supabase.co:5432/postgres
```

## 📦 2단계: GitHub 저장소 생성

### 저장소 생성 및 푸시
```bash
# Git 초기화 (아직 안했다면)
git init

# .gitignore 확인 (.env.local이 포함되어 있는지)
cat .gitignore

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: TOTOPICK project"

# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/totopick.git

# 푸시
git branch -M main
git push -u origin main
```

## 🚀 3단계: Vercel 배포

### Vercel 프로젝트 생성
1. https://vercel.com 접속
2. "Add New..." > "Project" 클릭
3. GitHub 계정 연결 (처음이라면)
4. `totopick` 저장소 선택
5. "Import" 클릭

### 프로젝트 설정
**Framework Preset**: Next.js (자동 감지됨)
**Root Directory**: `./` (기본값)
**Build Command**: `npm run build` (자동 설정)
**Output Directory**: `.next` (자동 설정)

### 환경변수 설정
"Environment Variables" 섹션에서 다음 변수들을 추가:

```env
# 데이터베이스
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.abc.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key-min-32-chars
NEXTAUTH_URL=https://your-project-name.vercel.app

# SMS (테스트 모드)
SMS_MODE=test

# SMS (프로덕션 사용 시)
# ALIGO_API_KEY=your-api-key
# ALIGO_USER_ID=your-user-id
# ALIGO_SENDER=01012345678
```

**NEXTAUTH_SECRET 생성**:
```bash
# 터미널에서 실행
openssl rand -base64 32
```

**NEXTAUTH_URL 설정**:
- 첫 배포 후 Vercel이 자동으로 생성하는 URL 사용
- 예: `https://totopick-abc123.vercel.app`
- 커스텀 도메인 연결 후에는 해당 도메인으로 변경

### 배포 실행
"Deploy" 버튼 클릭!

배포 과정:
1. 빌드 시작 (약 2-3분)
2. 성공 시 자동으로 URL 생성
3. 실패 시 로그에서 에러 확인

## 🔧 4단계: 배포 후 설정

### 데이터베이스 초기화
배포 완료 후 데이터를 넣어야 합니다.

**방법 1: Prisma Studio 사용**
```bash
# 로컬에서 프로덕션 DB에 연결
DATABASE_URL="your-supabase-url" npx prisma studio

# 또는 .env에 프로덕션 URL 설정 후
npm run db:studio
```

**방법 2: Seed 스크립트 실행**
```bash
# 로컬에서 프로덕션 DB에 seed 실행
DATABASE_URL="your-supabase-url" npm run db:seed
```

이렇게 하면:
- 관리자 계정 생성 (`admin@totopick.com` / `admin1234`)
- 9개 게시판 생성
- 샘플 공지사항 생성

### NEXTAUTH_URL 업데이트
1. Vercel 대시보드 > Settings > Environment Variables
2. `NEXTAUTH_URL` 찾기
3. Edit 클릭
4. 실제 배포된 URL로 변경 (예: `https://totopick-abc123.vercel.app`)
5. Save
6. Redeploy (Settings > Deployments > 최신 배포 > "..." > Redeploy)

## 🌐 5단계: 커스텀 도메인 연결 (선택)

### 도메인 구매
- Namecheap, GoDaddy, 가비아 등에서 구매
- 추천: `totopick.com`

### Vercel에 도메인 추가
1. Vercel 프로젝트 > Settings > Domains
2. 도메인 입력 (예: `totopick.com`)
3. "Add" 클릭

### DNS 설정
Vercel이 제공하는 DNS 레코드를 도메인 제공업체에 추가:

**A 레코드**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 레코드** (www):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL 인증서
- Vercel이 자동으로 Let's Encrypt SSL 인증서 발급
- 약 10분 소요
- HTTPS 자동 활성화

### 환경변수 업데이트
```env
NEXTAUTH_URL=https://totopick.com
```

## 🧪 6단계: 배포 후 테스트

### 필수 테스트 항목
- [ ] 메인 페이지 로드 확인
- [ ] 회원가입 테스트 (핸드폰 인증 포함)
- [ ] 로그인 테스트
- [ ] 게시글 작성/조회 테스트
- [ ] 댓글 작성 테스트
- [ ] 출석체크 테스트
- [ ] 1:1 문의 테스트
- [ ] 관리자 로그인 및 대시보드 확인
- [ ] 모바일 반응형 확인

### 성능 테스트
- Google PageSpeed Insights: https://pagespeed.web.dev
- 목표: 모바일 70점 이상, 데스크톱 90점 이상

### 모니터링 설정
**Vercel Analytics 활성화**:
1. Vercel 프로젝트 > Analytics
2. Enable Analytics
3. 무료: 최대 10,000 방문/월

**Sentry (에러 추적) 연동** (선택):
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🔄 7단계: 지속적 배포 (CI/CD)

### 자동 배포 설정 (이미 완료)
- GitHub에 푸시하면 자동으로 Vercel 배포
- `main` 브랜치 → 프로덕션 배포
- 다른 브랜치 → 프리뷰 배포

### 배포 워크플로우
```bash
# 개발
git checkout -b feature/new-feature
# 코드 작성
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# GitHub에서 Pull Request 생성
# Vercel이 자동으로 프리뷰 배포 생성
# 확인 후 main에 병합

# 병합 시 자동으로 프로덕션 배포
```

### 롤백 방법
문제 발생 시 이전 버전으로 쉽게 롤백:
1. Vercel 대시보드 > Deployments
2. 이전 정상 배포 찾기
3. "..." > "Promote to Production"

## 📊 8단계: 운영 및 관리

### 로그 확인
- Vercel 대시보드 > Logs
- 실시간 로그 스트리밍
- 에러 추적

### 사용량 모니터링
- Vercel 대시보드 > Usage
- 함수 실행 시간
- 대역폭 사용량
- 빌드 시간

### Supabase 모니터링
- Supabase 대시보드 > Database
- 연결 수, 쿼리 성능
- 자동 백업 (7일 보관)

### 비용 관리
**Vercel (Hobby 플랜 - 무료)**:
- 월 대역폭: 100GB
- 빌드 시간: 100시간/월
- Serverless Functions: 100GB-Hours
- 충분한 트래픽 처리 가능

**Supabase (Free 플랜)**:
- 데이터베이스: 500MB
- 대역폭: 5GB/월
- API 요청: 무제한
- 소규모 커뮤니티에 충분

**업그레이드가 필요한 시점**:
- 일 방문자 1,000명 이상
- 데이터베이스 500MB 초과
- 대역폭 5GB/월 초과

## 🚨 문제 해결

### 배포 실패
**에러: "Build failed"**
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 및 수정
# 다시 푸시
```

**에러: "Database connection failed"**
- `DATABASE_URL` 환경변수 확인
- Supabase 프로젝트 활성 상태 확인
- IP 화이트리스트 확인 (Supabase는 기본 전체 허용)

### 로그인 안됨
**에러: "Invalid NEXTAUTH_URL"**
- `NEXTAUTH_URL`이 실제 배포 URL과 일치하는지 확인
- `https://` 포함 확인

### SMS 발송 안됨 (프로덕션)
- `SMS_MODE=production` 확인
- API 키 환경변수 확인
- `docs/SMS-SETUP.md` 참고

## 📈 성능 최적화

### 이미지 최적화
```jsx
// Next.js Image 컴포넌트 사용 (이미 적용됨)
import Image from 'next/image'

<Image 
  src="/logo.png" 
  width={100} 
  height={100} 
  alt="Logo"
/>
```

### 데이터베이스 인덱스
이미 중요한 컬럼에 인덱스 설정됨:
- `User.email`, `User.nickname`
- `Post.boardId`, `Post.authorId`
- `Comment.postId`

### 캐싱 전략
React Query 설정 (이미 적용됨):
- staleTime: 1분
- gcTime: 5분

## 🎉 배포 완료!

축하합니다! TOTOPICK이 성공적으로 배포되었습니다.

### 다음 단계
1. **보안 강화**: 비밀번호 변경, 2FA 설정
2. **콘텐츠 관리**: 공지사항 작성, 규칙 안내
3. **마케팅**: SNS 홍보, SEO 최적화
4. **커뮤니티 운영**: 이벤트, 사용자 참여 유도

### 유용한 링크
- Vercel 문서: https://vercel.com/docs
- Next.js 문서: https://nextjs.org/docs
- Supabase 문서: https://supabase.com/docs
- Prisma 문서: https://www.prisma.io/docs

---

**문의**: 배포 관련 문제는 이슈로 등록해주세요.


