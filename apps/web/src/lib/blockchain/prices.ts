import { formatEther } from "viem";

export function weiToEth(value: bigint) {
  return formatEther(value);
}