"use client"

// 먹튀/사기 신고 페이지

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, Loader2 } from "lucide-react"

const formSchema = z.object({
  siteName: z.string().min(1, "사이트명을 입력해주세요."),
  siteUrl: z.string().optional(),
  reportType: z.enum(["먹튀", "사기"]),
  amount: z.string().optional(),
  description: z.string().min(10, "신고 내용은 최소 10자 이상 입력해주세요."),
})

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      siteUrl: "",
      reportType: "먹튀",
      amount: "",
      description: "",
    },
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true)

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          amount: values.amount ? parseInt(values.amount) : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "신고 작성에 실패했습니다.")
        return
      }

      alert("신고가 접수되었습니다. 확인 후 조치하겠습니다.")
      router.push(`/boards/${params.boardType}`)
    } catch (error) {
      console.error("신고 작성 에러:", error)
      alert("신고 작성 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <AlertTriangle className="mr-2 h-5 w-5" />
          사이트 신고하기
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>신고 유형</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="신고 유형 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="먹튀">먹튀</SelectItem>
                      <SelectItem value="사기">사기</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사이트명</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="사이트 이름을 입력하세요"
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
              name="siteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사이트 URL (선택)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    사이트 주소를 알고 있다면 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>피해금액 (선택)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    숫자만 입력하세요 (단위: 원)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>신고 내용</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="피해 상황을 자세히 설명해주세요"
                      className="min-h-[200px]"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    증거자료나 상세한 내용을 포함하면 신속한 처리에 도움이 됩니다
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-yellow-50 p-4 rounded-md text-sm text-yellow-800">
              <p className="font-semibold mb-2">⚠️ 주의사항</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>허위 신고 시 법적 책임이 발생할 수 있습니다</li>
                <li>신고 내용은 관리자 검토 후 게시됩니다</li>
                <li>개인정보는 보호되며 공개되지 않습니다</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                신고하기
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
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

