"use client"

// 메인 네비게이션 - 9개 게시판 메뉴

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Star,
  AlertTriangle,
  AlertOctagon,
  Info,
  TrendingUp,
  Megaphone,
  MessageCircle,
  Calendar,
  HelpCircle,
} from "lucide-react"

const menuItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/boards/toto-site", label: "토토사이트", icon: Star },
  { href: "/boards/muktu-report", label: "먹튀제보", icon: AlertTriangle },
  { href: "/boards/scam-report", label: "사기신고", icon: AlertOctagon },
  { href: "/boards/toto-info", label: "토토정보", icon: Info },
  { href: "/boards/sports-analysis", label: "스포츠분석", icon: TrendingUp },
  { href: "/boards/promotion", label: "홍보방", icon: Megaphone },
  { href: "/boards/review", label: "토토후기", icon: MessageCircle },
  { href: "/attendance", label: "출석부", icon: Calendar },
  { href: "/inquiry", label: "1:1문의", icon: HelpCircle },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-muted/40">
      <div className="container">
        <div className="flex items-center overflow-x-auto py-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}


