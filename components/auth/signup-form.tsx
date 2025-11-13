"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

// 폼 데이터 타입 정의
interface FormData {
  username: string
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  phone: string
  verificationCode: string
}

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Controlled Inputs - 명확한 상태 관리
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    phone: "",
    verificationCode: ""
  })
  
  // 인증 상태
  const [codeSent, setCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [testCode, setTestCode] = useState("")

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log(`🔵 [handleChange] ${name}:`, value.substring(0, 20))
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
  }

  // 인증번호 발송
  const sendCode = async () => {
    const phone = formData.phone.trim()
    console.log("🔵 [sendCode] 시작, 전화번호:", phone)
    
    if (!/^010\d{8}$/.test(phone)) {
      const msg = "010으로 시작하는 11자리 숫자를 입력하세요"
      console.log("❌ [sendCode] 전화번호 형식 오류")
      setError(msg)
      alert(msg)
      return
    }

    try {
      setIsLoading(true)
      setError("")
      console.log("🔵 [sendCode] API 호출 중...")

      const res = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      console.log("🔵 [sendCode] API 응답 상태:", res.status)
      const data = await res.json()
      console.log("🔵 [sendCode] API 응답 데이터:", data)
      
      if (data.code) {
        setTestCode(data.code)
        console.log("🔵 [sendCode] 테스트 코드 설정:", data.code)
        alert(`✅ 테스트 인증번호: ${data.code}`)
      } else if (data.error) {
        console.log("⚠️ [sendCode] API 에러:", data.error)
        alert(`⚠️ ${data.error}`)
      }
      
      setCodeSent(true)
      console.log("✅ [sendCode] codeSent = true 설정 완료")
      alert("✅ 인증번호가 발송되었습니다!")
    } catch (err) {
      console.error("❌ [sendCode] 에러:", err)
      setTestCode("123456")
      setCodeSent(true)
      console.log("⚠️ [sendCode] 테스트 모드 활성화")
      alert("⚠️ 테스트 모드: 123456 입력하세요")
    } finally {
      setIsLoading(false)
      console.log("🔵 [sendCode] 종료")
    }
  }

  // 인증번호 확인
  const verifyCode = async () => {
    const { verificationCode, phone } = formData
    console.log("🔵 [verifyCode] 시작, 코드:", verificationCode)
    
    if (verificationCode.length !== 6) {
      const msg = "6자리 인증번호를 입력하세요"
      setError(msg)
      alert(msg)
      return
    }

    try {
      setIsLoading(true)
      setError("")
      console.log("🔵 [verifyCode] API 호출 중...")

      const res = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone, 
          code: verificationCode,
          testMode: true
        }),
      })

      console.log("🔵 [verifyCode] API 응답 상태:", res.status)
      
      if (res.ok) {
        setCodeVerified(true)
        console.log("✅ [verifyCode] 인증 성공")
        alert("✅ 인증이 완료되었습니다!")
      } else {
        const data = await res.json()
        const msg = data.error || "인증에 실패했습니다"
        console.log("❌ [verifyCode] 인증 실패:", msg)
        setError(msg)
        alert(`❌ ${msg}`)
      }
    } catch (err) {
      console.error("❌ [verifyCode] 에러:", err)
      const msg = "인증 중 오류가 발생했습니다"
      setError(msg)
      alert(`❌ ${msg}`)
    } finally {
      setIsLoading(false)
      console.log("🔵 [verifyCode] 종료")
    }
  }

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { username, email, password, passwordConfirm, nickname, phone } = formData
    
    console.log("================================")
    console.log("🔵 [handleSubmit] 회원가입 시작")
    console.log("================================")
    console.log("📝 입력 데이터:", {
      username,
      email,
      nickname,
      phone,
      password: password ? "***" : "(비어있음)",
      passwordConfirm: passwordConfirm ? "***" : "(비어있음)",
      codeVerified
    })
    
    // 유효성 검사
    if (!username || username.trim().length < 4) {
      const msg = "아이디는 4자 이상이어야 합니다"
      console.log("❌ 유효성 검사 실패:", msg)
      setError(msg)
      alert(msg)
      return
    }
    
    if (!email || !email.includes("@")) {
      const msg = "올바른 이메일을 입력하세요"
      console.log("❌ 유효성 검사 실패:", msg)
      setError(msg)
      alert(msg)
      return
    }
    
    if (!password || password.length < 6) {
      const msg = "비밀번호는 6자 이상이어야 합니다"
      console.log("❌ 유효성 검사 실패:", msg, "현재 길이:", password.length)
      setError(msg)
      alert(msg)
      return
    }
    
    if (password !== passwordConfirm) {
      const msg = "비밀번호가 일치하지 않습니다"
      console.log("❌ 유효성 검사 실패:", msg)
      setError(msg)
      alert(msg)
      return
    }
    
    if (!nickname || nickname.trim().length < 2) {
      const msg = "닉네임은 2자 이상이어야 합니다"
      console.log("❌ 유효성 검사 실패:", msg)
      setError(msg)
      alert(msg)
      return
    }
    
    if (!codeVerified) {
      const msg = "전화번호 인증을 먼저 완료하세요"
      console.log("❌ 인증 검사 실패:", msg)
      setError(msg)
      alert(msg)
      return
    }
    
    console.log("✅ 모든 유효성 검사 통과")
    
    try {
      setIsLoading(true)
      setError("")
      
      console.log("🔵 API 호출 시작...")
      
      const requestBody = {
        username: username.trim(),
        email: email.trim(),
        password,
        nickname: nickname.trim(),
        phone: phone.trim(),
      }
      
      console.log("📤 API 요청 데이터:", {
        ...requestBody,
        password: "***"
      })
      
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      
      console.log("📥 API 응답 상태:", response.status, response.statusText)
      console.log("📥 API 응답 OK:", response.ok)
      
      const result = await response.json()
      console.log("📥 API 응답 데이터:", result)
      
      if (!response.ok) {
        const errorMsg = result.error || "회원가입에 실패했습니다"
        console.log("❌ API 실패:", errorMsg)
        console.log("================================")
        setError(errorMsg)
        alert(`❌ 회원가입 실패!\n\n${errorMsg}`)
        return
      }
      
      console.log("✅ 회원가입 API 성공!")
      console.log("================================")
      setSuccess(true)
      alert("🎉 회원가입 완료! 가입 축하 1,000P가 지급되었습니다.")
      
    } catch (err) {
      console.error("❌ 회원가입 중 에러 발생:", err)
      const msg = (err as Error).message || "회원가입 중 오류가 발생했습니다"
      console.log("================================")
      setError(msg)
      alert(`❌ 회원가입 오류!\n\n${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">🎉 회원가입 완료!</CardTitle>
          <CardDescription className="text-center">토토픽에 오신 것을 환영합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-green-800 mb-2">
              ✨ 회원가입이 완료되었습니다!
            </p>
            <p className="text-gray-600">
              가입 축하 <span className="font-bold text-green-600">1,000P</span>가 지급되었습니다
            </p>
          </div>
          <Button onClick={() => router.push("/auth/signin")} className="w-full">
            로그인하러 가기
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>토토픽 계정을 만들고 다양한 혜택을 받으세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {/* 아이디 */}
          <div>
            <label className="text-sm font-medium">아이디</label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="영문, 숫자, _ 만 입력 가능 (4-20자)"
              disabled={isLoading}
              autoComplete="username"
            />
            <p className="text-xs text-gray-500 mt-1">로그인 시 사용할 아이디입니다</p>
          </div>

          {/* 이메일 */}
          <div>
            <label className="text-sm font-medium">이메일</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="text-sm font-medium">비밀번호</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="최소 6자 이상"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="text-sm font-medium">비밀번호 확인</label>
            <Input
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="text-sm font-medium">닉네임</label>
            <Input
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임 입력"
              disabled={isLoading}
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="text-sm font-medium">전화번호</label>
            <div className="flex gap-2">
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01012345678"
                disabled={isLoading || codeSent}
                autoComplete="tel"
              />
              <Button 
                type="button" 
                onClick={sendCode} 
                disabled={isLoading || codeSent}
              >
                인증번호
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">하이픈(-) 없이 숫자만 입력하세요</p>
          </div>

          {/* 인증번호 */}
          {codeSent && !codeVerified && (
            <div>
              {testCode && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-2">
                  <p className="text-sm text-yellow-800">
                    🔒 테스트 인증번호: <strong>{testCode}</strong>
                  </p>
                </div>
              )}
              <label className="text-sm font-medium">인증번호</label>
              <div className="flex gap-2">
                <Input
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  placeholder="6자리 숫자"
                  maxLength={6}
                  disabled={isLoading}
                />
                <Button 
                  type="button" 
                  onClick={verifyCode} 
                  disabled={isLoading}
                >
                  확인
                </Button>
              </div>
            </div>
          )}

          {/* 인증 완료 표시 */}
          {codeVerified && (
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-sm text-green-800">✅ 전화번호 인증이 완료되었습니다</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !codeVerified}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!codeVerified ? "인증 후 가입 가능" : "회원가입"}
          </Button>
        </form>
        <div className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            로그인
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
