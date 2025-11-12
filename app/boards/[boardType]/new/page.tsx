"use client"

// 게시글 작성 페이지

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBoardConfig } from "@/lib/board-config"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
})

export default function NewPostPage() {
  const params = useParams()
  const router = useRouter()
  const boardType = params.boardType as string
  const boardConfig = getBoardConfig(boardType)
  const { data: session, status } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // 로그인 체크
  useEffect(() => {
    if (status === "unauthenticated") {
      alert("로그인이 필요한 서비스입니다.")
      router.push("/auth/signin")
    }
  }, [status, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  // 로딩 중일 때는 빈 화면 표시
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // 로그인하지 않았을 때는 아무것도 표시하지 않음 (리다이렉트 중)
  if (!session) {
    return null
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setError("")

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          boardType: boardConfig?.type,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "게시글 작성에 실패했습니다.")
        return
      }

      alert("게시글이 작성되었습니다! (+10 포인트)")
      router.push(`/boards/${boardType}/${data.post.id}`)
    } catch (error) {
      console.error("게시글 작성 에러:", error)
      setError("게시글 작성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!boardConfig) {
    return <div>게시판을 찾을 수 없습니다.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{boardConfig.name} - 글쓰기</CardTitle>
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="제목을 입력하세요"
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="내용을 입력하세요"
                      className="min-h-[300px]"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                작성하기
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                취소
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

