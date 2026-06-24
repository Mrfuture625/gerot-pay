import { Button } from "@/components/ui/button";

type Props = {
  botUrl: string;
  onVerifyTelegram: () => void;
  onContinue: () => void;
};

export function TelegramVerificationStep({
  botUrl,
  onVerifyTelegram,
  onContinue,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
        Open Telegram, start the bot, then enter the OTP it sends you.
      </div>

      <Button
        type="button"
        className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
        onClick={onVerifyTelegram}
      >
        Open Telegram Bot
      </Button>

      {botUrl && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onContinue}
        >
          I have the OTP
        </Button>
      )}
    </div>
  );
}