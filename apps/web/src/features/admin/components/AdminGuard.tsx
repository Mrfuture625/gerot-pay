"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/services/adminService";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }

    const token = getAdminToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05060a] text-white">
        Checking admin access...
      </main>
    );
  }

  return <>{children}</>;
}