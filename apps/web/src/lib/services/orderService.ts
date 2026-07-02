import type { CreateOrderDto } from "@kryptpay/shared-types";



export async function createOrder(input: CreateOrderDto) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return null;
  }

  const response = await fetch(`${apiUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
  const error = await response.json().catch(() => null);
  throw new Error(error?.message || "Failed to save order");
}

  return response.json();
}