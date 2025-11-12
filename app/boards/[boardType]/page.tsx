"use client"

// 게시판 목록 페이지

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getBoardConfig } from "@/lib/board-config"
import { PenSquare, Search, Eye, MessageCircle } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function BoardListPage() {
  const params = useParams()
  const router = useRouter()
  const boardType = params.boardType as string
  const boardConfig = getBoardConfig(boardType)
  const { data: session } = useSession()

  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadPosts()
  }, [boardType, page, search])

  async function loadPosts() {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/posts?board=${boardConfig?.type}&page=${page}&search=${search}`
      )
      const data = await res.json()

      if (res.ok) {
        setPosts(data.posts)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error("게시글 로드 에러:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!boardConfig) {
    return <div>게시판을 찾을 수 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{boardConfig.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {boardConfig.description}
            </p>
          </div>
          {session && (
            <Button asChild>
              <Link href={`/boards/${boardType}/new`}>
                <PenSquare className="mr-2 h-4 w-4" />
                글쓰기
              </Link>
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {/* 검색 */}
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="검색어 입력..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => loadPosts()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* 게시글 목록 */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              로딩 중...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              게시글이 없습니다.
            </div>
          ) : (
            <>
              {/* 데스크톱 테이블 */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[70%]">제목</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead className="text-center">조회</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <Link
                            href={`/boards/${boardType}/${post.id}`}
                            className="hover:underline"
                          >
                            <div className="flex items-center space-x-2">
                              {post.isNotice && (
                                <Badge variant="destructive">공지</Badge>
                              )}
                              <span>{post.title}</span>
                              {post._count.comments > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  [{post._count.comments}]
                                </span>
                              )}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>{post.author.nickname}</TableCell>
                        <TableCell>
                          {format(new Date(post.createdAt), "MM-dd HH:mm")}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span className="text-sm">{post.views}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 모바일 카드 */}
              <div className="md:hidden space-y-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/boards/${boardType}/${post.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            {post.isNotice && (
                              <Badge variant="destructive" className="text-xs">
                                공지
                              </Badge>
                            )}
                            <p className="font-medium flex-1">{post.title}</p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-3">
                              <span>{post.author.nickname}</span>
                              <span>
                                {format(new Date(post.createdAt), "MM-dd")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {post.views}
                              </span>
                              {post._count.comments > 0 && (
                                <span className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  {post._count.comments}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    이전
                  </Button>
                  <div className="flex items-center px-4">
                    {page} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

