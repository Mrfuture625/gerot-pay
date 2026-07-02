import type { CreateOrderDto } from "@kryptpay/shared-types";
import { ApiClient } from "./client.js";

export function createOrdersApi(client: ApiClient) {
  return {
    create(input: CreateOrderDto) {
      return client.post("/orders", input);
    },

    listByWallet(walletAddress: string) {
      return client.get(`/orders/${walletAddress.toLowerCase()}`);
    },
  };
}