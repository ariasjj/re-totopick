# 🔧 Git 설치 가이드 (Windows)

> **Vercel 배포를 위해 Git이 필요합니다**

---

## 방법 1: Git 설치 (추천)

### 1단계: Git 다운로드

1. https://git-scm.com/download/win 접속
2. **자동으로 다운로드 시작** (Click here to download manually 클릭 가능)
3. 다운로드된 파일 실행 (`Git-2.xx.x-64-bit.exe`)

### 2단계: Git 설치

설치 과정에서 대부분 **기본 설정**으로 진행:

1. **Select Components**: 그대로 Next
2. **Choosing the default editor**: 기본값 (Vim) → Next
3. **Adjusting your PATH environment**: 
   - ✅ **Git from the command line and also from 3rd-party software** (추천)
4. **Choosing HTTPS transport backend**: 기본값 → Next
5. **Configuring the line ending conversions**: 기본값 → Next
6. **Configuring the terminal emulator**: 기본값 → Next
7. 나머지: 모두 기본값으로 **Next**
8. **Install** 클릭

### 3단계: 설치 확인

새 PowerShell 창을 열고:

```bash
git --version
```

**결과**:
```
git version 2.xx.x
```

이렇게 나오면 성공! ✅

### 4단계: Git 설정

```bash
# 사용자 이름 설정 (GitHub 사용자명)
git config --global user.name "Your Name"

# 이메일 설정 (GitHub 이메일)
git config --global user.email "your.email@example.com"
```

---

## 방법 2: GitHub Desktop (더 쉬움)

### 1단계: GitHub Desktop 다운로드

1. https://desktop.github.com 접속
2. **Download for Windows** 클릭
3. 다운로드된 파일 실행

### 2단계: GitHub Desktop 로그인

1. GitHub Desktop 실행
2. **Sign in to GitHub.com** 클릭
3. 브라우저에서 GitHub 로그인
4. **Authorize desktop** 클릭

### 3단계: 프로젝트 추가

#### 새 저장소 만들기

1. File → **Add Local Repository**
2. **Choose...** 클릭
3. `C:\Users\ADMIN\Desktop\totopick` 선택
4. **Repository not found** 나오면 → **create a repository** 클릭
5. 설정:
   - Name: `totopick`
   - Local Path: `C:\Users\ADMIN\Desktop\totopick`
   - ✅ **Initialize this repository with a README** (체크 해제)
   - Git Ignore: None
   - License: None
6. **Create Repository** 클릭

### 4단계: GitHub에 업로드

1. 좌측 하단 **Publish repository** 클릭
2. 설정:
   - Name: `totopick`
   - Description: `토토픽 커뮤니티 웹사이트`
   - ☑️ **Keep this code private** (보안상 권장)
3. **Publish Repository** 클릭

---

## GitHub Desktop 사용법

### 변경사항 확인

**Changes** 탭에서 수정된 파일 확인

### 커밋하기

1. 좌측 하단 **Summary** 입력 (예: "로그인 기능 추가")
2. **Description** 입력 (선택사항)
3. **Commit to main** 클릭

### GitHub에 업로드 (Push)

상단 **Push origin** 버튼 클릭

---

## 빠른 시작 (GitHub Desktop)

### 전체 과정

```
1. GitHub Desktop 설치
   ↓
2. GitHub 로그인
   ↓
3. 로컬 저장소 추가 (totopick 폴더)
   ↓
4. Commit (Summary 입력 → Commit to main)
   ↓
5. Publish repository (GitHub에 업로드)
   ↓
6. Vercel에서 배포 진행!
```

---

## 다음 단계

Git 설치가 완료되면:

### 터미널 방식 (Git 설치한 경우)

```bash
# 1. 프로젝트 폴더로 이동
cd c:\Users\ADMIN\Desktop\totopick

# 2. Git 초기화
git init

# 3. 모든 파일 추가
git add .

# 4. 첫 커밋
git commit -m "Initial commit: 토토픽 프로젝트"

# 5. GitHub 저장소 연결 (GitHub에서 저장소 만든 후)
git remote add origin https://github.com/YOUR_USERNAME/totopick.git

# 6. 업로드
git branch -M main
git push -u origin main
```

### GitHub Desktop 방식 (더 쉬움)

1. ✅ Add Local Repository
2. ✅ Create Repository
3. ✅ Commit to main
4. ✅ Publish Repository
5. ✅ 완료!

---

## 문제 해결

### Q: Git 명령어가 인식되지 않아요

**원인**: PowerShell을 재시작하지 않았거나 PATH 설정이 안 됨

**해결**:
1. PowerShell 완전히 종료
2. 새 PowerShell 창 열기
3. `git --version` 다시 시도

### Q: GitHub Desktop이 느려요

**원인**: 프로젝트 파일이 많음 (특히 node_modules)

**해결**: `.gitignore` 파일이 제대로 설정되어 있는지 확인

```gitignore
node_modules/
.next/
.env.local
```

---

## 추천 방법

### 초보자

→ **GitHub Desktop** 사용 (GUI, 쉬움)

### 경험자

→ **Git 명령어** 사용 (터미널, 빠름)

---

**설치 완료 후 [Vercel 배포 가이드](VERCEL-DEPLOYMENT.md)로 돌아가세요!** 🚀

