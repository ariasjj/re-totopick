"use client"

// 로그인 폼 컴포넌트

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().min(1, "이메일 또는 아이디를 입력하세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
})

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setError("")

      // NextAuth 로그인 시도
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/",
      })

      console.log("로그인 결과:", result)

      // 에러 처리
      if (result?.error) {
        setError("이메일/아이디 또는 비밀번호가 올바르지 않습니다.")
        return
      }

      // 로그인 성공
      if (result?.ok) {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("로그인 에러:", error)
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일 또는 아이디</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="이메일 또는 아이디를 입력하세요"
                      type="text"
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
                      placeholder="••••••••"
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </CardContent>
    </Card>
  )
}


