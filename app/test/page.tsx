// 간단한 테스트 페이지

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">테스트 페이지</h1>
      <p className="mt-4">이 페이지가 보이면 Next.js는 정상 작동 중입니다!</p>
      <div className="mt-4">
        <p>데이터베이스 연결: {process.env.DATABASE_URL ? "✅ 설정됨" : "❌ 없음"}</p>
        <p>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? "✅ 설정됨" : "❌ 없음"}</p>
      </div>
    </div>
  )
}


