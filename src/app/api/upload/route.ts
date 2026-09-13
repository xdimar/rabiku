import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: max 10 uploads per minute per client
    const clientKey = getClientKey(req.headers);
    const rateCheck = checkRateLimit(`upload:${clientKey}`, {
      maxTokens: 10,
      refillIntervalMs: 60_000,
      refillAmount: 10,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak upload. Coba lagi dalam ${Math.ceil(
            (rateCheck.retryAfterMs || 60_000) / 1000
          )} detik.`,
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    const validAudioTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/x-m4a",
      "audio/aac",
      "audio/webm",
      "audio/flac",
    ];

    const rawExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const isImage = validImageTypes.includes(file.type);
    const isAudio =
      validAudioTypes.includes(file.type) ||
      ["mp3", "wav", "m4a", "ogg"].includes(rawExt);

    if (!isImage && !isAudio) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Format file tidak didukung. Harap gunakan gambar (JPEG, PNG, WEBP) atau audio (MP3, WAV, M4A, OGG).",
        },
        { status: 400 }
      );
    }

    // Size limits: 10MB for images, 25MB for audio
    const maxSize = isAudio ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `Ukuran file terlalu besar (maksimal ${isAudio ? "25MB" : "10MB"}).`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const prefix = isAudio ? "audio" : "photos";
    const filename = `${prefix}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${rawExt}`;
    const contentType = file.type || (isAudio ? "audio/mpeg" : "image/jpeg");

    // Upload to Cloudflare R2 if credentials are provided
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrlBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

    if (bucketName && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      try {
        await r2.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: buffer,
            ContentType: contentType,
          })
        );

        const fileUrl = publicUrlBase
          ? `${publicUrlBase}/${filename}`
          : `https://${bucketName}.r2.cloudflarestorage.com/${filename}`;

        return NextResponse.json({
          success: true,
          url: fileUrl,
          name: file.name,
          size: file.size,
          type: isAudio ? "audio" : "image",
        });
      } catch (r2Err) {
        console.warn("Cloudflare R2 upload failed, falling back to Data URL:", r2Err);
      }
    }

    // Fallback to Data URL if R2 is not reachable or during local testing
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      name: file.name,
      size: file.size,
      type: isAudio ? "audio" : "image",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mengunggah file" },
      { status: 500 }
    );
  }
}
