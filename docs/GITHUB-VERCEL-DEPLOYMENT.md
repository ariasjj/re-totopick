# GitHub와 Vercel 배포 완벽 가이드

> **초보자를 위한 단계별 배포 가이드**
> 
> 이 문서는 Next.js 프로젝트를 GitHub에 업로드하고 Vercel로 배포하는 전체 과정을 설명합니다.

---

## 📋 목차

1. [사전 준비](#사전-준비)
2. [Git 설치](#1-git-설치)
3. [GitHub 계정 만들기](#2-github-계정-만들기)
4. [GitHub 저장소 생성](#3-github-저장소-생성)
5. [Git으로 코드 업로드](#4-git으로-코드-업로드)
6. [Vercel 배포](#5-vercel-배포)
7. [환경 변수 설정](#6-환경-변수-설정)
8. [배포 완료 및 확인](#7-배포-완료-및-확인)
9. [코드 수정 후 재배포](#8-코드-수정-후-재배포)
10. [문제 해결](#문제-해결)

---

## 사전 준비

### 필요한 것들

- ✅ 컴퓨터 (Windows, Mac, Linux)
- ✅ 인터넷 연결
- ✅ Next.js 프로젝트 (이미 있음)
- ✅ GitHub 계정
- ✅ Vercel 계정

### 예상 소요 시간

- **처음 배포**: 약 30분
- **두 번째부터**: 약 5분

---

## 1. Git 설치

### Git이란?

코드의 변경 사항을 관리하는 도구입니다. GitHub에 코드를 올리려면 반드시 필요합니다.

### 1-1. Git 다운로드

**Windows 사용자**:

1. 다음 링크로 이동: https://git-scm.com/download/win
2. 자동으로 다운로드가 시작됩니다
3. 다운로드한 파일을 실행하세요

**설치 옵션**:
- 모두 **기본값**으로 진행하세요
- "Next" 버튼만 계속 클릭하면 됩니다

### 1-2. Git 설치 확인

**PowerShell**을 열고 다음 명령어를 입력하세요:

```powershell
git --version
```

**결과 예시**:
```
git version 2.51.2.windows.1
```

✅ 버전이 표시되면 설치 완료!
❌ 오류가 발생하면 PowerShell을 **재시작**하세요

---

## 2. GitHub 계정 만들기

### 2-1. 회원가입

1. https://github.com 접속
2. **"Sign up"** 버튼 클릭
3. 이메일, 비밀번호, 사용자명 입력
4. 이메일 인증 완료

### 2-2. 로그인

회원가입 후 자동으로 로그인됩니다.

---

## 3. GitHub 저장소 생성

### 저장소(Repository)란?

코드를 저장하는 온라인 폴더입니다.

### 3-1. 새 저장소 만들기

1. GitHub에 로그인한 상태에서 https://github.com/new 접속
2. 다음 정보를 입력하세요:

**Repository name**: `totopick` (또는 원하는 이름)

**설정**:
- **Public** 선택 (누구나 볼 수 있음)
- ❌ **"Add a README file"** 체크 해제 ⚠️ (중요!)
- ❌ **.gitignore** 선택 안 함
- ❌ **License** 선택 안 함

3. **"Create repository"** 버튼 클릭

### 3-2. 저장소 URL 확인

저장소가 생성되면 다음과 같은 URL이 표시됩니다:

```
https://github.com/사용자명/totopick.git
```

이 URL을 **메모장에 복사**해두세요! (나중에 사용)

---

## 4. Git으로 코드 업로드

### 4-1. PowerShell 열기

1. **Windows 키** 누르기
2. **"PowerShell"** 입력
3. **"Windows PowerShell"** 실행

### 4-2. 프로젝트 폴더로 이동

프로젝트가 `C:\Users\ADMIN\Desktop\totopick`에 있다면:

```powershell
cd C:\Users\ADMIN\Desktop\totopick
```

**확인 방법**:
```powershell
dir
```
프로젝트 파일들(package.json, app, components 등)이 보이면 성공!

### 4-3. Git 사용자 설정

처음 Git을 사용한다면 다음을 입력하세요:

```powershell
git config --global user.name "GitHub사용자명"
git config --global user.email "GitHub이메일"
```

**예시**:
```powershell
git config --global user.name "ariasjj"
git config --global user.email "ariasjj@users.noreply.github.com"
```

### 4-4. Git 저장소 초기화

```powershell
git init
```

**결과**:
```
Initialized empty Git repository in C:/Users/ADMIN/Desktop/totopick/.git/
```

### 4-5. 모든 파일 추가

```powershell
git add .
```

**설명**: 현재 폴더의 모든 파일을 Git에 추가합니다.

### 4-6. 첫 번째 커밋

```powershell
git commit -m "Initial commit"
```

**결과 예시**:
```
[master (root-commit) 0a827e3] Initial commit
 94 files changed, 20443 insertions(+)
```

### 4-7. 기본 브랜치 이름 변경

```powershell
git branch -M main
```

### 4-8. GitHub 저장소 연결

**3-2단계에서 복사한 URL**을 사용하세요:

```powershell
git remote add origin https://github.com/사용자명/totopick.git
```

**예시**:
```powershell
git remote add origin https://github.com/ariasjj/totopick.git
```

### 4-9. GitHub에 업로드

```powershell
git push -u origin main
```

**결과**:
```
To https://github.com/ariasjj/totopick.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

✅ **업로드 완료!**

### 4-10. GitHub에서 확인

GitHub 웹사이트에서 저장소를 새로고침하면 업로드된 파일들이 보입니다!

---

## 5. Vercel 배포

### Vercel이란?

웹사이트를 무료로 호스팅해주는 서비스입니다. Next.js와 완벽하게 호환됩니다.

### 5-1. Vercel 계정 만들기

1. https://vercel.com 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택 (권장)
4. GitHub 계정으로 로그인

### 5-2. 새 프로젝트 생성

1. https://vercel.com/new 접속
2. **"Import Git Repository"** 섹션에서 저장소 찾기
3. 방금 만든 저장소(예: `totopick`) 선택
4. **"Import"** 버튼 클릭

### 5-3. 프로젝트 설정 확인

다음 설정이 자동으로 감지됩니다:

- **Framework Preset**: Next.js ✅
- **Root Directory**: ./ ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅

**그대로 두세요!** (수정 불필요)

---

## 6. 환경 변수 설정

### 환경 변수란?

데이터베이스 연결 정보, 비밀 키 등 **외부에 노출되면 안 되는** 중요한 정보입니다.

### 6-1. 환경 변수 섹션 열기

Vercel Import 페이지에서:
- **"Environment Variables"** 섹션을 찾으세요
- 클릭해서 펼치세요

### 6-2. 필수 환경 변수 추가

다음 **5개의 환경 변수**를 하나씩 추가하세요:

#### ① DATABASE_URL

**Name**: (정확히 입력)
```
DATABASE_URL
```

**Value**: (Supabase 연결 문자열)
```
postgresql://postgres.프로젝트ID:비밀번호@호스트:5432/postgres?pgbouncer=true
```

⚠️ **주의**: 비밀번호에 특수문자가 있으면 URL 인코딩 필요!
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`

**예시**:
```
postgresql://postgres.mymynphdjehyyymlqnip:MySecurePass123%21@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true
```

---

#### ② NEXTAUTH_SECRET

**Name**:
```
NEXTAUTH_SECRET
```

**Value**: (랜덤한 32자 이상의 문자열)

**생성 방법** (PowerShell):
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**예시 결과**:
```
EWb8Aj9RlL2a7OyZrtmDH1McU3nxVqPJ
```

---

#### ③ NEXTAUTH_URL

**Name**:
```
NEXTAUTH_URL
```

**Value**: (Vercel 배포 URL)
```
https://프로젝트이름.vercel.app
```

**예시**:
```
https://totopick.vercel.app
```

⚠️ **주의**: 프로젝트 이름에 맞게 수정하세요!

---

#### ④ CRON_SECRET

**Name**:
```
CRON_SECRET
```

**Value**: (랜덤한 32자 이상의 문자열)

**생성 방법** (NEXTAUTH_SECRET과 동일):
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**예시 결과**:
```
ExnA0GiyBMFcWRX517dgICbjQT2aSpw3
```

---

#### ⑤ SMS_MODE

**Name**:
```
SMS_MODE
```

**Value**:
```
simulation
```

**설명**: 실제 SMS를 보내지 않고 시뮬레이션만 합니다 (무료)

---

### 6-3. 환경 변수 확인

총 **5개**가 추가되었는지 확인하세요:

✅ DATABASE_URL
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
✅ CRON_SECRET
✅ SMS_MODE

---

## 7. 배포 완료 및 확인

### 7-1. 배포 시작

모든 환경 변수를 추가했으면:

**"Deploy"** 버튼을 클릭하세요! 🚀

### 7-2. 배포 진행 상황

다음과 같은 단계가 진행됩니다:

1. 🔵 **Building...** (빌드 중)
   - 코드를 분석하고 최적화합니다
   - 약 2-3분 소요

2. ✅ **Build Completed** (빌드 완료)

3. 🚀 **Deploying...** (배포 중)
   - 서버에 업로드합니다

4. 🎉 **Success!** (성공!)

### 7-3. 배포 완료

**"Congratulations!"** 메시지가 표시되면 배포 완료!

**"Continue to Dashboard"** 또는 **"Visit"** 버튼을 클릭하세요.

---

## 8. 코드 수정 후 재배포

### 코드를 수정했을 때

파일을 수정한 후 다시 배포하는 방법입니다.

### 8-1. 변경사항 추가

```powershell
cd C:\Users\ADMIN\Desktop\totopick
git add .
```

### 8-2. 커밋

```powershell
git commit -m "수정 내용 설명"
```

**예시**:
```powershell
git commit -m "홈페이지 디자인 수정"
git commit -m "버그 수정"
git commit -m "새 기능 추가"
```

### 8-3. GitHub에 업로드

```powershell
git push
```

### 8-4. 자동 재배포

✅ Vercel이 **자동으로** 감지하고 재배포합니다!

1-2분 후 사이트에 변경사항이 반영됩니다.

---

## 문제 해결

### ❌ "git: command not found"

**원인**: Git이 설치되지 않았거나 PATH에 등록되지 않음

**해결**:
1. PowerShell을 **완전히 종료**하고 다시 실행
2. 그래도 안 되면 Git을 다시 설치

---

### ❌ "Error: No Next.js version detected"

**원인**: Vercel의 Framework Preset이 잘못 설정됨

**해결**:
1. Vercel 프로젝트 **Settings** → **General**
2. **"Framework Preset"**을 **"Next.js"**로 변경
3. **"Save"** 클릭
4. **"Deployments"** 탭에서 **"Redeploy"** 클릭

---

### ❌ "Build error occurred" (Prisma 관련)

**원인**: Prisma Client가 생성되지 않음

**해결**: `package.json`에 다음 추가 확인

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

추가 후:
```powershell
git add package.json
git commit -m "Add postinstall script"
git push
```

---

### ❌ 데이터베이스 연결 오류

**원인**: DATABASE_URL이 잘못되었거나 특수문자가 인코딩되지 않음

**해결**:
1. Vercel **Settings** → **Environment Variables**
2. **DATABASE_URL** 확인
3. 비밀번호의 특수문자를 URL 인코딩으로 변경:
   - `!` → `%21`
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
4. **"Save"** 후 **"Redeploy"**

---

### ❌ "Repository already exists"

**원인**: GitHub에 같은 이름의 저장소가 이미 있음

**해결**:
- **방법 1**: GitHub에서 기존 저장소 삭제
- **방법 2**: 다른 이름으로 저장소 생성

---

## 📚 유용한 명령어 모음

### Git 기본 명령어

```powershell
# 현재 상태 확인
git status

# 변경사항 확인
git diff

# 커밋 기록 보기
git log

# 최근 커밋 취소 (파일 유지)
git reset --soft HEAD~1

# 원격 저장소 URL 확인
git remote -v
```

### 배포 URL 확인

Vercel 대시보드에서:
1. 프로젝트 클릭
2. **"Domains"** 섹션에서 URL 확인

기본 URL 형식:
```
https://프로젝트이름.vercel.app
```

---

## 🎉 축하합니다!

GitHub와 Vercel을 사용한 배포를 완료했습니다!

### 배포 후 해야 할 일

1. **데이터베이스 초기화**:
   ```powershell
   npm run db:push
   npm run db:seed
   ```

2. **관리자 계정으로 로그인**:
   - 이메일: `admin@totopick.com`
   - 비밀번호: `admin123!`

3. **사이트 테스트**:
   - 회원가입
   - 로그인
   - 게시글 작성
   - 댓글 작성

---

## 📖 관련 문서

- [홈페이지 관리 가이드](./HOMEPAGE-MANAGEMENT-GUIDE.md)
- [빠른 시작 가이드](./QUICK-START.md)
- [자동 게시물 가이드](./AUTO-POST-GUIDE.md)
- [Vercel 배포 가이드](./VERCEL-DEPLOYMENT.md)

---

## 💡 팁

### 빠른 배포 프로세스

**한 번 설정 후에는 다음 3줄만 실행하면 됩니다**:

```powershell
git add .
git commit -m "수정 내용"
git push
```

**끝!** Vercel이 자동으로 배포합니다. 😎

---

## 🆘 도움이 필요하신가요?

- GitHub 도움말: https://docs.github.com
- Vercel 도움말: https://vercel.com/docs
- Next.js 도움말: https://nextjs.org/docs

---

**마지막 업데이트**: 2025년 11월 12일

