"use client";

export function LogoutButton() {
  async function logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      window.location.href = "/login";
    } else {
      alert("Logout failed.");
    }
  }

  return (
    <button
      onClick={logout}
      className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}