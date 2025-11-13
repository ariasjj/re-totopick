"use client"

// 로그인 폼 컴포넌트

import { useState, useRef } from "react" // useRef 추가
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
  const [error, setError] = useState<string>("")

  // Uncontrolled Inputs - 브라우저 자동화 호환
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // ref에서 값 읽기
    const email = emailRef.current?.value || ""
    const password = passwordRef.current?.value || ""
    
    console.log("================================")
    console.log("🔵 로그인 시작")
    console.log("================================")
    
    // 유효성 검사
    if (!email || email.length < 1) {
      const msg = "이메일 또는 아이디를 입력하세요"
      setError(msg)
      alert(msg)
      console.log("❌ 유효성 검사 실패:", msg)
      return
    }
    
    if (!password || password.length < 6) {
      const msg = "비밀번호는 최소 6자 이상이어야 합니다"
      setError(msg)
      alert(msg)
      console.log("❌ 유효성 검사 실패:", msg)
      return
    }
    
    console.log("✅ 유효성 검사 통과")
    
    try {
      setIsLoading(true)
      setError("")

      console.log("🔵 NextAuth 로그인 시도...")
      console.log("📤 전송할 데이터:", {
        email,
        password: "***" // 보안을 위해 마스킹
      })

      // NextAuth 로그인 시도
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      })

      console.log("📥 로그인 결과:", result)

      // 에러 처리
      if (result?.error) {
        const errorMsg = "이메일/아이디 또는 비밀번호가 올바르지 않습니다"
        console.log("❌ 로그인 실패:", errorMsg)
        setError(errorMsg)
        alert(`로그인 실패!\n\n${errorMsg}`)
        console.log("================================")
        return
      }

      // 로그인 성공
      if (result?.ok) {
        console.log("✅ 로그인 성공!")
        alert("✅ 로그인 성공!")
        console.log("================================")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("❌ 로그인 중 에러 발생:", error)
      const msg = "로그인 중 오류가 발생했습니다"
      setError(msg)
      alert(`로그인 오류!\n\n${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>
          토토픽 계정으로 로그인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {/* 이메일 또는 아이디 */}
          <div>
            <label className="text-sm font-medium">이메일 또는 아이디</label>
            <Input
              ref={emailRef} // ref 연결
              name="email"
              type="text"
              placeholder="이메일 또는 아이디를 입력하세요"
              disabled={isLoading}
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="text-sm font-medium">비밀번호</label>
            <Input
              ref={passwordRef} // ref 연결
              name="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            로그인
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/auth/signup" className="text-primary hover:underline">
              회원가입
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


