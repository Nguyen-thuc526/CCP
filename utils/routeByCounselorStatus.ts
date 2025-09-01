// utils/routeByCounselorStatus.ts
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function routeByCounselorStatus(status: number | null | undefined, router: AppRouterInstance) {
  if (status === 0) {
    // bị block
    router.replace("/login?blocked=1");
    return;
  }
  if (status === 1) {
    router.replace("/counselor/dashboard");
    return;
  }
  // 2 hoặc null/undefined: chưa được duyệt/chưa có dữ liệu
  router.replace("/counselor/certificates");
}
