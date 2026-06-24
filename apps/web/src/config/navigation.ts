import {
  Activity,
  CreditCard,
  Gift,
  Headphones,
  Home,
  RefreshCw,
  Upload,
  User,
} from "lucide-react";

export const userNavigation = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Card", href: "/cards", icon: CreditCard },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Reload", href: "/reload", icon: RefreshCw },
  { label: "Withdraw", href: "/withdraw", icon: Upload },
  { label: "Referral", href: "/referrals", icon: Gift },
  { label: "Support", href: "/support", icon: Headphones },
  { label: "Account", href: "/account", icon: User },
];