export function getErrorMessage(err: any, fallback: string) {
   return (
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      fallback
   );
}
