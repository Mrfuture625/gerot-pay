import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  password: string;
  confirmPassword: string;
  onNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onContinue: () => void;
};

export function SignupStepOne({
  name,
  password,
  confirmPassword,
  onNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onContinue,
}: Props) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
      />

      <Button
        type="button"
        className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  );
}