const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL 

export type RolePayload = {
  name: string;
  permissions: Record<string, string[]>;
};

export async function createRole(payload: RolePayload) {
  const res = await fetch(`${API_BASE}/api/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.detail || "Create role failed");
  return data;
}

export async function getAllRoles() {
  const res = await fetch(`${API_BASE}/api/roles`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Get roles failed");
  return data;
}
