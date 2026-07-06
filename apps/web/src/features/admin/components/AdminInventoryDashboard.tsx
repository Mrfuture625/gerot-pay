"use client";

import { useEffect, useState } from "react";
import {
  getAdminInventory,
  getAdminBatches,
  importCardCsv,
   getAdminCardPrices,
  updateAdminCardPrice,
} from "@/lib/services/adminService";

type InventoryResponse = {
  virtual: {
    available: number;
    sold: number;
  };
  physical: {
    available: number;
    sold: number;
  };
};

type Batch = {
  batch: string | null;
  _count: {
    id: number;
  };
};

export function AdminInventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prices, setPrices] = useState({ virtual: "", physical: "" });
const [savingPrice, setSavingPrice] = useState<"virtual" | "physical" | null>(null);

  async function loadData() {
    setLoading(true);

    try {
      const [inventoryData, batchData, priceData] = await Promise.all([
      getAdminInventory(),
      getAdminBatches(),
      getAdminCardPrices(),
    ]);

      setInventory(inventoryData);
      setBatches(batchData.batches);
      setPrices({
  virtual: String(priceData.prices.virtual),
  physical: String(priceData.prices.physical),
});
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpdatePrice(cardType: "virtual" | "physical") {
  const priceUsd = Number(prices[cardType]);

  if (!priceUsd || priceUsd <= 0) {
    alert("Please enter a valid price.");
    return;
  }

  setSavingPrice(cardType);

  try {
    const result = await updateAdminCardPrice(cardType, priceUsd);

    alert(
      `${cardType} card price updated to $${priceUsd}\nTx: ${result.result.txHash}`,
    );

    await loadData();
  } catch (err) {
    console.error(err);
    alert("Failed to update card price.");
  }

  setSavingPrice(null);
}

  async function handleUpload() {
  console.log("Upload clicked", selectedFile);

  if (!selectedFile) {
    alert("Please choose a CSV file first.");
    return;
  }

  setUploading(true);

    try {
      const result = await importCardCsv(selectedFile);

      alert(
        `Imported ${result.imported} cards\nDuplicates ${result.duplicates}\nInvalid ${result.invalid}`,
      );

      setSelectedFile(null);

      await loadData();
    } catch (err) {
      console.error(err);
      alert("CSV upload failed.");
    }

    setUploading(false);
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Inventory...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <h1 className="text-4xl font-bold">
        Admin Inventory
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">
            Virtual Cards
          </h2>

          <p className="mt-4">
            Available: {inventory?.virtual.available}
          </p>

          <p>
            Sold: {inventory?.virtual.sold}
          </p>

          <div className="mt-5 space-y-2">
  <label className="block text-sm font-medium">
    On-chain Price USD
  </label>

  <input
    type="number"
    value={prices.virtual}
    onChange={(e) =>
      setPrices((prev) => ({ ...prev, virtual: e.target.value }))
    }
    className="w-full rounded-xl border px-4 py-3 text-black"
  />

  <button
    type="button"
    onClick={() => handleUpdatePrice("virtual")}
    disabled={savingPrice === "virtual"}
    className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-black disabled:opacity-60"
  >
    {savingPrice === "virtual" ? "Updating..." : "Update Virtual Price"}
  </button>
</div>

        </div>
           
        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">
            Physical Cards
          </h2>

          <p className="mt-4">
            Available: {inventory?.physical.available}
          </p>

          <p>
            Sold: {inventory?.physical.sold}
          </p>

          <div className="mt-5 space-y-2">
  <label className="block text-sm font-medium">
    On-chain Price USD
  </label>

  <input
    type="number"
    value={prices.physical}
    onChange={(e) =>
      setPrices((prev) => ({ ...prev, physical: e.target.value }))
    }
    className="w-full rounded-xl border px-4 py-3 text-black"
  />

  <button
    type="button"
    onClick={() => handleUpdatePrice("physical")}
    disabled={savingPrice === "physical"}
    className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-black disabled:opacity-60"
  >
    {savingPrice === "physical" ? "Updating..." : "Update Physical Price"}
  </button>
</div>

        </div>

      </div>

      <div className="rounded-2xl border p-6 space-y-4">
        <h2 className="text-2xl font-semibold">
          Upload Card CSV
        </h2>

        <input
  type="file"
  accept=".csv,text/csv"
  onChange={(e) => {
    const file = e.target.files?.[0] ?? null;
    console.log("Selected file:", file);
    setSelectedFile(file);
  }}
/>

        <button
  type="button"
  onClick={handleUpload}
  disabled={uploading}
  className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black disabled:opacity-60"
>
  {uploading ? "Uploading..." : "Upload CSV"}
</button>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Imported Batches
        </h2>

        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Batch</th>
              <th>Total Cards</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((batch) => (
              <tr key={batch.batch ?? "unknown"}>
                <td>{batch.batch}</td>
                <td>{batch._count.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={loadData}
        className="rounded-xl border px-6 py-3"
      >
        Refresh Inventory
      </button>
    </div>
  );
}