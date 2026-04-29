import { prisma } from "../../../lib/prisma";

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" }
  });
  return Response.json({ ok: true, count: notes.length, notes });
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof payload?.message === "string" ? payload.message.trim() : "";

  if (!message) {
    return Response.json({ ok: false, error: "message is required" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: { message }
  });

  return Response.json({ ok: true, note }, { status: 201 });
}

export async function DELETE() {
  const result = await prisma.note.deleteMany({});
  return Response.json({ ok: true, deleted: result.count });
}
