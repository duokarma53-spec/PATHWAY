import { NextRequest, NextResponse } from "next/server";
import { uploadDocumentToR2 } from "@/lib/storage/r2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const studentId = (formData.get("studentId") as string) || "general";
    const category = (formData.get("category") as string) || "misc";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create structured R2 key: students/[studentId]/[category]/[timestamp]_[filename]
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `students/${studentId}/${category}/${Date.now()}_${cleanFileName}`;

    const result = await uploadDocumentToR2({
      key,
      buffer,
      contentType: file.type || "application/octet-stream",
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      key: result.key,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      url: result.url,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("Storage upload route error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
