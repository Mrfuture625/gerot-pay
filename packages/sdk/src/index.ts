import { ApiClient } from "./api/client.js";
import { createOrdersApi } from "./api/orders.js";

export function createKryptPaySdk(config: { apiUrl: string }) {
  const client = new ApiClient(config.apiUrl);

  return {
    orders: createOrdersApi(client),
  };
}

export * from "./api/index.js";