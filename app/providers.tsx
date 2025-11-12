"use client"

// 전역 프로바이더 (React Query 등)

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { ReactQueryProvider } from "@/lib/react-query"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      // 에러가 발생해도 앱이 계속 작동하도록 설정
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </SessionProvider>
  )
}

