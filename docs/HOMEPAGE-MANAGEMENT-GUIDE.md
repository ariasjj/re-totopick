# 🎨 토토픽 홈페이지 관리 가이드

> **초보자를 위한 쉬운 설명서**  
> 이 문서는 코딩 초보자도 쉽게 홈페이지를 관리하고 수정할 수 있도록 작성되었습니다.

---

## 📋 목차

1. [시작하기](#1-시작하기)
2. [텍스트(글자) 수정하기](#2-텍스트글자-수정하기)
3. [디자인 수정하기](#3-디자인-수정하기)
4. [홈페이지 관리하기](#4-홈페이지-관리하기)
5. [자주 묻는 질문](#5-자주-묻는-질문)

---

## 1. 시작하기

### 📁 프로젝트 구조 이해하기

```
totopick/
├── app/                    # 📄 페이지 파일들
│   ├── page.tsx           # 메인 홈페이지
│   ├── layout.tsx         # 전체 레이아웃
│   ├── boards/            # 게시판 페이지들
│   ├── admin/             # 관리자 페이지
│   └── auth/              # 로그인/회원가입
├── components/            # 🧩 재사용 가능한 컴포넌트
│   ├── layout/           # 헤더, 푸터, 사이드바
│   └── auth/             # 로그인/회원가입 폼
├── lib/                  # ⚙️ 설정 파일들
│   └── board-config.ts   # 게시판 설정
├── prisma/               # 💾 데이터베이스 설정
└── docs/                 # 📚 문서 파일들
```

### 🚀 개발 서버 실행하기

```bash
# 1. 터미널 열기 (Ctrl + `)
# 2. 개발 서버 시작
npm run dev

# 3. 브라우저에서 확인
# http://localhost:3000
```

**💡 팁**: 코드를 수정하면 자동으로 브라우저가 새로고침됩니다!

---

## 2. 텍스트(글자) 수정하기

### 2.1 사이트 이름 및 슬로건 변경

#### 📍 위치: `components/layout/header.tsx`

```tsx
// 현재 코드 (13-19줄)
<Link href="/" className="text-2xl font-bold text-primary">
  TOTOPICK
</Link>

// 변경 예시
<Link href="/" className="text-2xl font-bold text-primary">
  나의사이트이름
</Link>
```

#### 📍 위치: `app/layout.tsx`

```tsx
// 현재 코드 (20-21줄)
title: '토토픽 (TOTOPICK) - 현명한 선택',
description: '토토픽 - 신뢰할 수 있는 스포츠 커뮤니티...',

// 변경 예시
title: '나의사이트 - 원하는 문구',
description: '나의사이트 설명...',
```

### 2.2 메뉴 이름 변경

#### 📍 위치: `lib/board-config.ts`

```typescript
// 현재 코드 (7-71줄)
export const BOARD_CONFIGS: Record<BoardType, BoardConfig> = {
  "toto-site": {
    title: "토토사이트",     // ← 이 부분 수정
    description: "...",
    icon: Star,
  },
  // ... 다른 메뉴들
}

// 변경 예시
"toto-site": {
  title: "추천 사이트",     // ← 수정됨
  description: "믿을 수 있는 사이트 목록",
  icon: Star,
}
```

### 2.3 환영 메시지 변경

#### 📍 위치: `app/page.tsx`

```tsx
// 현재 코드 (35-40줄)
<div className="text-center py-12">
  <h1 className="text-4xl font-bold mb-4">
    토토픽에 오신 것을 환영합니다
  </h1>
  <p className="text-xl text-muted-foreground">
    현명한 선택, 토토픽에서
  </p>
</div>

// 변경 예시
<div className="text-center py-12">
  <h1 className="text-4xl font-bold mb-4">
    나의 커뮤니티에 오신 것을 환영합니다
  </h1>
  <p className="text-xl text-muted-foreground">
    함께 만드는 즐거운 공간
  </p>
</div>
```

### 2.4 푸터 텍스트 변경

#### 📍 위치: `components/layout/footer.tsx`

```tsx
// 현재 코드 (14줄)
<p className="text-sm text-muted-foreground">
  © 2024 토토픽. All rights reserved.
</p>

// 변경 예시
<p className="text-sm text-muted-foreground">
  © 2024 나의사이트. 모든 권리 보유.
</p>
```

---

## 3. 디자인 수정하기

### 3.1 색상 테마 변경

#### 📍 위치: `app/globals.css`

```css
/* 현재 코드 (10-40줄) */
@layer base {
  :root {
    --primary: 210 100% 50%;        /* 메인 색상 (파란색) */
    --secondary: 210 40% 96.1%;     /* 보조 색상 */
    --accent: 210 40% 96.1%;        /* 강조 색상 */
    /* ... */
  }
}

/* 🎨 색상 변경 예시 */

/* 빨간색 테마 */
:root {
  --primary: 0 84% 60%;             /* 빨간색 */
  --primary-foreground: 0 0% 100%;
}

/* 초록색 테마 */
:root {
  --primary: 142 76% 36%;           /* 초록색 */
  --primary-foreground: 0 0% 100%;
}

/* 보라색 테마 */
:root {
  --primary: 263 70% 50%;           /* 보라색 */
  --primary-foreground: 0 0% 100%;
}
```

**💡 색상 선택 팁:**
- [Tailwind Color Generator](https://uicolors.app/create) 사용
- HSL 값으로 변경: `색조(0-360) 채도(0-100%) 명도(0-100%)`

### 3.2 폰트 크기 변경

#### 📍 위치: 각 컴포넌트 파일

```tsx
/* Tailwind CSS 클래스로 크기 조절 */

// 현재 코드
<h1 className="text-4xl font-bold">제목</h1>

// 크기 변경 예시
<h1 className="text-6xl font-bold">큰 제목</h1>    // 더 크게
<h1 className="text-2xl font-bold">작은 제목</h1>  // 더 작게

/* 텍스트 크기 클래스 */
text-xs    // 아주 작음 (12px)
text-sm    // 작음 (14px)
text-base  // 기본 (16px)
text-lg    // 큼 (18px)
text-xl    // 아주 큼 (20px)
text-2xl   // 매우 큼 (24px)
text-4xl   // 초대형 (36px)
```

### 3.3 레이아웃 간격 조정

```tsx
/* Tailwind CSS로 여백 조절 */

// 안쪽 여백 (padding)
p-4        // 모든 방향 1rem (16px)
px-6       // 좌우만 1.5rem (24px)
py-8       // 상하만 2rem (32px)
pt-2       // 위쪽만 0.5rem (8px)

// 바깥 여백 (margin)
m-4        // 모든 방향 1rem
mx-auto    // 좌우 자동 (가운데 정렬)
my-6       // 상하 1.5rem
mb-4       // 아래만 1rem

// 사용 예시
<div className="p-6 mb-4">  // 안쪽 여백 1.5rem, 아래 여백 1rem
  내용
</div>
```

### 3.4 배경색 변경

```tsx
/* 배경색 클래스 */

// 현재 코드
<div className="bg-card">내용</div>

// 변경 예시
<div className="bg-blue-50">파란 배경</div>
<div className="bg-green-100">초록 배경</div>
<div className="bg-gray-50">회색 배경</div>
<div className="bg-gradient-to-r from-blue-500 to-purple-600">
  그라데이션 배경
</div>
```

### 3.5 버튼 스타일 변경

#### 📍 위치: 버튼이 있는 모든 파일

```tsx
/* 버튼 변형 */

// 기본 버튼
<Button>클릭</Button>

// 색상 변경
<Button variant="destructive">빨간 버튼</Button>
<Button variant="outline">테두리 버튼</Button>
<Button variant="ghost">투명 버튼</Button>
<Button variant="secondary">보조 버튼</Button>

// 크기 변경
<Button size="sm">작은 버튼</Button>
<Button size="default">기본 버튼</Button>
<Button size="lg">큰 버튼</Button>

// 조합 예시
<Button variant="destructive" size="lg" className="w-full">
  전체 너비 큰 빨간 버튼
</Button>
```

### 3.6 헤더 디자인 변경

#### 📍 위치: `components/layout/header.tsx`

```tsx
// 현재 코드 (7줄)
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

// 배경색 변경 예시
<header className="sticky top-0 z-50 w-full border-b bg-blue-600">
  {/* 파란색 헤더 */}
</header>

// 그림자 추가 예시
<header className="sticky top-0 z-50 w-full shadow-lg bg-white">
  {/* 그림자가 있는 헤더 */}
</header>

// 투명 헤더 예시
<header className="sticky top-0 z-50 w-full bg-transparent">
  {/* 투명 헤더 */}
</header>
```

### 3.7 사이드바 너비 조정

#### 📍 위치: `components/layout/sidebar.tsx`

```tsx
// 현재 코드 (7줄)
<aside className="w-80 space-y-4">

// 너비 변경 예시
<aside className="w-64 space-y-4">  // 더 좁게 (256px)
<aside className="w-96 space-y-4">  // 더 넓게 (384px)
<aside className="w-1/4 space-y-4"> // 화면의 1/4
```

---

## 4. 홈페이지 관리하기

### 4.1 관리자 로그인

1. 브라우저에서 `http://localhost:3000/auth/signin` 접속
2. 관리자 계정으로 로그인:
   ```
   이메일: admin@totopick.com
   비밀번호: admin1234
   ```
3. 브라우저 주소창에 `/admin` 입력하여 관리자 페이지 접속

### 4.2 관리자 대시보드 사용법

#### 📊 통계 확인
- **오늘 방문자**: 오늘 사이트를 방문한 사용자 수
- **전체 회원 수**: 가입한 총 회원 수
- **전체 게시글**: 작성된 총 게시글 수
- **처리 대기 신고**: 아직 확인하지 않은 신고 건수

#### 👥 회원 관리

```typescript
// 📍 위치: http://localhost:3000/admin (사용자 목록 탭)

// 회원 정보 확인
- 이메일, 닉네임, 포인트
- 가입일, 마지막 로그인
- 활성 상태 확인

// 회원 활성화/비활성화
// 비활성화된 회원은 로그인 불가
```

#### 📝 게시글 관리

```typescript
// 📍 위치: http://localhost:3000/admin (게시글 관리 탭)

// 게시글 확인 및 삭제
- 부적절한 게시글 삭제
- 스팸 게시글 관리
```

#### 🚨 신고 처리

```typescript
// 📍 위치: http://localhost:3000/admin (신고 관리 탭)

// 신고 상태
- PENDING: 확인 필요 (노란색)
- CONFIRMED: 확인 완료 (빨간색)
- RESOLVED: 해결 완료 (초록색)
- REJECTED: 거부됨 (회색)

// 처리 방법
1. 신고 내용 확인
2. 해당 사이트/게시글 확인
3. 상태 변경 (승인/거부)
```

#### 💬 문의 관리

```typescript
// 📍 위치: http://localhost:3000/admin (문의 관리 탭)

// 문의 상태
- PENDING: 답변 대기
- IN_PROGRESS: 처리 중
- RESOLVED: 해결 완료

// 처리 방법
1. 문의 내용 확인
2. 답변 작성
3. 상태를 RESOLVED로 변경
```

### 4.3 데이터베이스 관리

#### 🔍 Prisma Studio로 데이터 확인하기

```bash
# 터미널에서 실행
npm run db:studio

# 브라우저에서 자동으로 열림
# http://localhost:5555
```

**Prisma Studio에서 할 수 있는 것:**
- ✅ 모든 데이터 조회
- ✅ 데이터 수정
- ✅ 데이터 삭제
- ✅ 새 데이터 추가

**⚠️ 주의사항:**
- **실제 데이터베이스**이므로 신중하게 수정하세요
- 삭제한 데이터는 복구할 수 없습니다
- 중요한 작업 전에는 백업을 권장합니다

#### 💾 데이터베이스 백업

```bash
# 데이터베이스 전체 백업 (예시)
# Supabase 대시보드에서 백업 기능 사용
# 또는 PostgreSQL 명령어로 백업

pg_dump DATABASE_URL > backup.sql
```

### 4.4 게시판 설정 변경

#### 📍 위치: `lib/board-config.ts`

```typescript
// 게시판 추가하기
export const BOARD_CONFIGS: Record<BoardType, BoardConfig> = {
  // ... 기존 게시판들
  
  // 새 게시판 추가 예시
  "new-board": {
    title: "새 게시판",
    description: "새로운 게시판입니다",
    icon: Newspaper,
    color: "text-purple-500",
    features: {
      allowImages: true,      // 이미지 업로드 허용
      allowComments: true,    // 댓글 허용
      requireAuth: true,      // 로그인 필요
      allowAnonymous: false,  // 익명 작성 불가
    },
  },
}
```

**⚠️ 주의**: 새 게시판을 추가하려면 `prisma/schema.prisma`도 수정해야 합니다.

---

## 5. 자주 묻는 질문

### Q1: 코드를 수정했는데 변경사항이 안 보여요

**A1: 다음을 시도해보세요**

```bash
# 1. 개발 서버 재시작
# Ctrl + C로 서버 중지 후
npm run dev

# 2. 브라우저 캐시 삭제
# Ctrl + Shift + R (강제 새로고침)

# 3. .next 폴더 삭제 후 재시작
rmdir /s /q .next
npm run dev
```

### Q2: 에러가 발생했어요

**A2: 에러 메시지를 확인하세요**

```bash
# 터미널에서 에러 메시지 확인
# 빨간색으로 표시된 에러 로그를 읽어보세요

# 일반적인 해결 방법
1. 오타가 있는지 확인
2. 닫는 태그가 제대로 있는지 확인
3. 쉼표(,)나 세미콜론(;)이 빠지지 않았는지 확인
4. 큰따옴표("")와 작은따옴표('')가 올바른지 확인
```

### Q3: 색상 코드를 어떻게 찾나요?

**A3: 온라인 도구를 사용하세요**

- [Tailwind Color Generator](https://uicolors.app/create)
- [Color Picker](https://htmlcolorcodes.com/)
- [Coolors](https://coolors.co/) - 색상 조합 추천

### Q4: 데이터베이스가 초기화되었어요

**A4: 시드 데이터를 다시 생성하세요**

```bash
# 터미널에서 실행
npm run db:seed

# 테스트 계정이 다시 생성됩니다
# 이메일: admin@totopick.com / user@test.com
# 비밀번호: admin1234 / test1234
```

### Q5: 파일을 어디서 수정해야 하는지 모르겠어요

**A5: 수정하려는 내용에 따라 다릅니다**

| 수정하려는 것 | 파일 위치 |
|--------------|----------|
| 사이트 이름/로고 | `components/layout/header.tsx` |
| 메뉴 이름 | `lib/board-config.ts` |
| 메인 페이지 내용 | `app/page.tsx` |
| 푸터 내용 | `components/layout/footer.tsx` |
| 색상 테마 | `app/globals.css` |
| 로그인 폼 | `components/auth/signin-form.tsx` |

### Q6: 테스트는 어떻게 하나요?

**A6: 로컬에서 먼저 테스트하세요**

```bash
# 1. 개발 서버 실행
npm run dev

# 2. 브라우저에서 테스트
http://localhost:3000

# 3. 문제가 없으면 배포
# (Vercel에 자동 배포됨)
```

---

## 📚 추가 학습 자료

### 기초 학습
- [React 기초](https://react.dev/learn)
- [Next.js 튜토리얼](https://nextjs.org/learn)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 유용한 도구
- [VSCode](https://code.visualstudio.com/) - 코드 에디터
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - 브라우저 개발자 도구
- [Prisma Studio](https://www.prisma.io/studio) - 데이터베이스 GUI

---

## 🆘 도움 받기

### 문제가 해결되지 않을 때

1. **에러 메시지를 복사**해서 구글에 검색
2. **스크린샷**을 찍어서 문제 파악
3. **관련 파일**의 코드를 확인
4. **최근 변경사항**을 되돌려보기

### 백업의 중요성

```bash
# Git으로 코드 관리하기
git add .
git commit -m "변경 사항 설명"
git push

# 문제가 생기면 이전 버전으로 되돌리기
git log          # 커밋 내역 확인
git reset --hard [커밋ID]  # 특정 커밋으로 되돌리기
```

---

## ✅ 체크리스트

### 수정 전 확인사항
- [ ] 백업을 만들었나요?
- [ ] 어떤 파일을 수정할지 알고 있나요?
- [ ] 개발 서버가 실행 중인가요?

### 수정 후 확인사항
- [ ] 에러가 없나요?
- [ ] 브라우저에서 정상적으로 보이나요?
- [ ] 다른 페이지도 정상 작동하나요?
- [ ] 모바일에서도 확인했나요?

### 배포 전 확인사항
- [ ] 로컬에서 모든 기능이 작동하나요?
- [ ] 테스트 계정으로 로그인이 되나요?
- [ ] 게시글 작성/수정/삭제가 되나요?
- [ ] 관리자 페이지가 정상 작동하나요?

---

## 🎯 마무리

이 가이드를 통해 토토픽 홈페이지를 쉽게 관리하고 수정할 수 있습니다!

**핵심 원칙:**
1. 🔍 **작은 것부터 시작**: 한 번에 하나씩 수정하세요
2. 💾 **자주 저장**: 변경사항을 자주 저장하고 테스트하세요
3. 📝 **메모하기**: 무엇을 변경했는지 기록하세요
4. 🔄 **백업하기**: 중요한 작업 전에는 항상 백업하세요

**궁금한 점이 있으면 언제든지 질문하세요!** 😊

