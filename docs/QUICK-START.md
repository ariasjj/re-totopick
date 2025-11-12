# ⚡ 빠른 시작 가이드

> **5분 안에 가장 중요한 것만 수정하기**

---

## 🎯 가장 많이 수정하는 것들

### 1️⃣ 사이트 이름 바꾸기 (2분)

#### 📁 `components/layout/header.tsx` 파일 열기

```tsx
// 13줄 찾아서 수정
<Link href="/" className="text-2xl font-bold text-primary">
  TOTOPICK          ← 여기를 원하는 이름으로 변경
</Link>
```

---

### 2️⃣ 메인 페이지 문구 바꾸기 (1분)

#### 📁 `app/page.tsx` 파일 열기

```tsx
// 35-40줄 찾아서 수정
<h1 className="text-4xl font-bold mb-4">
  토토픽에 오신 것을 환영합니다    ← 여기 수정
</h1>
<p className="text-xl text-muted-foreground">
  현명한 선택, 토토픽에서          ← 여기 수정
</p>
```

---

### 3️⃣ 메인 색상 바꾸기 (1분)

#### 📁 `app/globals.css` 파일 열기

```css
/* 12줄 찾아서 수정 */
:root {
  --primary: 210 100% 50%;   ← 이 숫자들을 변경
}

/* 인기 색상 조합 복사해서 붙여넣기 */

/* 🔴 빨간색 */
--primary: 0 84% 60%;

/* 🟢 초록색 */
--primary: 142 76% 36%;

/* 🟣 보라색 */
--primary: 263 70% 50%;

/* 🟠 주황색 */
--primary: 25 95% 53%;
```

---

### 4️⃣ 푸터 저작권 바꾸기 (30초)

#### 📁 `components/layout/footer.tsx` 파일 열기

```tsx
// 14줄 찾아서 수정
<p className="text-sm text-muted-foreground">
  © 2024 토토픽. All rights reserved.   ← 여기 수정
</p>
```

---

## 🚀 개발 서버 시작하기

```bash
# VSCode에서 Ctrl + ` 눌러서 터미널 열기
# 아래 명령어 입력

npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

**💡 팁**: 파일을 저장하면 자동으로 새로고침됩니다!

---

## 🎨 자주 쓰는 Tailwind CSS 클래스

### 텍스트 크기
```tsx
text-sm     // 작게
text-base   // 기본
text-lg     // 크게
text-2xl    // 아주 크게
text-4xl    // 초대형
```

### 색상
```tsx
text-blue-500   // 파란 글자
bg-red-100      // 빨간 배경
border-green-500 // 초록 테두리
```

### 여백
```tsx
p-4      // 안쪽 여백
m-4      // 바깥 여백
px-6     // 좌우 여백만
py-8     // 상하 여백만
```

### 정렬
```tsx
text-center  // 가운데 정렬
text-left    // 왼쪽 정렬
text-right   // 오른쪽 정렬
```

---

## 🆘 에러 해결

### 화면이 하얗게 나와요
```bash
# 터미널에서 에러 메시지 확인
# 빨간색 에러를 읽어보세요

# 일반적인 원인:
1. 따옴표를 안 닫았어요: "텍스트
2. 태그를 안 닫았어요: <div>
3. 쉼표를 빼먹었어요: { a: 1 b: 2 }
```

### 변경사항이 안 보여요
```bash
# 1. 파일을 저장했나요? (Ctrl + S)
# 2. 브라우저 새로고침 (Ctrl + Shift + R)
# 3. 서버 재시작
Ctrl + C  (서버 중지)
npm run dev  (서버 시작)
```

---

## 📱 관리자 로그인

```
주소: http://localhost:3000/auth/signin

관리자 계정:
이메일: admin@totopick.com
비밀번호: admin1234

일반 사용자 계정:
이메일: user@test.com
비밀번호: test1234
```

로그인 후 주소창에 `/admin` 입력하면 관리자 페이지로 이동!

---

## 💾 변경사항 저장하기 (Git)

```bash
# 1. 변경사항 확인
git status

# 2. 모든 변경사항 추가
git add .

# 3. 커밋 (설명 메시지 작성)
git commit -m "사이트 이름 변경"

# 4. GitHub에 업로드
git push
```

---

## ✅ 체크리스트

- [ ] `npm run dev`로 서버 시작했나요?
- [ ] 파일을 수정한 후 저장(Ctrl+S) 했나요?
- [ ] 브라우저에서 확인했나요?
- [ ] 에러가 없나요?
- [ ] Git으로 백업했나요?

---

## 📚 더 자세한 내용은?

👉 **[전체 관리 가이드](./HOMEPAGE-MANAGEMENT-GUIDE.md)** 참고하세요!

- 디자인 상세 수정
- 데이터베이스 관리
- 게시판 설정
- 문제 해결 방법

---

**잊지 마세요!** 🎯
1. 작은 것부터 수정
2. 자주 저장하고 테스트
3. 백업은 필수!

