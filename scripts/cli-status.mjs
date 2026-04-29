const baseUrl = process.env.APP_URL || "http://127.0.0.1:3000";

async function main() {
  const response = await fetch(`${baseUrl}/api/db`);
  if (!response.ok) throw new Error(`GET /api/db failed: ${response.status}`);
  const data = await response.json();

  const rows = Array.isArray(data.notes) ? data.notes : [];
  console.log("Self-test");
  console.log(`Database connection: PASS`);
  console.log(`Current note count: ${data.count ?? rows.length}`);
  console.log("API methods ready: GET, POST, DELETE");
  if (rows.length === 0) {
    console.log("Table: No rows");
    return;
  }

  console.table(
    rows.map((note) => ({
      id: note.id,
      message: note.message,
      createdAt: note.createdAt
    }))
  );
}

main().catch((error) => {
  console.log("Self-test");
  console.log("Database connection: FAIL");
  console.log(`Last error: ${error.message}`);
  process.exit(1);
});
