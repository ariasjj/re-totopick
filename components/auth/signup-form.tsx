"use client"

// 회원가입 폼 컴포넌트 (핸드폰 인증 포함)

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2, Check } from "lucide-react"

const formSchema = z.object({
  username: z.string()
    .min(4, "아이디는 최소 4자 이상이어야 합니다.")
    .max(20, "아이디는 최대 20자까지 가능합니다.")
    .regex(/^[a-zA-Z0-9_]+$/, "아이디는 영문, 숫자, _만 사용 가능합니다."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  passwordConfirm: z.string(),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  phone: z.string().regex(/^010\d{8}$/, "010으로 시작하는 11자리 숫자를 입력하세요."),
  verificationCode: z.string().length(6, "6자리 인증번호를 입력하세요."),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordConfirm"],
})

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [codeSent, setCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [testCode, setTestCode] = useState<string>("")
  const [testMode, setTestMode] = useState(false) // 테스트 모드

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
      phone: "",
      verificationCode: "",
    },
  })

  // 인증번호 발송
  async function sendCode() {
    const phone = form.getValues("phone")
    if (!/^010\d{8}$/.test(phone)) {
      setError("올바른 전화번호를 입력하세요.")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const res = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "인증번호 발송에 실패했습니다.")
        // 인증번호 발송 실패 시 테스트 모드 활성화
        setTestMode(true)
        setCodeSent(true)
        return
      }

      setCodeSent(true)
      // 테스트 모드에서는 인증번호를 표시
      if (data.code) {
        setTestCode(data.code)
      }
      alert("인증번호가 발송되었습니다! (테스트 모드: 콘솔 확인)")
    } catch (error) {
      console.error("인증번호 발송 에러:", error)
      setError("인증번호 발송 중 오류가 발생했습니다.")
      // 에러 발생 시 테스트 모드 활성화
      setTestMode(true)
      setCodeSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 확인
  async function verifyCode() {
    const phone = form.getValues("phone")
    const code = form.getValues("verificationCode")

    if (!code || code.length !== 6) {
      setError("6자리 인증번호를 입력하세요.")
      return
    }

    // 테스트 모드에서는 아무 인증번호나 통과
    if (testMode) {
      setCodeVerified(true)
      setError("")
      alert("전화번호 인증이 완료되었습니다! (테스트 모드)")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const res = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "인증번호가 일치하지 않습니다.")
        return
      }

      setCodeVerified(true)
      alert("전화번호 인증이 완료되었습니다!")
    } catch (error) {
      console.error("인증번호 확인 에러:", error)
      setError("인증번호 확인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!codeVerified) {
      setError("전화번호 인증을 완료해주세요.")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          nickname: values.nickname,
          phone: values.phone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "회원가입에 실패했습니다.")
        return
      }

      // 회원가입 성공 - 자동 로그인
      alert("회원가입이 완료되었습니다! 자동으로 로그인합니다.")
      
      // 자동 로그인 시도
      const loginResult = await signIn("credentials", {
        email: values.username, // 아이디로 로그인
        password: values.password,
        redirect: false,
      })

      if (loginResult?.ok) {
        // 로그인 성공 - 홈으로 이동
        router.push("/")
        router.refresh()
      } else {
        // 로그인 실패 - 로그인 페이지로 이동
        alert("회원가입은 완료되었으나 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.")
        router.push("/auth/signin")
      }
    } catch (error) {
      console.error("회원가입 에러:", error)
      setError("회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          토토픽 계정을 만들고 다양한 혜택을 받으세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {testCode && (
              <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-md">
                🔐 테스트 인증번호: <strong>{testCode}</strong>
              </div>
            )}

            {testMode && (
              <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-md">
                ⚠️ <strong>테스트 모드</strong>: 아무 6자리 숫자나 입력하여 인증하세요 (예: 123456)
              </div>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="영문, 숫자, _ 만 입력 가능 (4-20자)"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    로그인 시 사용할 아이디입니다
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="최소 6자 이상"
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="비밀번호 재입력"
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="닉네임 입력"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        placeholder="01012345678"
                        disabled={isLoading || codeSent}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={sendCode}
                      disabled={isLoading || codeSent}
                    >
                      {codeSent ? "발송완료" : "인증번호"}
                    </Button>
                  </div>
                  <FormDescription>
                    하이픈(-) 없이 숫자만 입력하세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {codeSent && (
              <FormField
                control={form.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인증번호</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="6자리 숫자"
                          disabled={isLoading || codeVerified}
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={verifyCode}
                        disabled={isLoading || codeVerified}
                        variant={codeVerified ? "secondary" : "default"}
                      >
                        {codeVerified ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            완료
                          </>
                        ) : (
                          "확인"
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !codeVerified}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              회원가입
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
              <Link href="/auth/signin" className="text-primary hover:underline">
                로그인
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


