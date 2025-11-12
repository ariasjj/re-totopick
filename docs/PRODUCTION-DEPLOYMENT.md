# 정식 배포 완벽 가이드

> **초보자를 위한 프로덕션 배포 A to Z**
> 
> 테스트가 아닌 실제 서비스를 위한 정식 배포 방법을 설명합니다.

---

## 📋 목차

1. [배포 옵션 비교](#1-배포-옵션-비교)
2. [도메인 구매 가이드](#2-도메인-구매-가이드)
3. [Vercel Pro 배포 (추천)](#3-vercel-pro-배포-추천)
4. [커스텀 도메인 연결](#4-커스텀-도메인-연결)
5. [데이터베이스 업그레이드](#5-데이터베이스-업그레이드)
6. [환경 변수 프로덕션 설정](#6-환경-변수-프로덕션-설정)
7. [SSL 인증서 설정](#7-ssl-인증서-설정)
8. [성능 최적화](#8-성능-최적화)
9. [모니터링 및 관리](#9-모니터링-및-관리)
10. [백업 및 복구](#10-백업-및-복구)
11. [대안: 다른 서버 옵션](#11-대안-다른-서버-옵션)

---

## 1. 배포 옵션 비교

### 옵션 A: Vercel Pro (강력 추천 ⭐⭐⭐⭐⭐)

**장점**:
- ✅ **가장 쉬움** - 클릭 몇 번으로 배포
- ✅ **자동 SSL** - HTTPS 자동 적용
- ✅ **글로벌 CDN** - 빠른 속도
- ✅ **자동 스케일링** - 트래픽 증가 시 자동 대응
- ✅ **무중단 배포** - Zero Downtime
- ✅ **한국 리전 지원** - 빠른 속도
- ✅ **GitHub 자동 배포** - 코드 푸시만 하면 자동 배포

**단점**:
- ❌ 월 비용: $20 (약 26,000원)
- ❌ 서버 커스터마이징 제한

**추천 대상**:
- ✅ 초보자
- ✅ 빠른 배포가 필요한 경우
- ✅ 서버 관리를 하고 싶지 않은 경우

---

### 옵션 B: 국내 호스팅 (카페24, 호스팅케이알)

**장점**:
- ✅ 한국어 고객지원
- ✅ 국내 결제 (신용카드, 계좌이체)
- ✅ 저렴한 가격 (월 5,000원~)

**단점**:
- ❌ 설정이 복잡함
- ❌ 서버 관리 필요
- ❌ 성능이 Vercel보다 낮음
- ❌ 수동 배포 필요

**추천 대상**:
- ✅ 예산이 적은 경우
- ✅ 한국어 지원이 필요한 경우

---

### 옵션 C: VPS (AWS, Google Cloud, Vultr)

**장점**:
- ✅ 완전한 제어권
- ✅ 확장성 좋음
- ✅ 다양한 옵션

**단점**:
- ❌ 매우 복잡함
- ❌ 서버 관리 지식 필요
- ❌ 보안 관리 필요
- ❌ 비용이 비쌈 (월 $50~)

**추천 대상**:
- ✅ 전문 개발자
- ✅ 특별한 서버 설정이 필요한 경우

---

## 💡 결론: Vercel Pro 강력 추천!

**이유**:
1. 가장 쉬움 (초보자도 10분 안에 완료)
2. 속도가 빠름
3. 안정적임
4. 관리가 필요 없음
5. Next.js에 최적화됨

**비용**: 월 $20 (약 26,000원)
- 무제한 트래픽
- 자동 SSL
- 글로벌 CDN
- 무제한 배포

---

## 2. 도메인 구매 가이드

### 추천 도메인 업체 (한국)

#### 🥇 1위: 가비아 (Gabia)

**링크**: https://www.gabia.com

**장점**:
- ✅ 한국 최대 도메인 업체
- ✅ 한국어 고객센터
- ✅ 다양한 결제 방법
- ✅ 신뢰도 높음

**가격** (연간):
- `.com`: 약 15,000원
- `.co.kr`: 약 18,000원
- `.kr`: 약 20,000원

**구매 방법**:
1. https://domain.gabia.com 접속
2. 원하는 도메인 검색 (예: `totopick.com`)
3. 사용 가능하면 "구매하기"
4. 회원가입 및 결제
5. 완료!

---

#### 🥈 2위: 호스팅케이알

**링크**: https://www.hosting.kr

**장점**:
- ✅ 저렴한 가격
- ✅ 한국어 지원
- ✅ 간편한 인터페이스

**가격** (연간):
- `.com`: 약 12,000원
- `.co.kr`: 약 16,000원

---

#### 🥉 3위: 후이즈 (Whois)

**링크**: https://www.whois.co.kr

**장점**:
- ✅ 깔끔한 인터페이스
- ✅ 빠른 처리

**가격** (연간):
- `.com`: 약 14,000원

---

### 도메인 이름 선택 팁

#### ✅ 좋은 도메인:
- 짧고 기억하기 쉬움 (예: `totopick.com`)
- 철자가 간단함
- `.com` 확장자 (가장 신뢰도 높음)
- 발음하기 쉬움

#### ❌ 나쁜 도메인:
- 너무 김 (예: `my-awesome-toto-website-2024.com`)
- 숫자와 하이픈 많음
- 이상한 확장자 (`.xyz`, `.info`)

---

## 3. Vercel Pro 배포 (추천)

### 3-1. Vercel Pro 업그레이드

1. **Vercel 대시보드 접속**:
   ```
   https://vercel.com/account/billing
   ```

2. **"Upgrade to Pro" 클릭**

3. **결제 정보 입력**:
   - 신용카드 (Visa, Mastercard)
   - 월 $20 자동 결제

4. **업그레이드 완료**

### 3-2. 혜택 확인

Pro 플랜 혜택:
- ✅ 무제한 대역폭
- ✅ **Cron Jobs 무제한** (자동 게시글 여러 번 가능!)
- ✅ 팀원 추가 가능
- ✅ 우선 지원
- ✅ 고급 분석 도구

---

## 4. 커스텀 도메인 연결

### 4-1. Vercel에서 도메인 추가

1. **Vercel 프로젝트 설정**:
   ```
   https://vercel.com/ariasjj/re-totopick/settings/domains
   ```

2. **"Add Domain" 클릭**

3. **도메인 입력**:
   ```
   totopick.com
   ```

4. **"Add" 클릭**

### 4-2. DNS 설정 (가비아 기준)

1. **가비아 접속**:
   ```
   https://www.gabia.com → My가비아 → 서비스 관리
   ```

2. **DNS 정보 클릭**

3. **레코드 수정**:

#### A 레코드 (루트 도메인):

| 호스트 | 타입 | 값/위치 |
|--------|------|---------|
| @ | A | `76.76.21.21` |

#### CNAME 레코드 (www):

| 호스트 | 타입 | 값/위치 |
|--------|------|---------|
| www | CNAME | `cname.vercel-dns.com` |

4. **저장**

### 4-3. 도메인 확인

약 10분~1시간 후:
- `https://totopick.com` 접속
- Vercel이 자동으로 SSL 인증서 발급
- HTTPS 자동 적용 ✅

---

## 5. 데이터베이스 업그레이드

### 현재 상태: Supabase 무료 플랜

**제한 사항**:
- 500MB 저장공간
- 월 5GB 데이터 전송
- 월 200만 요청

### 5-1. Supabase Pro 업그레이드

**비용**: 월 $25 (약 33,000원)

**혜택**:
- ✅ 8GB 데이터베이스
- ✅ 월 50GB 데이터 전송
- ✅ 일일 자동 백업
- ✅ 우선 지원

**업그레이드 방법**:

1. **Supabase 대시보드 접속**:
   ```
   https://supabase.com/dashboard/project/[프로젝트ID]/settings/billing
   ```

2. **"Upgrade to Pro" 클릭**

3. **결제 정보 입력**

4. **업그레이드 완료**

### 5-2. 대안: 별도 PostgreSQL 서버

#### 옵션 A: Railway.app

**링크**: https://railway.app

**비용**: 월 $5부터

**장점**:
- ✅ 간단한 설정
- ✅ 자동 백업
- ✅ 저렴함

**설정 방법**:
1. Railway 회원가입
2. "New Project" → "PostgreSQL"
3. 데이터베이스 생성
4. 연결 정보 복사
5. Vercel 환경 변수에 `DATABASE_URL` 업데이트

#### 옵션 B: AWS RDS

**비용**: 월 $15부터

**장점**:
- ✅ 매우 안정적
- ✅ 확장성 좋음

**단점**:
- ❌ 설정이 복잡함

---

## 6. 환경 변수 프로덕션 설정

### 6-1. Vercel 환경 변수 업데이트

**중요**: 프로덕션 환경에는 **실제 값**을 사용하세요!

1. **Vercel 프로젝트 설정**:
   ```
   https://vercel.com/ariasjj/re-totopick/settings/environment-variables
   ```

2. **환경 변수 업데이트**:

#### DATABASE_URL

기존 (테스트):
```
postgresql://...@aws-0-...
```

프로덕션 (Supabase Pro):
```
postgresql://...@aws-0-...(동일 또는 새 연결 문자열)
```

---

#### NEXTAUTH_URL

기존:
```
https://re-totopick.vercel.app
```

프로덕션 (커스텀 도메인):
```
https://totopick.com
```

⚠️ **중요**: 도메인 연결 후 반드시 업데이트하세요!

---

#### NEXTAUTH_SECRET

보안 강화를 위해 **새로운 시크릿** 생성:

**생성 방법**:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**예시 결과**:
```
Kj8xQ2mRt5pWnA7yB4cD9eF3gH6iL0oM1sT2uV3wX4zY5abCdEfGhIjKlMnOpQr
```

---

#### SMS_MODE

실제 SMS 발송을 위해:

기존:
```
simulation
```

프로덕션:
```
production
```

⚠️ **주의**: 실제 SMS API 설정 필요 (자세한 내용은 `docs/SMS-SETUP.md` 참조)

---

#### 새 환경 변수 추가 (보안)

**NODE_ENV**:
```
production
```

**ALLOWED_ORIGINS** (CORS 설정):
```
https://totopick.com,https://www.totopick.com
```

---

### 6-2. 환경 변수 적용

변경 후:
1. **"Save"** 클릭
2. **"Deployments"** 탭으로 이동
3. 최신 배포에서 **"Redeploy"** 클릭
4. 새 환경 변수로 재배포됨

---

## 7. SSL 인증서 설정

### ✅ Vercel은 자동으로 SSL 인증서 발급!

**작동 방식**:
1. 도메인을 Vercel에 추가
2. DNS 설정 확인
3. Let's Encrypt 인증서 자동 발급
4. HTTPS 자동 활성화
5. 자동 갱신 (만료 전)

### 확인 방법:

1. 브라우저에서 `https://totopick.com` 접속
2. 주소창에 **🔒 자물쇠 아이콘** 확인
3. 인증서 정보 확인:
   - 발급자: Let's Encrypt
   - 유효 기간: 90일 (자동 갱신)

### 문제 해결:

**"Not Secure" 경고가 표시되면**:
1. DNS 설정 재확인
2. 10-30분 대기
3. 여전히 안 되면 Vercel 지원팀에 문의

---

## 8. 성능 최적화

### 8-1. 이미지 최적화

**현재 상태 확인**:
- `public/` 폴더의 이미지들

**최적화 방법**:

```tsx
// ❌ 나쁜 예
<img src="/banner.jpg" alt="배너" />

// ✅ 좋은 예 (Next.js Image 사용)
import Image from 'next/image'

<Image
  src="/banner.jpg"
  alt="배너"
  width={800}
  height={600}
  priority
/>
```

**효과**:
- 50-70% 파일 크기 감소
- 자동 WebP 변환
- 레이지 로딩

---

### 8-2. 폰트 최적화

현재 프로젝트는 이미 최적화되어 있습니다! ✅

---

### 8-3. 캐싱 설정

Vercel이 자동으로 최적화:
- ✅ 정적 파일 캐싱
- ✅ API 응답 캐싱
- ✅ CDN 캐싱

---

### 8-4. 데이터베이스 쿼리 최적화

**성능 개선 팁**:

```typescript
// ❌ N+1 문제
const posts = await prisma.post.findMany()
for (const post of posts) {
  const user = await prisma.user.findUnique({ where: { id: post.userId } })
}

// ✅ include로 한 번에 조회
const posts = await prisma.post.findMany({
  include: {
    user: true,
  },
})
```

---

## 9. 모니터링 및 관리

### 9-1. Vercel Analytics

**활성화 방법**:

1. Vercel 프로젝트 설정:
   ```
   https://vercel.com/ariasjj/re-totopick/analytics
   ```

2. **"Enable Analytics"** 클릭

3. **무료 제공 항목**:
   - 방문자 수
   - 페이지뷰
   - 인기 페이지
   - 국가별 통계

---

### 9-2. 에러 모니터링 (Sentry)

**무료 에러 트래킹**:

1. **Sentry 가입**:
   ```
   https://sentry.io
   ```

2. **Next.js 프로젝트 생성**

3. **패키지 설치**:
   ```bash
   npm install @sentry/nextjs
   ```

4. **설정 파일 자동 생성**:
   ```bash
   npx @sentry/wizard -i nextjs
   ```

5. **에러 자동 수집** ✅

---

### 9-3. 로그 확인

**Vercel 로그**:
1. Vercel 대시보드
2. 프로젝트 클릭
3. **"Logs"** 탭
4. 실시간 로그 확인

**로그 보관 기간**:
- 무료: 1일
- Pro: 7일

---

## 10. 백업 및 복구

### 10-1. 데이터베이스 백업

#### 자동 백업 (Supabase Pro)

- ✅ 일일 자동 백업
- ✅ 7일 보관
- ✅ 클릭 한 번으로 복구

#### 수동 백업 (무료 플랜)

**매주 1회 수동 백업 권장**:

```bash
# PostgreSQL 덤프
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**복구 방법**:
```bash
psql $DATABASE_URL < backup_20250112.sql
```

---

### 10-2. 코드 백업

**GitHub가 자동으로 백업** ✅

**추가 백업**:
1. 정기적으로 `git push`
2. 중요한 변경 시 태그 생성:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

---

## 11. 대안: 다른 서버 옵션

### 옵션 1: 카페24 호스팅

**링크**: https://www.cafe24.com

**비용**: 월 5,000원부터

**장점**:
- ✅ 저렴함
- ✅ 한국어 지원
- ✅ 국내 결제

**단점**:
- ❌ 수동 배포
- ❌ 서버 설정 필요
- ❌ Node.js 버전 제한

**추천 대상**:
- 예산이 매우 적은 경우
- 트래픽이 적은 경우

---

### 옵션 2: Vultr VPS

**링크**: https://www.vultr.com

**비용**: 월 $6부터

**장점**:
- ✅ 완전한 제어권
- ✅ 한국 리전 지원 (서울)
- ✅ SSD 스토리지

**단점**:
- ❌ 서버 관리 필요
- ❌ 보안 설정 필요
- ❌ 복잡함

**추천 대상**:
- 서버 관리 경험이 있는 경우
- 특별한 서버 설정이 필요한 경우

---

### 옵션 3: Railway.app

**링크**: https://railway.app

**비용**: 월 $5부터

**장점**:
- ✅ Vercel보다 저렴
- ✅ PostgreSQL 포함
- ✅ 간단한 설정

**단점**:
- ❌ Vercel보다 느림
- ❌ CDN 없음

**추천 대상**:
- 비용을 절약하고 싶은 경우
- 트래픽이 적은 경우

---

## 📊 비용 비교표

| 항목 | 무료 | 기본 | 프로 |
|------|------|------|------|
| **호스팅** | Vercel 무료 | Vercel Pro $20 | VPS $50 |
| **도메인** | - | $15/년 | $15/년 |
| **DB** | Supabase 무료 | Supabase Pro $25 | Railway $5 |
| **SSL** | 무료 | 무료 | 무료 |
| **합계** | $0/월 | $45/월 | $55/월 |

---

## ✅ 추천 구성 (단계별)

### 1단계: 테스트 (현재)

- ✅ Vercel 무료
- ✅ Supabase 무료
- ✅ `vercel.app` 도메인
- **비용**: $0/월

---

### 2단계: 소규모 운영

- ✅ Vercel 무료
- ✅ Supabase 무료
- ✅ 커스텀 도메인 (가비아)
- **비용**: $15/년 (월 $1.25)

**이 단계로 충분합니다!** ⭐

---

### 3단계: 본격 운영

- ✅ Vercel Pro $20
- ✅ Supabase 무료
- ✅ 커스텀 도메인
- **비용**: $20/월 + $15/년

**추천 시기**:
- 일 방문자 1,000명 이상
- 자동 게시글 여러 번 필요
- 팀원 추가 필요

---

### 4단계: 대규모 운영

- ✅ Vercel Pro $20
- ✅ Supabase Pro $25
- ✅ Sentry (에러 모니터링)
- ✅ 커스텀 도메인
- **비용**: $45/월 + $15/년

**추천 시기**:
- 일 방문자 10,000명 이상
- 데이터베이스 500MB 이상
- 안정성이 매우 중요

---

## 🚀 배포 체크리스트

### 배포 전 확인사항

- [ ] 모든 기능 테스트 완료
- [ ] 에러 로그 확인
- [ ] 데이터베이스 백업
- [ ] 환경 변수 확인
- [ ] README 업데이트

### 도메인 연결

- [ ] 도메인 구매 완료
- [ ] DNS 설정 완료
- [ ] Vercel에 도메인 추가
- [ ] SSL 인증서 확인
- [ ] NEXTAUTH_URL 업데이트

### 보안 설정

- [ ] NEXTAUTH_SECRET 변경
- [ ] 데이터베이스 비밀번호 강화
- [ ] 관리자 비밀번호 변경
- [ ] 환경 변수 확인
- [ ] CORS 설정

### 성능 최적화

- [ ] 이미지 최적화
- [ ] 데이터베이스 인덱스 확인
- [ ] 캐싱 설정
- [ ] 불필요한 코드 제거

### 모니터링

- [ ] Vercel Analytics 활성화
- [ ] 에러 모니터링 설정 (선택)
- [ ] 로그 확인 방법 숙지
- [ ] 백업 일정 설정

---

## 🎯 빠른 시작 가이드 (10분 완성)

### 최소 비용으로 시작하기:

1. **도메인 구매** (가비아)
   - 비용: 15,000원/년
   - 시간: 5분

2. **Vercel에 도메인 연결**
   - 비용: 무료
   - 시간: 5분
   - DNS 설정 후 10분 대기

3. **환경 변수 업데이트**
   - NEXTAUTH_URL 변경
   - 시간: 1분

4. **완료!** 🎉
   - 총 비용: 15,000원/년 (월 1,250원)
   - 총 시간: 10분 + 대기 10분

---

## 📞 고객 지원

### Vercel 지원

- 이메일: support@vercel.com
- 문서: https://vercel.com/docs
- 커뮤니티: https://github.com/vercel/vercel/discussions

### Supabase 지원

- 이메일: support@supabase.io
- 문서: https://supabase.com/docs
- Discord: https://discord.supabase.com

### 가비아 지원

- 전화: 1544-4755
- 이메일: help@gabia.com
- 평일 09:00 - 18:00

---

## 🆘 문제 해결

### "도메인이 연결되지 않아요"

**해결 방법**:
1. DNS 설정 재확인
2. 10-30분 대기
3. 캐시 삭제: Ctrl + Shift + R
4. Vercel 지원팀 문의

---

### "SSL 인증서가 발급되지 않아요"

**해결 방법**:
1. DNS 전파 확인: https://dnschecker.org
2. 1-2시간 대기
3. Vercel에서 "Refresh SSL" 클릭

---

### "사이트가 느려요"

**원인 파악**:
1. Vercel Analytics에서 성능 확인
2. 데이터베이스 쿼리 최적화
3. 이미지 최적화
4. CDN 캐싱 확인

---

## 🎓 추가 학습 자료

### 배포 관련

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 프로덕션 체크리스트](https://supabase.com/docs/guides/platform/going-into-prod)

### 보안

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js 보안 모범 사례](https://nextjs.org/docs/going-to-production)

### 성능

- [Web Vitals](https://web.dev/vitals/)
- [Next.js 성능 최적화](https://nextjs.org/docs/advanced-features/measuring-performance)

---

## 🎊 축하합니다!

**정식 배포 가이드를 모두 읽으셨습니다!**

### 다음 단계:

1. ✅ 도메인 구매
2. ✅ Vercel에 연결
3. ✅ 환경 변수 업데이트
4. ✅ SSL 확인
5. ✅ 서비스 시작! 🚀

---

**궁금한 점이 있으시면 언제든지 문의하세요!**

**마지막 업데이트**: 2025년 11월 12일

