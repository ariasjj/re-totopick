# 인증번호 오류 해결 가이드

## 🚨 문제
회원가입 시 "인증번호 발송 중 오류가 발생했습니다" 에러 발생

## ✅ 해결 방법

### 1단계: Vercel 환경 변수 추가

#### A. Vercel 대시보드 접속
```
https://vercel.com/ariasjj/re-totopick/settings/environment-variables
```

#### B. 환경 변수 추가
1. **"Add New"** 버튼 클릭 (페이지 상단 또는 우측)

2. **입력 내용**:
   ```
   Key:   SMS_MODE
   Value: test
   ```

3. **Environments 선택**:
   - ☑ Production
   - ☑ Preview  
   - ☑ Development
   
   **3개 모두 반드시 체크!** ✅

4. **"Save"** 버튼 클릭

---

### 2단계: 재배포

#### A. Deployments 페이지로 이동
```
https://vercel.com/ariasjj/re-totopick/deployments
```

#### B. 재배포 실행
1. 최신 배포(맨 위) 찾기
2. 오른쪽의 **"⋯"** (점 3개) 클릭
3. **"Redeploy"** 선택
4. 확인 팝업에서 **"Redeploy"** 다시 클릭

#### C. 배포 완료 대기
- 상태: ⏳ Building... → ✅ Ready
- 소요 시간: **약 2-3분**

---

### 3단계: 테스트

배포가 완료되면:

1. **회원가입 페이지 새로고침** (Ctrl + Shift + R)
   ```
   https://re-totopick.vercel.app/signup
   ```

2. **테스트 데이터 입력**:
   ```
   아이디: verceltest2
   이메일: verceltest2@test.com
   비밀번호: Test1234!
   비밀번호 확인: Test1234!
   닉네임: 버셀테스트2
   전화번호: 01099998888
   ```

3. **"인증번호 전송"** 클릭

4. **성공 메시지 확인**:
   ```
   ✅ "인증번호가 발송되었습니다"
   ```

5. **아무 숫자나 입력** (예: 123456)

6. **회원가입 완료!** 🎉

---

## 🔍 문제 원인

### 왜 이 에러가 발생했나요?

**코드는 정상**입니다! ✅
- GitHub에 올라간 코드는 수정되었습니다
- 로컬 환경에서는 `.env.local` 파일에 `SMS_MODE=simulation` 설정되어 있어서 작동합니다

**하지만 Vercel에는 환경 변수가 없었습니다!** ❌
- Vercel은 로컬의 `.env.local` 파일을 읽지 못합니다
- Vercel 설정에 직접 환경 변수를 추가해야 합니다

---

## 📋 환경 변수 확인 방법

### 현재 설정된 환경 변수 보기:

1. Vercel 대시보드 접속:
   ```
   https://vercel.com/ariasjj/re-totopick/settings/environment-variables
   ```

2. 페이지를 아래로 스크롤

3. **현재 환경 변수 목록** 확인:
   ```
   DATABASE_URL       ✅
   NEXTAUTH_SECRET    ✅
   NEXTAUTH_URL       ✅
   CRON_SECRET        ✅
   SMS_MODE           ❓ (이것을 추가해야 합니다!)
   ```

---

## ⚠️ 주의사항

### 환경 변수를 추가한 후 **반드시** 재배포하세요!

환경 변수는 추가만 하면 안 됩니다!
- ❌ 환경 변수만 추가 → 적용 안 됨
- ✅ 환경 변수 추가 + 재배포 → 적용됨

---

## 🎯 요약

### 해야 할 일 (순서대로):

1. ✅ Vercel 로그인
2. ✅ Environment Variables 페이지로 이동
3. ✅ SMS_MODE=test 추가 (3개 환경 모두 체크)
4. ✅ Save 클릭
5. ✅ Deployments 페이지로 이동
6. ✅ Redeploy 클릭
7. ⏳ 2-3분 대기
8. ✅ 회원가입 테스트

---

## 💡 빠른 링크

### Vercel 설정 페이지:
- **환경 변수 추가**: https://vercel.com/ariasjj/re-totopick/settings/environment-variables
- **재배포**: https://vercel.com/ariasjj/re-totopick/deployments

### 테스트 페이지:
- **회원가입**: https://re-totopick.vercel.app/signup

---

## 📞 완료 후 확인

설정이 완료되면:
- ✅ "인증번호가 발송되었습니다" 메시지 표시
- ✅ 아무 숫자나 입력하면 인증 성공
- ✅ 회원가입 정상 작동

---

**환경 변수를 추가하고 재배포한 후 결과를 알려주세요!** 😊

