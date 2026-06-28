import {
  Activity,
  CreditCard,
  Gift,
  Home,
  LayoutDashboard,
  Receipt,
  RefreshCw,
  ShoppingBag,
  Upload,
} from "lucide-react";

export const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Cards", href: "/cards", icon: CreditCard },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Reload", href: "/reload", icon: RefreshCw },
  { label: "Withdraw", href: "/withdraw", icon: Upload },
  { label: "Referral", href: "/referrals", icon: Gift },
];