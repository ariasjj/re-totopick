"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2, CheckCircle2, AlertCircle, Phone } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  
  // 상태
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // 폼 데이터
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  
  // 인증 관련
  const [verificationCode, setVerificationCode] = useState("")
  const [testCode, setTestCode] = useState("")
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)

  // 인증번호 발송
  const handleSendCode = async () => {
    console.log("📱 전화번호 확인:", phone, "길이:", phone.length)
    
    // 전화번호 검증
    if (!phone || phone.trim() === "") {
      alert("❌ 전화번호를 입력해주세요")
      return
    }
    
    if (phone.length !== 11) {
      alert(`❌ 전화번호는 정확히 11자리여야 합니다\n(현재 ${phone.length}자리 입력됨)`)
      return
    }
    
    if (!/^010\d{8}$/.test(phone)) {
      alert("❌ 전화번호는 010으로 시작해야 합니다")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      console.log("📱 인증번호 발송 시작...")
      
      // 타임아웃 설정 (10초)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.log("⏱️ 요청 시간 초과")
      }, 10000)

      const res = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await res.json()
      console.log("📡 API 응답:", data)

      if (res.ok && data.code) {
        // 성공: 테스트 인증번호 받음
        setTestCode(data.code)
        setShowCodeInput(true)
        console.log("✅ 인증번호 발송 성공")
        alert(`✅ 인증번호가 발송되었습니다!\n\n📱 테스트 인증번호: ${data.code}\n\n위 번호를 입력해주세요`)
      } else if (res.ok) {
        // 성공했지만 코드가 없음 (실제 SMS 발송)
        setShowCodeInput(true)
        alert("✅ 인증번호가 발송되었습니다!\n\nSMS로 받은 인증번호를 입력해주세요")
      } else {
        // 실패
        throw new Error(data.error || "인증번호 발송 실패")
      }
    } catch (error: any) {
      console.error("❌ 인증번호 발송 에러:", error)
      
      // 에러 시 테스트 모드로 전환
      setTestCode("123456")
      setShowCodeInput(true)
      
      if (error.name === 'AbortError') {
        alert("⏱️ 요청 시간이 초과되었습니다\n\n테스트 모드로 전환합니다\n인증번호: 123456")
      } else {
        alert(`❌ ${error.message || '인증번호 발송 중 오류 발생'}\n\n테스트 모드로 전환합니다\n인증번호: 123456`)
      }
      
      setError("테스트 모드가 활성화되었습니다. 인증번호 123456을 입력하세요")
    } finally {
      setIsLoading(false)
      console.log("📱 인증번호 발송 프로세스 완료")
    }
  }

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert("❌ 6자리 인증번호를 입력해주세요")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: verificationCode, testMode: true }),
      })

      if (res.ok) {
        setPhoneVerified(true)
        alert("✅ 인증 완료!")
      } else {
        const data = await res.json()
        alert(`❌ ${data.error || "인증 실패"}`)
      }
    } catch (error) {
      console.error(error)
      alert("❌ 인증 중 오류 발생")
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 검증
    if (!username || username.length < 4) {
      setError("아이디는 4자 이상이어야 합니다")
      alert("❌ 아이디는 4자 이상이어야 합니다")
      return
    }
    if (!email || !email.includes("@")) {
      setError("올바른 이메일을 입력해주세요")
      alert("❌ 올바른 이메일을 입력해주세요")
      return
    }
    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다")
      alert("❌ 비밀번호는 6자 이상이어야 합니다")
      return
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다")
      alert("❌ 비밀번호가 일치하지 않습니다")
      return
    }
    if (!nickname || nickname.length < 2) {
      setError("닉네임은 2자 이상이어야 합니다")
      alert("❌ 닉네임은 2자 이상이어야 합니다")
      return
    }
    if (!phoneVerified) {
      setError("전화번호 인증을 완료해주세요")
      alert("❌ 전화번호 인증을 완료해주세요")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("🔵 회원가입 API 호출")
      
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, nickname, phone }),
      })

      console.log("📥 응답:", res.status)
      
      const data = await res.json()
      console.log("📥 데이터:", data)

      if (!res.ok) {
        throw new Error(data.error || "회원가입 실패")
      }

      console.log("✅ 회원가입 성공!")
      
      // 성공 메시지 표시
      alert("🎉 회원가입이 완료되었습니다!\n\n✅ 가입 축하 1,000P가 지급되었습니다!\n\n이제 로그인하실 수 있습니다.")
      
      setSuccess(true)
      
    } catch (error: any) {
      console.error("❌ 에러:", error)
      const msg = error.message || "회원가입 중 오류 발생"
      setError(msg)
      alert(`❌ 회원가입 실패\n\n${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 성공 화면
  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">회원가입 완료!</CardTitle>
          <CardDescription className="text-lg">토토픽에 오신 것을 환영합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-800 mb-4">
              🎉 가입 축하합니다! 🎉
            </p>
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-2">가입 축하 포인트</p>
              <p className="text-5xl font-bold text-green-600">1,000P</p>
              <p className="text-gray-600 mt-2">적립 완료</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push("/auth/signin")} 
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            로그인하러 가기 →
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 폼 화면
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>토토픽 계정을 만들고 다양한 혜택을 받으세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 에러 표시 */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* 아이디 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              아이디 <span className="text-red-500">*</span>
            </label>
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError("")
              }}
              placeholder="4자 이상 (영문, 숫자, _)"
              disabled={isLoading}
              className="h-11"
            />
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              이메일 <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              placeholder="example@email.com"
              disabled={isLoading}
              className="h-11"
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="6자 이상"
              disabled={isLoading}
              className="h-11"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value)
                setError("")
              }}
              placeholder="비밀번호 재입력"
              disabled={isLoading}
              className="h-11"
            />
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              닉네임 <span className="text-red-500">*</span>
            </label>
            <Input
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value)
                setError("")
              }}
              placeholder="2자 이상"
              disabled={isLoading}
              className="h-11"
            />
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  console.log("📱 전화번호 입력:", value, "길이:", value.length)
                  setPhone(value)
                  setError("")
                }}
                placeholder="01012345678 (숫자만 11자리)"
                disabled={isLoading || phoneVerified}
                maxLength={11}
                className="h-11"
              />
              <Button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading || phoneVerified}
                className="whitespace-nowrap px-6"
                variant={phoneVerified ? "secondary" : "default"}
              >
                {phoneVerified ? "인증완료" : "인증번호"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">하이픈(-) 없이 숫자만 입력</p>
          </div>

          {/* 인증번호 입력 */}
          {showCodeInput && !phoneVerified && (
            <div className="space-y-3">
              {testCode && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">테스트 인증번호</p>
                    <p className="text-2xl font-bold text-amber-700">{testCode}</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  인증번호 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))
                      setError("")
                    }}
                    placeholder="6자리 숫자"
                    disabled={isLoading}
                    maxLength={6}
                    className="h-11"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                    className="whitespace-nowrap px-8"
                  >
                    확인
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 인증 완료 표시 */}
          {phoneVerified && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-green-800">전화번호 인증 완료</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold mt-6"
            disabled={isLoading || !phoneVerified}
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {!phoneVerified ? "전화번호 인증 필요" : "회원가입"}
          </Button>

          <div className="text-center text-sm text-gray-600 mt-6 pt-4 border-t">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline font-semibold">
              로그인
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
