const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;

function adminHeaders() {
  return {
    "x-admin-key": adminKey ?? "",
  };
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