import type { WriteContractParameters } from "wagmi/actions";
import { sepolia } from "wagmi/chains";
import {
  KryptPay_ABI,
  KryptPay_CONTRACT_ADDRESS,
} from "@/lib/contracts/gerotpay";

export function createPurchaseRequest(
  productId: number,
  value: bigint
): WriteContractParameters<typeof KryptPay_ABI, "buyCard"> {
  return {
    address: KryptPay_CONTRACT_ADDRESS,
    abi: KryptPay_ABI,
    functionName: "buyCard",
    args: [BigInt(productId)],
    value,
    chainId: sepolia.id,
  };
}