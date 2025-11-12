// 푸터 컴포넌트

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="font-bold text-lg mb-4">TOTOPICK</h3>
            <p className="text-sm text-muted-foreground">
              현명한 선택, 토토픽에서
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h4 className="font-semibold mb-4">커뮤니티</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/boards/toto-site" className="hover:text-foreground">토토사이트</Link></li>
              <li><Link href="/boards/muktu-report" className="hover:text-foreground">먹튀제보</Link></li>
              <li><Link href="/boards/sports-analysis" className="hover:text-foreground">스포츠분석</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/attendance" className="hover:text-foreground">출석체크</Link></li>
              <li><Link href="/inquiry" className="hover:text-foreground">1:1문의</Link></li>
              <li><Link href="/boards/review" className="hover:text-foreground">이용후기</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/inquiry" className="hover:text-foreground">문의하기</Link></li>
              <li><Link href="#" className="hover:text-foreground">공지사항</Link></li>
              <li><Link href="#" className="hover:text-foreground">이용약관</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-center text-muted-foreground">
            © 2024 TOTOPICK. All rights reserved. | 책임있는 베팅을 권장합니다.
          </p>
        </div>
      </div>
    </footer>
  )
}


