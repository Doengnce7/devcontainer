"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [dbStatus, setDbStatus] = useState("CHECKING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadNotes() {
    try {
      setError("");
      const response = await fetch("/api/db", { cache: "no-store" });
      const data = await response.json();
      setNotes(Array.isArray(data.notes) ? data.notes : []);
      setDbStatus("PASS");
    } catch (err) {
      setDbStatus("FAIL");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function createNote() {
    setLoading(true);
    try {
      const message = `test-${new Date().toISOString()}`;
      await fetch("/api/db", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message })
      });
      await loadNotes();
    } finally {
      setLoading(false);
    }
  }

  async function clearNotes() {
    setLoading(true);
    try {
      await fetch("/api/db", { method: "DELETE" });
      await loadNotes();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Coder Devcontainer Ready</h1>
      <p>Next.js runs in the web container on port 3000.</p>
      <p>Postgres runs in the db container on port 5432.</p>
      <p>Docker-in-Docker is enabled in the workspace service.</p>
      <p>DB check endpoint: /api/db</p>
      <h2>Self-test</h2>
      <p>Database connection: {dbStatus}</p>
      <p>Current note count: {notes.length}</p>
      <p>API methods ready: GET, POST, DELETE</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={createNote} disabled={loading}>
          Add Test Note
        </button>
        <button type="button" onClick={clearNotes} disabled={loading}>
          Clear All Notes
        </button>
        <button type="button" onClick={loadNotes} disabled={loading}>
          Refresh
        </button>
      </div>
      {error ? <p>Last error: {error}</p> : null}
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {notes.length === 0 ? (
            <tr>
              <td colSpan="3">No rows</td>
            </tr>
          ) : (
            notes.map((note) => (
              <tr key={note.id}>
                <td>{note.id}</td>
                <td>{note.message}</td>
                <td>{new Date(note.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
