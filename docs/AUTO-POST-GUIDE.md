# 🤖 자동 게시글 업로드 가이드

> **매일 정해진 시간에 자동으로 게시글 올리기**

---

## 📋 목차

1. [방법 1: Vercel Cron Jobs (추천)](#방법-1-vercel-cron-jobs-추천)
2. [방법 2: GitHub Actions](#방법-2-github-actions)
3. [방법 3: 외부 Cron 서비스](#방법-3-외부-cron-서비스)
4. [샘플 게시글 데이터 준비](#샘플-게시글-데이터-준비)
5. [테스트 방법](#테스트-방법)

---

## 방법 1: Vercel Cron Jobs (추천)

> ⭐ **가장 쉬운 방법!** Vercel에 배포하면 무료로 사용 가능

### 1단계: API 엔드포인트 생성

#### 📍 파일 생성: `app/api/cron/auto-post/route.ts`

```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BoardType } from "@prisma/client"

// Vercel Cron Job 인증 (배포 시 설정)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 샘플 게시글 데이터
const samplePosts = {
  "muktu-report": [
    {
      title: "⚠️ 먹튀 주의 - XX사이트 출금 불가",
      content: "해당 사이트에서 출금이 불가능한 상황이 발생했습니다. 회원 여러분들의 주의가 필요합니다.",
    },
    {
      title: "🚨 먹튀 확정 - OO사이트 먹튀 확인",
      content: "OO사이트가 먹튀로 확정되었습니다. 즉시 이용을 중단하시기 바랍니다.",
    },
  ],
  "scam-report": [
    {
      title: "사기 주의보 - 피싱 사이트 신고",
      content: "유사한 도메인을 사용하는 피싱 사이트가 발견되었습니다.",
    },
  ],
  "toto-info": [
    {
      title: "토토 이용 시 주의사항 안내",
      content: "안전한 토토 이용을 위한 필수 체크리스트를 공유합니다.",
    },
    {
      title: "신규 회원을 위한 토토 가이드",
      content: "처음 토토를 시작하시는 분들을 위한 기본 가이드입니다.",
    },
  ],
  "sports-analysis": [
    {
      title: "⚽ 오늘의 경기 분석 - 프리미어리그",
      content: "오늘 열리는 프리미어리그 주요 경기를 분석합니다.",
    },
    {
      title: "🏀 NBA 경기 예측 및 분석",
      content: "NBA 주요 경기에 대한 상세 분석을 제공합니다.",
    },
    {
      title: "⚾ KBO 리그 경기 분석",
      content: "오늘의 KBO 리그 경기를 분석합니다.",
    },
  ],
  "promotion": [
    {
      title: "신규 회원 이벤트 안내",
      content: "신규 가입 회원분들께 특별 혜택을 드립니다.",
    },
    {
      title: "추천인 이벤트 진행 중",
      content: "친구 추천 시 포인트 지급 이벤트입니다.",
    },
  ],
  "review": [
    {
      title: "AA사이트 이용 후기",
      content: "AA사이트를 3개월간 이용한 솔직한 후기입니다.",
    },
    {
      title: "BB사이트 장단점 정리",
      content: "BB사이트의 장단점을 정리해봤습니다.",
    },
  ],
}

export async function GET(request: Request) {
  try {
    // Vercel Cron 비밀키 확인 (보안)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: '인증 실패' }, { status: 401 })
    }

    // 관리자 계정 찾기 (자동 게시글의 작성자)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      return NextResponse.json({ error: '관리자 계정 없음' }, { status: 404 })
    }

    const createdPosts = []

    // 각 게시판별로 게시글 생성
    for (const [boardType, posts] of Object.entries(samplePosts)) {
      // 게시판 찾기
      const board = await prisma.board.findFirst({
        where: { type: boardType as BoardType }
      })

      if (!board) continue

      // 무작위로 1-2개 게시글 선택
      const numPosts = Math.floor(Math.random() * 2) + 1 // 1 or 2
      const selectedPosts = posts
        .sort(() => Math.random() - 0.5)
        .slice(0, numPosts)

      // 게시글 생성
      for (const postData of selectedPosts) {
        const post = await prisma.post.create({
          data: {
            title: postData.title,
            content: postData.content,
            boardId: board.id,
            authorId: adminUser.id,
            views: Math.floor(Math.random() * 50), // 랜덤 조회수
          }
        })

        createdPosts.push({
          id: post.id,
          title: post.title,
          board: boardType,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdPosts.length}개의 게시글이 생성되었습니다`,
      posts: createdPosts,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('자동 게시글 생성 에러:', error)
    return NextResponse.json(
      { error: '게시글 생성 실패', details: String(error) },
      { status: 500 }
    )
  }
}
```

### 2단계: Vercel Cron 설정

#### 📍 파일 생성: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-post",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**스케줄 설정 설명**:
- `0 9 * * *` = 매일 오전 9시
- `0 */6 * * *` = 6시간마다
- `0 9,15,21 * * *` = 매일 9시, 15시, 21시
- `0 9 * * 1-5` = 평일 오전 9시

[Cron 표현식 생성기](https://crontab.guru/)에서 원하는 시간 설정 가능!

### 3단계: 환경변수 설정

#### Vercel 대시보드에서 설정

```bash
# .env.local에도 추가 (로컬 테스트용)
CRON_SECRET=your-random-secret-key-here-12345678
```

**비밀키 생성 방법**:
```bash
# 터미널에서 실행
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Vercel에 환경변수 추가
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. `CRON_SECRET` 추가

### 4단계: 배포 및 확인

```bash
# 1. 코드 커밋
git add .
git commit -m "자동 게시글 기능 추가"
git push

# 2. Vercel 자동 배포
# 3. Vercel 대시보드에서 Cron Jobs 탭 확인
```

---

## 방법 2: GitHub Actions

> 💻 **GitHub 무료 기능 활용** - Vercel 없이도 가능

### 1단계: API 엔드포인트 생성

위의 `app/api/cron/auto-post/route.ts` 파일을 동일하게 생성합니다.

### 2단계: GitHub Actions 워크플로우 생성

#### 📍 파일 생성: `.github/workflows/auto-post.yml`

```yaml
name: Auto Post Articles

on:
  schedule:
    # 매일 한국시간 오전 9시 (UTC 0시)
    - cron: '0 0 * * *'
  workflow_dispatch: # 수동 실행 가능

jobs:
  auto-post:
    runs-on: ubuntu-latest
    
    steps:
      - name: Call Auto Post API
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.vercel.app/api/cron/auto-post
```

### 3단계: GitHub Secrets 설정

1. GitHub 저장소 → Settings
2. Secrets and variables → Actions
3. New repository secret
4. Name: `CRON_SECRET`, Value: 비밀키 입력

---

## 방법 3: 외부 Cron 서비스

> 🌐 **무료 외부 서비스 활용**

### 추천 서비스

#### 1. Cron-Job.org (무료)
- https://cron-job.org/
- 무료로 많은 작업 가능
- 설정 방법:
  1. 회원가입
  2. Create cronjob
  3. URL: `https://your-domain.vercel.app/api/cron/auto-post`
  4. Header 추가: `Authorization: Bearer YOUR_SECRET`
  5. 스케줄 설정

#### 2. EasyCron (무료 플랜)
- https://www.easycron.com/
- 무료 플랜: 제한적이지만 충분

#### 3. Uptime Robot (무료)
- https://uptimerobot.com/
- 원래는 모니터링용이지만 Cron 용도로도 사용 가능
- 최소 5분 간격

---

## 샘플 게시글 데이터 준비

### 더 많은 샘플 데이터 추가

#### 📍 위치: `app/api/cron/auto-post/route.ts` 수정

```typescript
const samplePosts = {
  "sports-analysis": [
    "⚽ 프리미어리그 맨시티 vs 첼시 경기 분석",
    "🏀 NBA 레이커스 vs 워리어스 예측",
    "⚾ KBO 두산 vs LG 경기 분석",
    "🎾 윔블던 결승전 분석",
    "🏈 NFL 슈퍼볼 전망",
    "⚽ 챔피언스리그 4강 전망",
    "🏀 NBA 플레이오프 분석",
    "⚾ MLB 월드시리즈 예측",
    "⚽ 한국 vs 일본 축구 경기 분석",
    "🎱 당구 세계 챔피언십 분석",
  ].map(title => ({
    title,
    content: `${title}에 대한 상세 분석입니다. 양팀의 최근 경기력, 선수 컨디션, 전술 등을 종합적으로 분석했습니다.`,
  })),
  
  "muktu-report": [
    "⚠️ 먹튀 주의 - AA사이트",
    "🚨 먹튀 확정 - BB사이트",
    "⛔ 출금 지연 - CC사이트",
    "🚫 먹튀 의심 - DD사이트",
    "⚠️ 주의 필요 - EE사이트",
  ].map(title => ({
    title,
    content: "먹튀 관련 신고가 접수되었습니다. 회원 여러분의 주의가 필요합니다.",
  })),
  
  // 나머지 게시판도 동일한 방식으로 추가...
}
```

### AI로 게시글 자동 생성 (고급)

```typescript
// OpenAI API 사용 예시
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generatePost(boardType: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `당신은 ${boardType} 게시판에 올릴 게시글을 작성하는 전문가입니다.`
      },
      {
        role: "user",
        content: "오늘의 게시글을 작성해주세요."
      }
    ],
  })
  
  return response.choices[0].message.content
}
```

---

## 테스트 방법

### 로컬에서 테스트

```bash
# 1. 서버 실행
npm run dev

# 2. API 호출 테스트
curl -X GET \
  -H "Authorization: Bearer your-secret-key" \
  http://localhost:3000/api/cron/auto-post

# 3. 결과 확인
# 브라우저에서 각 게시판 확인
```

### Postman으로 테스트

1. **Postman 설치**
2. **New Request**
3. **GET** `http://localhost:3000/api/cron/auto-post`
4. **Headers 탭**:
   - Key: `Authorization`
   - Value: `Bearer your-secret-key`
5. **Send 버튼 클릭**

---

## 자동화 스케줄 예시

### 시간대별 게시글 전략

```typescript
// 시간대별로 다른 콘텐츠 제공
const hour = new Date().getHours()

let postsToCreate: string[]

if (hour >= 6 && hour < 12) {
  // 오전: 경기 분석
  postsToCreate = samplePosts["sports-analysis"]
} else if (hour >= 12 && hour < 18) {
  // 오후: 정보성 글
  postsToCreate = samplePosts["toto-info"]
} else {
  // 저녁: 후기 및 리뷰
  postsToCreate = samplePosts["review"]
}
```

### 요일별 콘텐츠

```typescript
const day = new Date().getDay() // 0=일요일, 6=토요일

const dayContent = {
  0: "promotion",      // 일요일: 프로모션
  1: "sports-analysis", // 월요일: 스포츠 분석
  2: "toto-info",      // 화요일: 토토 정보
  3: "sports-analysis", // 수요일: 스포츠 분석
  4: "review",         // 목요일: 후기
  5: "sports-analysis", // 금요일: 스포츠 분석
  6: "promotion",      // 토요일: 프로모션
}

const boardType = dayContent[day]
```

---

## 고급 기능

### 1. 외부 RSS 피드 가져오기

```typescript
import Parser from 'rss-parser'

const parser = new Parser()

async function fetchRSSFeed() {
  const feed = await parser.parseURL('https://sports.news.com/rss')
  
  for (const item of feed.items.slice(0, 5)) {
    await prisma.post.create({
      data: {
        title: item.title || '',
        content: item.content || item.contentSnippet || '',
        boardId: board.id,
        authorId: adminUser.id,
      }
    })
  }
}
```

### 2. 웹 스크래핑 (조심해서 사용)

```typescript
import * as cheerio from 'cheerio'

async function scrapeNews(url: string) {
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)
  
  const articles: any[] = []
  
  $('.article').each((i, elem) => {
    articles.push({
      title: $(elem).find('.title').text(),
      content: $(elem).find('.content').text(),
    })
  })
  
  return articles
}
```

**⚠️ 주의**: 웹 스크래핑 시 저작권 및 이용약관 준수 필수!

### 3. 이미지 자동 추가

```typescript
// Unsplash API로 무료 이미지 가져오기
const imageUrl = `https://source.unsplash.com/800x600/?sports`

await prisma.post.create({
  data: {
    title: "게시글 제목",
    content: `![이미지](${imageUrl})\n\n게시글 내용...`,
    // ...
  }
})
```

---

## 관리자 대시보드에 통계 추가

### 자동 게시글 현황 확인

```typescript
// app/admin/page.tsx에 추가

// 오늘 생성된 자동 게시글 수
const autoPostsToday = await prisma.post.count({
  where: {
    createdAt: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
    author: {
      role: 'ADMIN',
    },
  },
})
```

---

## ⚠️ 주의사항

### 법적 고려사항
1. **저작권**: 외부 콘텐츠 사용 시 출처 명시
2. **자동화 남용 방지**: 너무 많은 게시글은 스팸으로 보일 수 있음
3. **사용자 경험**: 질 낮은 콘텐츠는 피하기

### 기술적 고려사항
1. **API 제한**: Vercel 무료 플랜은 호출 제한 있음
2. **데이터베이스 용량**: 너무 많은 게시글은 DB 용량 차지
3. **중복 방지**: 같은 게시글이 반복되지 않도록 관리

### 품질 관리
1. **정기 검토**: 자동 생성된 게시글 주기적 확인
2. **사용자 피드백**: 자동 게시글에 대한 반응 모니터링
3. **콘텐츠 업데이트**: 샘플 데이터 주기적으로 갱신

---

## 문제 해결

### Q1: Cron이 실행되지 않아요

```bash
# Vercel 로그 확인
vercel logs

# 수동으로 API 호출해서 테스트
curl -X GET \
  -H "Authorization: Bearer YOUR_SECRET" \
  https://your-domain.vercel.app/api/cron/auto-post
```

### Q2: 권한 에러가 나요

```typescript
// CRON_SECRET 환경변수 확인
console.log('CRON_SECRET:', process.env.CRON_SECRET)

// Vercel 대시보드에서 환경변수 다시 확인
```

### Q3: 게시글이 너무 많이 생성돼요

```typescript
// 생성 개수 제한 추가
const MAX_POSTS_PER_RUN = 10

if (createdPosts.length >= MAX_POSTS_PER_RUN) {
  break
}
```

---

## 📊 예상 결과

### 하루 일정 예시

```
09:00 - 스포츠분석 2개
12:00 - 토토정보 1개
15:00 - 먹튀제보 1개
18:00 - 홍보방 2개
21:00 - 토토후기 2개

총 8-10개 게시글 자동 생성
```

---

## ✅ 체크리스트

### 설정 완료 확인
- [ ] `app/api/cron/auto-post/route.ts` 파일 생성
- [ ] `vercel.json` 파일 생성
- [ ] `CRON_SECRET` 환경변수 설정
- [ ] 샘플 데이터 준비
- [ ] 로컬에서 테스트 완료
- [ ] Vercel에 배포
- [ ] Cron Jobs 탭에서 실행 확인

### 운영 체크
- [ ] 매일 게시글 생성 확인
- [ ] 게시글 품질 검토
- [ ] 사용자 반응 모니터링
- [ ] 샘플 데이터 주기적 업데이트

---

**🎉 완료!**

이제 매일 자동으로 게시글이 업로드됩니다!

**추천 설정**:
- 방법 1 (Vercel Cron) 사용
- 하루 2-3회 실행 (오전, 오후, 저녁)
- 각 게시판당 1-2개씩 생성
- 총 8-10개 게시글

