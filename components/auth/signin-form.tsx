"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"

export function SignInForm() {
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [identifier, setIdentifier] = useState("") // 이메일 또는 아이디
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 검증
    if (!identifier || !identifier.trim()) {
      setError("이메일 또는 아이디를 입력해주세요")
      alert("❌ 이메일 또는 아이디를 입력해주세요")
      return
    }

    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다")
      alert("❌ 비밀번호는 6자 이상이어야 합니다")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("🔵 로그인 시도")

      const result = await signIn("credentials", {
        redirect: false,
        email: identifier,
        password: password,
      })

      console.log("📥 로그인 결과:", result)

      if (result?.error) {
        const errorMsg = result.error === "CredentialsSignin"
          ? "이메일/아이디 또는 비밀번호가 올바르지 않습니다"
          : result.error
        
        setError(errorMsg)
        alert(`❌ ${errorMsg}`)
        console.log("❌ 로그인 실패:", errorMsg)
      } else {
        console.log("✅ 로그인 성공!")
        alert("✅ 로그인 성공!")
        router.push("/")
        router.refresh()
      }
    } catch (error: any) {
      console.error("❌ 로그인 에러:", error)
      const msg = error.message || "로그인 중 오류가 발생했습니다"
      setError(msg)
      alert(`❌ ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>이메일 또는 아이디로 로그인하세요</CardDescription>
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

          {/* 이메일 또는 아이디 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              이메일 또는 아이디 <span className="text-red-500">*</span>
            </label>
            <Input
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value)
                setError("")
              }}
              placeholder="이메일 또는 아이디를 입력하세요"
              disabled={isLoading}
              className="h-11"
              autoComplete="username"
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
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
              className="h-11"
              autoComplete="current-password"
            />
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold mt-6"
            disabled={isLoading}
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            로그인
          </Button>

          <div className="text-center text-sm text-gray-600 mt-6 pt-4 border-t">
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
              회원가입
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
