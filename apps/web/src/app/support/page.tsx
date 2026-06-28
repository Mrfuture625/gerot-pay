import Link from "next/link";
import { Headphones, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/shared/PageHeader";

export default function SupportPage() {
  return (
    <DashboardShell title="Support" subtitle="KryptPay help center">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Support"
          title="Need help with KryptPay?"
          description="Get assistance with card purchases, wallet connection, reloads, withdrawals, referrals and bonus balance activation."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <SupportCard
            icon={Send}
            title="Telegram Support"
            text="Contact the KryptPay team through Telegram."
            href="#"
          />

          <SupportCard
            icon={MessageCircle}
            title="Community"
            text="Join the community for updates and announcements."
            href="#"
          />

          <SupportCard
            icon={ShieldCheck}
            title="Payment Issue"
            text="Report a transaction, card purchase or reload issue."
            href="#"
          />
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
              <Headphones className="h-5 w-5 text-emerald-300" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Common Questions</h2>
              <p className="text-sm text-zinc-400">
                Quick answers for KryptPay users.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <FaqItem
              question="How do I buy a card?"
              answer="Connect your wallet, open Marketplace, choose Virtual or Physical Card and complete the purchase popup."
            />

            <FaqItem
              question="When does bonus balance become active?"
              answer="Virtual Card bonus activates after a $1 reload. Physical Card bonus activates after a $2 reload."
            />

            <FaqItem
              question="Where can I see transactions?"
              answer="The Activity page shows all wallet activity. Each card details page shows card-specific transactions."
            />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function SupportCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof Send;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-emerald-400/30"
    >
      <div className="mb-6 w-fit rounded-2xl border border-white/10 bg-black/30 p-3">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </Link>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
      <p className="font-semibold">{question}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{answer}</p>
    </div>
  );
}