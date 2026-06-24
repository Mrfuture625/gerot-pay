import type { WriteContractParameters } from "wagmi/actions";
import { sepolia } from "wagmi/chains";
import {
  GEROTPAY_ABI,
  GEROTPAY_CONTRACT_ADDRESS,
} from "@/lib/contracts/gerotpay";

export function createPurchaseRequest(
  productId: number,
  value: bigint
): WriteContractParameters<typeof GEROTPAY_ABI, "buyCard"> {
  return {
    address: GEROTPAY_CONTRACT_ADDRESS,
    abi: GEROTPAY_ABI,
    functionName: "buyCard",
    args: [BigInt(productId)],
    value,
    chainId: sepolia.id,
  };
}