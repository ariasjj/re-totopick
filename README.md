# 토토픽 (TOTOPICK) - 스포츠 분석 커뮤니티

> 현명한 선택, 토토픽에서

합법적인 스포츠 분석 및 정보 공유를 위한 커뮤니티 플랫폼입니다.

## 🚀 주요 기능

### 사용자 기능
- ✅ 회원가입 및 로그인 (이메일 + 핸드폰 인증)
- 📝 9개의 게시판 (토토사이트, 먹튀제보, 사기신고, 토토정보, 스포츠분석, 홍보방, 토토후기, 출석부, 1:1문의)
- 💬 게시글 작성 및 댓글 시스템
- 🎁 출석체크 및 포인트 시스템
- 🚨 먹튀/사기 신고 기능
- 💬 1:1 문의 시스템

### 관리자 기능
- 📊 실시간 통계 대시보드
- 👥 회원 관리 (포인트 조정, 계정 상태 관리)
- 📋 게시글/댓글 관리
- 🔍 신고 처리 (먹튀/사기 신고)
- 💬 1:1 문의 답변

## 🛠 기술 스택

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Authentication**: NextAuth.js v5

### 백엔드
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT

### 배포
- **Hosting**: Vercel
- **Database**: Supabase

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/totopick.git
cd totopick
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 데이터베이스 (Supabase)
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# SMS 인증 모드 (test/production)
SMS_MODE="test"

# SMS API (프로덕션 사용 시)
# ALIGO_API_KEY="your-aligo-api-key"
# ALIGO_USER_ID="your-aligo-user-id"
# ALIGO_SENDER="01012345678"
```

### 4. 데이터베이스 초기화
```bash
# Prisma 마이그레이션
npx prisma db push

# 초기 데이터 생성 (게시판, 관리자 계정 등)
npm run db:seed
```

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 사이트를 확인할 수 있습니다.

## 🔑 기본 계정 정보

### 관리자 계정
- 이메일: `admin@totopick.com`
- 비밀번호: `admin1234`

### 테스트 사용자
- 이메일: `user@test.com`
- 비밀번호: `test1234`

## 📱 핸드폰 인증 (테스트 모드)

개발 환경에서는 실제 SMS를 발송하지 않고 콘솔에 인증번호를 출력합니다.

회원가입 시:
1. 전화번호 입력 → 인증번호 발송 버튼 클릭
2. 터미널 콘솔에서 6자리 인증번호 확인
3. 인증번호 입력 → 인증 완료

**프로덕션 전환**: `docs/SMS-SETUP.md` 참고

## 📚 프로젝트 구조

```
totopick/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # 인증 관련
│   │   ├── posts/        # 게시글
│   │   ├── comments/     # 댓글
│   │   ├── attendance/   # 출석체크
│   │   ├── inquiry/      # 문의
│   │   ├── reports/      # 신고
│   │   └── admin/        # 관리자
│   ├── boards/           # 게시판 페이지
│   ├── auth/             # 인증 페이지
│   ├── admin/            # 관리자 페이지
│   ├── attendance/       # 출석 페이지
│   └── inquiry/          # 문의 페이지
├── components/            # React 컴포넌트
│   ├── layout/           # 레이아웃
│   ├── auth/             # 인증 폼
│   └── ui/               # Shadcn/ui 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── auth.ts           # NextAuth 설정
│   ├── prisma.ts         # Prisma 클라이언트
│   ├── sms.ts            # SMS 인터페이스
│   └── react-query.tsx   # React Query 설정
├── prisma/               # Prisma 스키마
│   ├── schema.prisma     # 데이터베이스 스키마
│   └── seed.ts           # 초기 데이터
└── types/                # TypeScript 타입
```

## 🎯 포인트 시스템

| 활동 | 획득 포인트 |
|------|-------------|
| 회원가입 | +1,000P |
| 출석체크 (매일) | +100P |
| 7일 연속 출석 | +50P (보너스) |
| 게시글 작성 | +10P |
| 댓글 작성 | +5P |

## 🔒 보안 고려사항

- 비밀번호는 bcrypt로 해시화하여 저장
- JWT 토큰 기반 인증
- API 라우트에 권한 체크 적용
- XSS, CSRF 방어 (Next.js 기본 보안)
- 환경변수로 민감 정보 관리

## 📖 추가 문서

### 초보자를 위한 가이드 (필독!)
- 🚀 **[빠른 시작 가이드](docs/QUICK-START.md)** - 5분 안에 가장 중요한 것만 수정하기
- 📚 **[홈페이지 관리 가이드](docs/HOMEPAGE-MANAGEMENT-GUIDE.md)** - 텍스트 수정, 디자인 변경, 관리 방법
- 🎨 **[색상 선택 가이드](docs/COLOR-GUIDE.md)** - 예쁜 색상 테마로 사이트 꾸미기
- 🎯 **[토토사이트 배너 관리](docs/TOTO-SITE-BANNER-GUIDE.md)** - 배너 광고 추가 및 관리 방법
- 🤖 **[자동 게시글 업로드 가이드](docs/AUTO-POST-GUIDE.md)** - 매일 자동으로 게시글 올리기

### 심화 가이드
- 🚀 **[Vercel 배포 가이드](docs/VERCEL-DEPLOYMENT.md)** - 사이트를 실제로 배포하기
- 🔧 **[Git 설치 가이드](docs/GIT-INSTALLATION.md)** - Git/GitHub Desktop 설치 방법
- 📱 [SMS 인증 전환 가이드](docs/SMS-SETUP.md)
- 👑 [관리자 매뉴얼](docs/ADMIN-GUIDE.md)

## 🚀 배포

### Vercel 배포
1. GitHub에 프로젝트 푸시
2. Vercel에서 Import
3. 환경변수 설정
4. 자동 배포

### 데이터베이스
- Supabase 무료 플랜 사용 가능
- PostgreSQL 연결 정보를 환경변수에 설정

## 📝 개발 스크립트

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 실행
npm run db:push      # Prisma 스키마 동기화
npm run db:seed      # 데이터베이스 초기화
npm run db:studio    # Prisma Studio 실행
```

## 🤝 기여

버그 리포트 및 기능 제안은 Issues에 등록해주세요.

## 📄 라이선스

MIT License

## 👨‍💻 개발자

- **프로젝트**: TOTOPICK
- **설명**: AI 기반으로 개발된 스포츠 커뮤니티

---

**주의**: 이 프로젝트는 합법적인 스포츠 정보 공유를 위한 것입니다. 불법 도박은 법으로 금지되어 있습니다.


