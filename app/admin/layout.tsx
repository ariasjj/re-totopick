// 관리자 레이아웃

import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">관리자 페이지</h1>
        <p className="text-blue-100 mt-1">사이트 전체를 관리할 수 있습니다</p>
      </div>
      {children}
    </div>
  )
}


