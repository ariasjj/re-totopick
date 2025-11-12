# ✅ Vercel 배포 체크리스트

> **한 눈에 보는 배포 순서**

---

## 📋 전체 과정 (30분 소요)

```
Git 설치 → GitHub 업로드 → Vercel 배포 → 환경변수 설정 → 완료!
```

---

## 1️⃣ Git 설치 (5분)

### 방법 A: Git 설치 (개발자용)

- [ ] https://git-scm.com/download/win 접속
- [ ] Git 다운로드 및 설치
- [ ] PowerShell에서 `git --version` 확인
- [ ] Git 설정:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your@email.com"
  ```

### 방법 B: GitHub Desktop (초보자 추천) ⭐

- [ ] https://desktop.github.com 접속
- [ ] GitHub Desktop 다운로드 및 설치
- [ ] GitHub 계정으로 로그인

**자세한 설명**: [Git 설치 가이드](docs/GIT-INSTALLATION.md)

---

## 2️⃣ GitHub에 업로드 (10분)

### GitHub Desktop 사용 시 (추천)

- [ ] File → Add Local Repository
- [ ] `C:\Users\ADMIN\Desktop\totopick` 선택
- [ ] Create Repository 클릭
- [ ] 좌측 하단 Summary: "Initial commit" 입력
- [ ] **Commit to main** 클릭
- [ ] **Publish repository** 클릭
- [ ] ✅ Keep this code private 체크
- [ ] Publish 클릭

### Git 명령어 사용 시

```bash
cd c:\Users\ADMIN\Desktop\totopick
git init
git add .
git commit -m "Initial commit"
```

그 다음 GitHub에서:
- [ ] https://github.com → New repository
- [ ] Repository name: `totopick`
- [ ] Private 선택
- [ ] Create repository
- [ ] 터미널로 돌아가서:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/totopick.git
  git branch -M main
  git push -u origin main
  ```

**자세한 설명**: [Vercel 배포 가이드 - GitHub 섹션](docs/VERCEL-DEPLOYMENT.md#github에-코드-업로드)

---

## 3️⃣ Vercel 배포 (10분)

### Vercel 계정 만들기

- [ ] https://vercel.com 접속
- [ ] **Sign Up** 클릭
- [ ] **Continue with GitHub** 선택
- [ ] GitHub 계정으로 로그인
- [ ] Authorize Vercel 클릭

### 프로젝트 배포

- [ ] **Add New...** → **Project** 클릭
- [ ] `totopick` 저장소 찾기
- [ ] **Import** 클릭
- [ ] **아직 Deploy 클릭하지 마세요!** ⚠️

---

## 4️⃣ 환경변수 설정 (5분) ⚠️ 중요!

### 비밀키 생성

PowerShell에서 실행:

```bash
# NEXTAUTH_SECRET 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

결과를 복사해두세요!

```bash
# CRON_SECRET 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

결과를 복사해두세요!

### Vercel에서 환경변수 추가

**Environment Variables** 섹션에서 다음을 추가:

#### ✅ DATABASE_URL
- [ ] Name: `DATABASE_URL`
- [ ] Value: Supabase Session Pooler URL
  ```
  postgresql://postgres.[ID]:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true
  ```
- [ ] Environments: Production, Preview, Development 모두 체크
- [ ] **Add** 클릭

#### ✅ NEXTAUTH_SECRET
- [ ] Name: `NEXTAUTH_SECRET`
- [ ] Value: 위에서 생성한 첫 번째 비밀키
- [ ] Environments: 모두 체크
- [ ] **Add** 클릭

#### ✅ NEXTAUTH_URL
- [ ] Name: `NEXTAUTH_URL`
- [ ] Value: `https://totopick.vercel.app` (나중에 실제 URL로 변경)
- [ ] Environments: 모두 체크
- [ ] **Add** 클릭

#### ✅ SMS_MODE
- [ ] Name: `SMS_MODE`
- [ ] Value: `test`
- [ ] Environments: 모두 체크
- [ ] **Add** 클릭

#### ✅ CRON_SECRET
- [ ] Name: `CRON_SECRET`
- [ ] Value: 위에서 생성한 두 번째 비밀키
- [ ] Environments: 모두 체크
- [ ] **Add** 클릭

---

## 5️⃣ 배포 시작! (2-3분)

- [ ] 아래로 스크롤
- [ ] 큰 파란색 **Deploy** 버튼 클릭
- [ ] ☕ 잠시 기다리기 (2-3분)
- [ ] 🎉 배포 완료!

---

## 6️⃣ 배포 후 설정

### URL 확인 및 업데이트

배포 완료 후 받은 URL (예: `https://totopick-abc123.vercel.app`)을 확인하고:

- [ ] Vercel 대시보드 → Settings → Environment Variables
- [ ] `NEXTAUTH_URL` 찾기
- [ ] **Edit** 클릭
- [ ] 실제 배포 URL로 변경
- [ ] **Save** 클릭
- [ ] 자동으로 재배포됨 (1-2분)

### 데이터베이스 시드 (선택사항)

로컬에서 프로덕션 데이터베이스에 초기 데이터 추가:

```bash
npm run db:seed
```

---

## 7️⃣ 테스트

### 사이트 접속 확인

- [ ] 배포된 URL 접속 (https://totopick-xxx.vercel.app)
- [ ] 메인 페이지 로딩 확인
- [ ] 각 메뉴 클릭 확인

### 로그인 테스트

```
관리자 계정:
이메일: admin@totopick.com
비밀번호: admin123!@#

테스트 계정:
이메일: test@test.com
비밀번호: test123!@#
```

- [ ] 로그인 작동 확인
- [ ] 로그아웃 작동 확인

### 관리자 기능 테스트

- [ ] `/admin` 접속 (관리자 계정으로)
- [ ] 대시보드 확인

### Cron Jobs 확인

- [ ] Vercel 대시보드 → Cron Jobs 탭
- [ ] `/api/cron/auto-post` 확인
- [ ] **Test** 버튼으로 수동 실행
- [ ] 게시판에 게시글 생성 확인

---

## 🎉 완료!

### 체크리스트 요약

```
✅ Git 설치
✅ GitHub 업로드
✅ Vercel 배포
✅ 환경변수 설정
✅ 사이트 접속 확인
✅ 로그인 테스트
✅ 관리자 페이지 확인
✅ Cron Jobs 작동 확인
```

---

## 📊 배포 정보

### 주소

```
개발: http://localhost:3000
배포: https://totopick-xxx.vercel.app
```

### 계정

```
관리자: admin@totopick.com / admin123!@#
테스트: test@test.com / test123!@#
```

### Cron 스케줄

```
매일 9시, 15시, 21시에 자동 게시글 생성
```

---

## 🔄 업데이트 방법

코드 수정 후:

### GitHub Desktop 사용 시

1. Summary 입력
2. **Commit to main** 클릭
3. **Push origin** 클릭
4. Vercel이 자동으로 재배포! ✨

### Git 명령어 사용 시

```bash
git add .
git commit -m "업데이트 내용"
git push
```

Vercel이 자동으로 감지하고 재배포합니다!

---

## 🆘 문제 발생 시

### 빌드 실패

- [ ] Vercel → Deployments → 실패한 배포 클릭
- [ ] 로그 확인
- [ ] 로컬에서 `npm run build` 테스트

### 데이터베이스 연결 실패

- [ ] `DATABASE_URL` 확인
- [ ] Supabase Session Pooler URL 사용 확인
- [ ] `?pgbouncer=true` 포함 확인

### 로그인 안 됨

- [ ] `NEXTAUTH_URL`이 실제 배포 URL과 일치하는지 확인
- [ ] `https://` 포함 확인
- [ ] 재배포 (환경변수 변경 후 필수)

### 500 에러

- [ ] Vercel → Logs 탭 확인
- [ ] 환경변수 모두 설정되었는지 확인

---

## 📚 상세 가이드

더 자세한 내용은 다음 문서를 참고하세요:

- 🚀 [Vercel 배포 가이드](docs/VERCEL-DEPLOYMENT.md)
- 🔧 [Git 설치 가이드](docs/GIT-INSTALLATION.md)
- 🤖 [자동 게시글 가이드](docs/AUTO-POST-GUIDE.md)

---

## 💰 비용

```
Vercel 무료 플랜: $0/월
Supabase 무료 플랜: $0/월
도메인 (선택): $10-20/년

총: 무료! 🎉
```

---

## 🎯 다음 단계

배포 완료 후:

1. [ ] 도메인 연결 (totopick.com)
2. [ ] Google Analytics 추가
3. [ ] SEO 최적화
4. [ ] 사용자 모집 시작!

---

**축하합니다! 이제 전 세계에서 접속 가능합니다!** 🌍✨

