"use client"

// 1:1 문의 페이지

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Send, MessageSquare, CheckCircle } from "lucide-react"
import { format } from "date-fns"

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(10, "내용은 최소 10자 이상 입력해주세요."),
})

export default function InquiryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      loadInquiries()
    }
  }, [status])

  async function loadInquiries() {
    try {
      setLoading(true)
      const res = await fetch("/api/inquiry")
      const data = await res.json()

      if (res.ok) {
        setInquiries(data.inquiries)
      }
    } catch (error) {
      console.error("문의 목록 조회 에러:", error)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true)

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "문의 작성에 실패했습니다.")
        return
      }

      alert("문의가 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.")
      form.reset()
      loadInquiries()
    } catch (error) {
      console.error("문의 작성 에러:", error)
      alert("문의 작성 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      {/* 문의 작성 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            1:1 문의하기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="문의 제목을 입력하세요"
                        disabled={submitting}
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
                    <FormLabel>문의 내용</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="문의 내용을 자세히 입력해주세요"
                        className="min-h-[150px]"
                        disabled={submitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={submitting}>
                <Send className="mr-2 h-4 w-4" />
                문의하기
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 내 문의 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            내 문의 내역
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              문의 내역이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry: any) => (
                <Card key={inquiry.id}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{inquiry.title}</h3>
                          {inquiry.status === "PENDING" ? (
                            <Badge variant="secondary">답변대기</Badge>
                          ) : (
                            <Badge variant="default">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              답변완료
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm")}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">
                        {inquiry.content}
                      </p>
                    </div>

                    {inquiry.answer && (
                      <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                        <p className="text-xs text-blue-600 font-semibold mb-1">
                          관리자 답변
                          {inquiry.answeredAt && (
                            <span className="ml-2 font-normal">
                              {format(new Date(inquiry.answeredAt), "yyyy-MM-dd HH:mm")}
                            </span>
                          )}
                        </p>
                        <p className="text-sm whitespace-pre-wrap">
                          {inquiry.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

