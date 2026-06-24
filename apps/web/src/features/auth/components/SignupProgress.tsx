import type { SignupStep } from "../types";

type Props = {
  step: SignupStep;
};

export function SignupProgress({ step }: Props) {
  const steps = [
    "Account",
    "Telegram",
    "OTP",
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const current = index + 1;

          return (
            <div
              key={label}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all
                  ${
                    current < step
                      ? "bg-emerald-400 border-emerald-400 text-black"
                      : current === step
                      ? "border-emerald-400 bg-emerald-400/20 text-emerald-300"
                      : "border-zinc-700 text-zinc-500"
                  }`}
                >
                  {current < step ? "✓" : current}
                </div>

                <span
                  className={`mt-2 text-xs ${
                    current <= step
                      ? "text-white"
                      : "text-zinc-500"
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-3 h-[2px] flex-1 ${
                    current < step
                      ? "bg-emerald-400"
                      : "bg-zinc-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}