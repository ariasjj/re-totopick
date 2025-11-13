"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // 폼 데이터
  const [formData, setFormData] = useState({
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

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError("")
  }

  // 인증번호 발송
  const sendCode = async () => {
    if (!/^010\d{8}$/.test(formData.phone)) {
      setError("010으로 시작하는 11자리 숫자를 입력하세요")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const res = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      })

      const data = await res.json()
      
      if (data.code) {
        setTestCode(data.code)
        alert(`테스트 인증번호: ${data.code}`)
      }
      
      setCodeSent(true)
      alert("인증번호가 발송되었습니다!")
    } catch (err) {
      console.error(err)
      setTestCode("123456")
      setCodeSent(true)
      alert("테스트 모드: 아무 6자리나 입력하세요")
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 확인
  const verifyCode = async () => {
    if (formData.verificationCode.length !== 6) {
      setError("6자리 인증번호를 입력하세요")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const res = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: formData.phone, 
          code: formData.verificationCode,
          testMode: true
        }),
      })

      if (res.ok) {
        setCodeVerified(true)
        alert("인증이 완료되었습니다!")
      } else {
        const data = await res.json()
        setError(data.error || "인증에 실패했습니다")
      }
    } catch (err) {
      console.error(err)
      setError("인증 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("================================")
    console.log("회원가입 시작")
    console.log("================================")
    
    // 유효성 검사
    if (!formData.username || formData.username.length < 4) {
      setError("아이디는 4자 이상이어야 합니다")
      return
    }
    
    if (!formData.email || !formData.email.includes("@")) {
      setError("올바른 이메일을 입력하세요")
      return
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다")
      return
    }
    
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다")
      return
    }
    
    if (!formData.nickname || formData.nickname.length < 2) {
      setError("닉네임은 2자 이상이어야 합니다")
      return
    }
    
    if (!codeVerified) {
      setError("전화번호 인증을 먼저 완료하세요")
      return
    }
    
    try {
      setIsLoading(true)
      setError("")
      
      console.log("API 호출 준비...")
      console.log("데이터:", {
        username: formData.username,
        email: formData.email,
        nickname: formData.nickname,
        phone: formData.phone
      })
      
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          phone: formData.phone,
        }),
      })
      
      console.log("API 응답 상태:", response.status)
      
      const result = await response.json()
      console.log("API 응답 데이터:", result)
      
      if (!response.ok) {
        throw new Error(result.error || "회원가입에 실패했습니다")
      }
      
      console.log("✅ 회원가입 성공!")
      console.log("================================")
      setSuccess(true)
      
    } catch (err: any) {
      console.error("❌ 회원가입 에러:", err)
      console.log("================================")
      setError(err.message || "회원가입 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  // 성공 화면
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
          {/* 아이디 */}
          <div>
            <label className="text-sm font-medium">아이디</label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="영문, 숫자, _ 만 입력 가능 (4-20자)"
              disabled={isLoading}
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

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* 회원가입 버튼 */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !codeVerified}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!codeVerified ? "인증 후 가입 가능" : "회원가입"}
          </Button>

          {/* 로그인 링크 */}
          <div className="text-center text-sm text-gray-600">
            이미 계정이 있으신가요? <Link href="/auth/signin" className="text-blue-600 hover:underline">로그인</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
