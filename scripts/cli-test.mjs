const candidates = process.env.APP_URL
  ? [process.env.APP_URL]
  : ["http://127.0.0.1:3000", "http://web:3000"];

async function pickBaseUrl() {
  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}/api/db`);
      if (res.ok) return baseUrl;
    } catch {
      // try next
    }
  }
  throw new Error("No reachable app URL (tried 127.0.0.1 and web)");
}

let baseUrl = "";

async function req(path, init) {
  const res = await fetch(`${baseUrl}${path}`, init);
  const json = await res.json();
  if (!res.ok) throw new Error(`${init?.method || "GET"} ${path} failed: ${res.status}`);
  return json;
}

async function main() {
  baseUrl = await pickBaseUrl();
  console.log("CLI flow test started");

  const before = await req("/api/db");
  console.log(`Before count: ${before.count}`);

  const created = await req("/api/db", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: `cli-${Date.now()}` })
  });
  console.log(`Created note id: ${created.note.id}`);

  const afterCreate = await req("/api/db");
  if ((afterCreate.count ?? 0) < 1) throw new Error("Create check failed");
  console.log(`After create count: ${afterCreate.count}`);

  const deleted = await req("/api/db", { method: "DELETE" });
  console.log(`Deleted rows: ${deleted.deleted}`);

  const afterDelete = await req("/api/db");
  if ((afterDelete.count ?? -1) !== 0) throw new Error("Delete check failed");
  console.log(`After delete count: ${afterDelete.count}`);
  console.log("CLI flow test passed");
}

main().catch((error) => {
  console.error(`CLI flow test failed: ${error.message}`);
  process.exit(1);
});
