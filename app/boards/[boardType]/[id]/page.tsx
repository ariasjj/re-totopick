"use client"

// 게시글 상세 페이지

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Calendar, User, MessageCircle, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPost()
  }, [params.id])

  async function loadPost() {
    try {
      setLoading(true)
      const res = await fetch(`/api/posts/${params.id}`)
      const data = await res.json()

      if (res.ok) {
        setPost(data.post)
      }
    } catch (error) {
      console.error("게시글 로드 에러:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCommentSubmit() {
    if (!comment.trim()) {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId: params.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "댓글 작성에 실패했습니다.")
        return
      }

      alert("댓글이 작성되었습니다! (+5 포인트)")
      setComment("")
      loadPost() // 새로고침
    } catch (error) {
      console.error("댓글 작성 에러:", error)
      alert("댓글 작성 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return
    }

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("게시글이 삭제되었습니다.")
        router.push(`/boards/${params.boardType}`)
      } else {
        const data = await res.json()
        alert(data.error || "삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("삭제 에러:", error)
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (!post) {
    return <div className="text-center py-8">게시글을 찾을 수 없습니다.</div>
  }

  const isAuthor = session?.user?.id === post.author.id
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div className="space-y-6">
      {/* 게시글 */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {post.isNotice && <Badge variant="destructive">공지</Badge>}
              <CardTitle className="text-2xl">{post.title}</CardTitle>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                {post.author.nickname}
                {post.author.role === "ADMIN" && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    관리자
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
              </div>
              <div className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                조회 {post.views}
              </div>
              <div className="flex items-center">
                <MessageCircle className="mr-1 h-4 w-4" />
                댓글 {post.comments.length}
              </div>
            </div>

            {/* 작성자/관리자 버튼 */}
            {(isAuthor || isAdmin) && (
              <div className="flex space-x-2">
                {isAuthor && (
                  <Button size="sm" variant="outline">
                    <Pencil className="mr-1 h-3 w-3" />
                    수정
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  삭제
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="prose max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
        </CardContent>
      </Card>

      {/* 댓글 작성 */}
      {session ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">댓글 작성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="댓글을 입력하세요 (+5 포인트)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitting}
              rows={3}
            />
            <Button onClick={handleCommentSubmit} disabled={submitting}>
              댓글 작성
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-3">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
            <Button onClick={() => router.push("/auth/signin")}>
              로그인
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 댓글 목록 */}
      {post.comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              댓글 {post.comments.length}개
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {comment.author.nickname}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "yyyy-MM-dd HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* 대댓글 */}
                {comment.replies?.length > 0 && (
                  <div className="ml-8 space-y-3 border-l-2 pl-4">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {reply.author.nickname}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(reply.createdAt), "yyyy-MM-dd HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 목록으로 버튼 */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => router.back()}>
          목록으로
        </Button>
      </div>
    </div>
  )
}

