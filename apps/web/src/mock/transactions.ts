import {
  BadgePercent,
  CreditCard,
  Gift,
  RefreshCw,
  Upload,
} from "lucide-react";

export const mockCardTransactions = [
  {
    title: "Card Purchased",
    detail: "Card purchase completed",
    amount: "-1.00 USDC",
    time: "Today",
    icon: CreditCard,
  },
  {
    title: "$KPAY Reward Added",
    detail: "Reward received after purchase",
    amount: "+10 $KPAY",
    time: "Today",
    icon: Gift,
  },
  {
    title: "Coupon Applied",
    detail: "WELCOME50 discount used",
    amount: "50%",
    time: "Today",
    icon: BadgePercent,
  },
  {
    title: "Card Reloaded",
    detail: "Funds added to this card",
    amount: "+25.00 USDC",
    time: "Yesterday",
    icon: RefreshCw,
  },
  {
    title: "Card Withdrawn",
    detail: "Funds withdrawn from card",
    amount: "-10.00 USDC",
    time: "Last week",
    icon: Upload,
  },
];