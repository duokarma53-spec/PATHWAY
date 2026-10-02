import { NextRequest, NextResponse } from "next/server";
import { getSecureDocumentUrl } from "@/lib/storage/r2";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing 'key' query parameter" }, { status: 400 });
  }

  const signedUrl = await getSecureDocumentUrl(key, 3600); // 1 hour link

  if (!signedUrl) {
    return NextResponse.json({ error: "Could not generate download URL or file not found" }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: signedUrl });
}
