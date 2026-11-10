interface AdminFeedbackBannerProps {
  message?: string | null;
  error?: string | null;
}

export function AdminFeedbackBanner({
  message,
  error,
}: AdminFeedbackBannerProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-[4px] border border-rust bg-bg2 px-4 py-3 text-[13.5px] font-medium text-rust"
      >
        {error}
      </div>
    );
  }

  if (message) {
    return (
      <div
        role="status"
        className="rounded-[4px] border border-rust bg-bg2 px-4 py-3 text-[13.5px] font-medium text-cream"
      >
        {message}
      </div>
    );
  }

  return null;
}
