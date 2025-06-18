import { useState, ReactNode } from "react";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface StatusUIOptions {
  onRetry?: () => void;
  retryText?: string;
  noPadding?: boolean;
  customError?: ReactNode;
  customLoading?: ReactNode;
}

export function useErrorLoadingWithUI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('null');

  const startLoading = () => {
    setError(null);
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setErrorMessage = (message: string) => {
    setError(message);
    setLoading(false);
  };

  const reset = () => {
    setError(null);
    setLoading(false);
  };

  const renderStatus = ({
    onRetry,
    retryText = "Thử lại",
    noPadding = false,
    customError,
    customLoading,
  }: StatusUIOptions = {}) => {
    if (loading) {
      return customLoading || (
        <div className="flex items-center justify-center ">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="animate-spin w-5 h-5" />
            Đang tải dữ liệu...
          </div>
        </div>

      );
    }

    if (error) {
      return customError || (
        <div className="flex justify-center items-center">
          <Alert variant="destructive" className={`${noPadding ? "" : "my-4"} max-w-lg w-full`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 mt-1 text-destructive" />
                <div>
                  <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </div>
              </div>
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <RefreshCcw className="w-4 h-4 mr-1" />
                  {retryText}
                </Button>
              )}
            </div>
          </Alert>
        </div>
      );
    }

    return null;
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorMessage,
    reset,
    renderStatus,
  };
}
