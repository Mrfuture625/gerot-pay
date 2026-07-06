const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kryptpay_admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("kryptpay_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("kryptpay_admin_token");
}

function adminHeaders() {
  const token = getAdminToken();

  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function adminLogin(adminKey: string) {
  const response = await fetch(`${apiUrl}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminKey }),
  });

  if (!response.ok) {
    throw new Error("Invalid admin key");
  }

  return response.json();
}

export async function getAdminInventory() {
  const response = await fetch(`${apiUrl}/admin/inventory`, {
    headers: adminHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load inventory");
  }

  return response.json();
}

export async function getAdminBatches() {
  const response = await fetch(`${apiUrl}/admin/inventory/batches`, {
    headers: adminHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load batches");
  }

  return response.json();
}

export async function importCardCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiUrl}/admin/cards/import`, {
    method: "POST",
    headers: adminHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to import CSV");
  }

  return response.json();
}

export async function getAdminCoupons() {
  const response = await fetch(`${apiUrl}/admin/coupons`, {
    headers: adminHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load coupons");
  }

  return response.json();
}

export async function createAdminCoupon(data: unknown) {
  const response = await fetch(`${apiUrl}/admin/coupons`, {
    method: "POST",
    headers: {
      ...adminHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create coupon");
  }

  return response.json();
}

export async function updateAdminCoupon(id: string, data: unknown) {
  const response = await fetch(`${apiUrl}/admin/coupons/${id}`, {
    method: "PATCH",
    headers: {
      ...adminHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update coupon");
  }

  return response.json();
}

export async function deleteAdminCoupon(id: string) {
  const response = await fetch(`${apiUrl}/admin/coupons/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete coupon");
  }

  return response.json();
}

export async function redeemCoupon(code: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/coupons/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error("Failed to redeem coupon");
  }

  return response.json();
}

export async function getAdminCardPrices() {
  const response = await fetch(`${apiUrl}/admin/card-prices`, {
    headers: adminHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load card prices");
  }

  return response.json();
}

export async function updateAdminCardPrice(
  cardType: "virtual" | "physical",
  priceUsd: number,
) {
  const response = await fetch(`${apiUrl}/admin/card-prices/${cardType}`, {
    method: "PATCH",
    headers: {
      ...adminHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceUsd }),
  });

  if (!response.ok) {
    throw new Error("Failed to update card price");
  }

  return response.json();
}

export async function getAdminEthUsdPrice() {
  const response = await fetch(`${apiUrl}/admin/eth-usd-price`, {
    headers: adminHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load ETH/USD price");
  }

  return response.json();
}

export async function updateAdminEthUsdPrice(priceUsd: number) {
  const response = await fetch(`${apiUrl}/admin/eth-usd-price`, {
    method: "PATCH",
    headers: {
      ...adminHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceUsd }),
  });

  if (!response.ok) {
    throw new Error("Failed to update ETH/USD price");
  }

  return response.json();
}