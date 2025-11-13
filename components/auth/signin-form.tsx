"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Controlled Inputs - 명확한 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { email, password } = formData
    
    console.log("================================")
    console.log("🔵 [handleSubmit] 로그인 시작")
    console.log("================================")
    console.log("📝 입력 데이터:", {
      email,
      password: password ? "***" : "(비어있음)"
    })
    
    // 유효성 검사
    if (!email || email.trim().length === 0) {
      const msg = "이메일 또는 아이디를 입력하세요"
      console.log("❌ 유효성 검사 실패:", msg)
      setError(msg)
      alert(msg)
      return
    }

    if (!password || password.length < 6) {
      const msg = "비밀번호는 최소 6자 이상이어야 합니다"
      console.log("❌ 유효성 검사 실패:", msg, "현재 길이:", password.length)
      setError(msg)
      alert(msg)
      return
    }

    console.log("✅ 모든 유효성 검사 통과")

    try {
      setIsLoading(true)
      setError("")
      
      console.log("🔵 NextAuth signIn 호출 중...")
      
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      })

      console.log("📥 NextAuth 응답:", result)

      if (result?.error) {
        console.log("❌ 로그인 실패:", result.error)
        console.log("================================")
        const errorMsg = "이메일/아이디 또는 비밀번호가 올바르지 않습니다."
        setError(errorMsg)
        alert(`❌ ${errorMsg}`)
        return
      }

      console.log("✅ 로그인 성공!")
      console.log("================================")
      
      alert("✅ 로그인 성공!")
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("❌ 로그인 중 에러 발생:", err)
      const msg = "로그인 중 오류가 발생했습니다."
      console.log("================================")
      setError(msg)
      alert(`❌ ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>토토픽 계정으로 로그인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">이메일 또는 아이디</label>
            <Input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 또는 아이디를 입력하세요"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm font-medium">비밀번호</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            로그인
          </Button>
        </form>
        <div className="text-center text-sm text-gray-500 mt-4">
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            회원가입
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
