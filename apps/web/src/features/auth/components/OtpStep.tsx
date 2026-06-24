import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  otp: string;
  loading?: boolean;
  onOtpChange: (value: string) => void;
  onComplete: () => void;
};

export function OtpStep({
  otp,
  loading = false,
  onOtpChange,
  onComplete,
}: Props) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter the 6-digit OTP"
        value={otp}
        maxLength={6}
        onChange={(e) => onOtpChange(e.target.value)}
      />

      <Button
        type="button"
        className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
        onClick={onComplete}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Complete Signup"}
      </Button>
    </div>
  );
}