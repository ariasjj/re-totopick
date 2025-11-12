# 🎯 토토사이트 배너 광고 관리 가이드

> **배너 광고 추가 및 수정 방법**

---

## 📋 목차

1. [배너 이미지 추가하기](#1-배너-이미지-추가하기)
2. [배너 정보 수정하기](#2-배너-정보-수정하기)
3. [배너 디자인 커스터마이징](#3-배너-디자인-커스터마이징)
4. [실제 데이터베이스 연동](#4-실제-데이터베이스-연동)

---

## 1. 배너 이미지 추가하기

### 방법 1: 이미지 파일 추가 (권장)

#### 📍 위치: `public/banners/` 폴더

```bash
# 1. 프로젝트 루트에 폴더 생성
totopick/
└── public/
    └── banners/        # ← 여기에 이미지 파일 추가
        ├── banner1.jpg
        ├── banner2.jpg
        └── banner3.png
```

#### 이미지 권장 사양
- **크기**: 800x400px (가로:세로 = 2:1)
- **용량**: 200KB 이하
- **형식**: JPG, PNG, WebP

#### 사용 방법

```tsx
// app/boards/toto-site/page.tsx 파일에서 수정

{
  id: "1",
  name: "토토사이트 [에그벳]",
  bannerImage: "/banners/banner1.jpg",  // ← 여기에 파일명 입력
  // ...
}
```

### 방법 2: 외부 이미지 URL 사용

```tsx
{
  id: "1",
  name: "토토사이트 [에그벳]",
  bannerImage: "https://example.com/banner.jpg",  // ← 외부 URL
  // ...
}
```

**⚠️ 주의**: 외부 이미지 사용 시 `next.config.js`에 도메인 추가 필요

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',  // ← 사용할 도메인 추가
      },
    ],
  },
}
```

---

## 2. 배너 정보 수정하기

### 📍 위치: `app/boards/toto-site/page.tsx`

#### 2.1 배너 추가하기

```tsx
// 20-30줄 부근의 sampleBanners 배열 찾기

const sampleBanners: BannerSite[] = [
  // 기존 배너들...
  
  // ✅ 새 배너 추가
  {
    id: "9",                              // ← 고유 ID (숫자 증가)
    name: "토토사이트 [새로운사이트]",    // ← 사이트 이름
    domain: "new-site.com",               // ← 도메인 주소
    guarantee: "100,000,000원",           // ← 보증금
    bannerImage: "/banners/new.jpg",      // ← 배너 이미지 경로
    isVerified: true,                     // ← 검증 여부 (true/false)
    rating: 4.5,                          // ← 평점 (0-5)
    description: "첫충 50% 매충 10%"      // ← 설명 문구
  },
]
```

#### 2.2 배너 수정하기

```tsx
// 수정하고 싶은 배너 찾기
{
  id: "1",
  name: "토토사이트 [에그벳]",           // ← 이름 수정
  domain: "에그벳.com",                  // ← 도메인 수정
  guarantee: "50,000,000원",             // ← 보증금 수정
  bannerImage: "/banners/sample1.jpg",   // ← 이미지 수정
  isVerified: true,                      // ← 검증 상태 수정
  rating: 4.5,                           // ← 평점 수정
  description: "첫충 40% 무한"           // ← 설명 수정
}
```

#### 2.3 배너 삭제하기

```tsx
// 삭제하고 싶은 배너 전체를 제거하거나 주석 처리

/* 삭제됨
{
  id: "1",
  name: "토토사이트 [에그벳]",
  // ...
},
*/
```

---

## 3. 배너 디자인 커스터마이징

### 3.1 배너 색상 변경

#### 📍 위치: `app/boards/toto-site/page.tsx` (160줄 부근)

```tsx
{/* 현재: 파랑-보라-핑크 그라데이션 */}
<div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">

{/* 변경 예시 1: 빨강-주황 그라데이션 */}
<div className="relative h-48 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500">

{/* 변경 예시 2: 초록-청록 그라데이션 */}
<div className="relative h-48 bg-gradient-to-br from-green-500 via-teal-500 to-blue-500">

{/* 변경 예시 3: 단색 배경 */}
<div className="relative h-48 bg-blue-600">
```

### 3.2 "보증업체" 배지 색상 변경

```tsx
{/* 현재: 초록색 */}
<Badge className="bg-green-500 hover:bg-green-600">
  보증업체
</Badge>

{/* 변경 예시 1: 파란색 */}
<Badge className="bg-blue-500 hover:bg-blue-600">
  보증업체
</Badge>

{/* 변경 예시 2: 금색 */}
<Badge className="bg-yellow-500 hover:bg-yellow-600">
  보증업체
</Badge>
```

### 3.3 보증금 텍스트 색상 변경

```tsx
{/* 현재: 빨간색 */}
<span className="text-lg font-bold text-red-600">
  {banner.guarantee}
</span>

{/* 변경 예시: 파란색 */}
<span className="text-lg font-bold text-blue-600">
  {banner.guarantee}
</span>
```

### 3.4 그리드 열 개수 변경

```tsx
{/* 현재: 모바일 1열, 태블릿 2열, 데스크톱 3열, 대형화면 4열 */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

{/* 변경 예시 1: 항상 3열 */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{/* 변경 예시 2: 최대 5열 */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
```

### 3.5 카드 높이 조정

```tsx
{/* 배너 이미지 높이 변경 */}
<div className="relative h-48">  {/* ← 현재 192px */}

{/* 더 크게 */}
<div className="relative h-64">  {/* 256px */}

{/* 더 작게 */}
<div className="relative h-40">  {/* 160px */}
```

---

## 4. 실제 데이터베이스 연동

현재는 샘플 데이터를 사용하지만, 실제 서비스에서는 데이터베이스와 연동해야 합니다.

### 4.1 Prisma 스키마에 TotoSite 모델 추가

#### 📍 위치: `prisma/schema.prisma`

```prisma
// 토토사이트 배너 모델 추가
model TotoSite {
  id          String   @id @default(cuid())
  name        String   // 사이트 이름
  domain      String   // 도메인
  guarantee   String   // 보증금
  bannerImage String?  // 배너 이미지 URL
  isVerified  Boolean  @default(true) // 검증 여부
  rating      Float    @default(0) // 평점
  description String   // 설명
  
  isActive    Boolean  @default(true) // 활성 상태
  views       Int      @default(0) // 조회수
  clicks      Int      @default(0) // 클릭수
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("toto_sites")
}
```

### 4.2 데이터베이스 마이그레이션

```bash
# 스키마 변경 적용
npx prisma db push

# Prisma Studio로 데이터 관리
npm run db:studio
```

### 4.3 API 라우트 생성

#### 📍 위치: `app/api/toto-sites/route.ts` (새 파일)

```tsx
// GET: 토토사이트 목록 조회
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sites = await prisma.totoSite.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        rating: 'desc', // 평점 높은 순
      },
    })

    return NextResponse.json({ sites })
  } catch (error) {
    return NextResponse.json(
      { error: "사이트 조회 실패" },
      { status: 500 }
    )
  }
}

// POST: 새 토토사이트 등록 (관리자 전용)
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const site = await prisma.totoSite.create({
      data: {
        name: data.name,
        domain: data.domain,
        guarantee: data.guarantee,
        bannerImage: data.bannerImage,
        description: data.description,
        rating: data.rating || 0,
      },
    })

    return NextResponse.json({ site })
  } catch (error) {
    return NextResponse.json(
      { error: "사이트 등록 실패" },
      { status: 500 }
    )
  }
}
```

### 4.4 페이지에서 API 연동

#### 📍 위치: `app/boards/toto-site/page.tsx`

```tsx
// 기존 샘플 데이터 대신 API에서 가져오기

export default function TotoSitePage() {
  const [banners, setBanners] = useState<BannerSite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBanners()
  }, [])

  async function loadBanners() {
    try {
      const res = await fetch('/api/toto-sites')
      const data = await res.json()
      
      if (res.ok) {
        setBanners(data.sites)
      }
    } catch (error) {
      console.error('사이트 로드 에러:', error)
    } finally {
      setLoading(false)
    }
  }

  // 나머지 코드...
}
```

---

## 📊 관리자 대시보드에 추가

### 토토사이트 관리 메뉴 추가

#### 📍 위치: `app/admin/page.tsx`

관리자 페이지에 "토토사이트 관리" 탭을 추가하여:
- ✅ 새 사이트 등록
- ✅ 기존 사이트 수정
- ✅ 배너 이미지 업로드
- ✅ 활성화/비활성화
- ✅ 조회수/클릭수 통계

---

## 🎨 배너 이미지 디자인 팁

### 효과적인 배너 디자인
1. **간결한 메시지**: 핵심 내용만 강조
2. **눈에 띄는 색상**: 높은 대비로 가독성 확보
3. **브랜드 로고**: 상단에 명확하게 배치
4. **혜택 강조**: 보너스, 이벤트 등을 크게
5. **CTA 버튼**: "지금 가입", "바로가기" 등

### 온라인 배너 제작 도구
- [Canva](https://www.canva.com/) - 무료 템플릿
- [Figma](https://www.figma.com/) - 전문가용
- [Photopea](https://www.photopea.com/) - 무료 포토샵 대체

---

## ⚡ 빠른 시작

### 1분 만에 배너 추가하기

```tsx
// 1. app/boards/toto-site/page.tsx 파일 열기
// 2. sampleBanners 배열 찾기 (20줄 부근)
// 3. 마지막 배너 아래에 추가

{
  id: "새번호",
  name: "토토사이트 [내사이트]",
  domain: "my-site.com",
  guarantee: "100,000,000원",
  bannerImage: "/banners/my-banner.jpg",
  isVerified: true,
  rating: 5.0,
  description: "최고의 혜택"
}

// 4. public/banners/ 폴더에 my-banner.jpg 추가
// 5. 저장 (Ctrl + S)
// 6. 브라우저에서 확인!
```

---

## ✅ 체크리스트

### 배너 추가 전
- [ ] 배너 이미지 준비 (800x400px)
- [ ] 사이트 정보 확인 (이름, 도메인, 보증금)
- [ ] 이미지를 `public/banners/` 폴더에 추가

### 배너 추가 후
- [ ] 페이지에서 정상 표시 확인
- [ ] 모바일에서도 확인
- [ ] 링크 클릭 테스트
- [ ] 보증금 정보 정확성 확인

---

## 🆘 문제 해결

### Q: 이미지가 안 보여요
```bash
# 1. 파일 경로 확인
public/banners/my-image.jpg  ✅ 올바름
public/my-image.jpg          ❌ 잘못됨

# 2. 파일명 확인 (대소문자 구분)
bannerImage: "/banners/Image.jpg"  # Image.jpg로 정확히
```

### Q: 배너가 너무 많아요
```tsx
// 페이지네이션 추가 또는
// 한 번에 표시할 개수 제한
const displayedBanners = filteredBanners.slice(0, 12) // 12개만 표시
```

---

**완료! 🎉**

이제 토토사이트 배너를 자유롭게 관리할 수 있습니다!

