"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

// isPending ตรงนี้คือสถานะจริงระหว่าง Next.js กำลังเปลี่ยนหน้า/โหลด route ใหม่
export function useRealPageLoading() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  return { isLoading: isPending, navigate };
}